import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    NavbarComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    favoriteMovies: [],
  };

  formUserData: any = {
    Username: '',
    Password: '',
    Email: '',
  };

  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  userLoaded: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.formUserData = {
      Username: this.user.Username,
      Email: this.user.Email,
      Password: '',
    };
  }

  getUser(): void {
    let user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userLoaded = true;
    }
  }

  updateUser(): void {
    let formData = { ...this.formUserData };
    if (!formData.Password) {
      delete formData.Password;
    }

    const user = { ...this.user, ...formData };
    this.fetchApiData.editUser(user).subscribe((result: any) => {
      console.log('User update success:', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.formUserData = {
        Username: this.user.Username,
        Email: this.user.Email,
        Password: '',
      };
      this.snackBar.open(
        'User Info Updated! Please Logout to See the Updated Information in Your Account',
        'OK',
        {
          duration: 3000,
        }
      );
    });
  }

  deleteUser(): void {
    console.log('deleteUser function called:', this.userData.Username);
    if (confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('You have successfully deleted your account', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['profile']).then(() => {
      window.location.reload();
    });
  }
}
