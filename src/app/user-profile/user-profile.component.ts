import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component representing the user profile
 * @selector 'app-user-profile'
 * @templateUrl './user-profile.component.html'
 * @styleUrls ['./user-profile.component.scss']
 */

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };
  FavoriteMovies: any[] = [];
  movies: any[] = [];
  user: any = {};

  /**
   * Called when creating an instance of the class
   * @param fetchProfile - connects the client to the API
   * @param snackBar - provides feedback after user interaction by displaying notifications
   * @param router - the Router module for navigation
   */

  constructor(
    public fetchProfile: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  //once component has mounted these functions must be invoked, ie the profile info of the user & their list of fav movies
  ngOnInit(): void {
    this.userProfile();
 
  }

  userProfile(): void {
    this.user = this.fetchProfile.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Password = this.user.Password;
    this.userData.Email = this.user.Email;
    this.userData.Birthday = this.user.Birthday;
    this.fetchProfile.getAllMovies().subscribe((response) => {
      this.FavoriteMovies = response.filter((movie: any) =>
        this.user.FavoriteMovies.includes(movie._id)
      );
    });
  }

  updateProfile(): void {
    this.fetchProfile.editUser(this.userData).subscribe((response) => {
      console.log('Profile Update', response);
      localStorage.setItem('user', JSON.stringify(response));
      this.snackBar.open('Profile updated successfully', 'OK', {
        duration: 2000,
      });
    });
  }

   deleteProfile(): void {
    if(confirm('Are you sure? This cannot be undone.')) {
    this.fetchApiData.deleteUser().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['welcome']);
      this.snackBar.open('Account Deleted', 'OK', {
        duration: 3000
        });
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']).then(() => {
      window.location.reload();
    });
  }

}

  getFavMovies(): void {
    this.user = this.fetchProfile.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log(`Here is this users ${this.FavoriteMovies}`);
  }
}
