import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss'],
})
export class UserFavoritesComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  data = localStorage.getItem('user');
  userData = JSON.parse(this.data!);

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.getMovies();
    } else {
      this.router.navigate(['welcome']);
    }
  }

  /**
   * Get all movies from the GET movies endpoint.
   * Filter by the user's (localStorage('user')) favorite's list
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;

      // Make sure favoriteMovies is an array before filtering
      if (!this.userData || !this.userData.favoriteMovies) {
        console.error('Favorite movies data is missing.');
        this.favoriteMovies = [];
        return;
      }

      // Filter the movies array by the user's favorite movies
      this.favoriteMovies = this.movies.filter((m) => {
        console.log(`Checking if ${m._id} is in the user's favorites`);
        return this.userData.favoriteMovies.includes(m._id);
      });

      console.log('Filtered favorite movies:', this.favoriteMovies);
    });
  }

  isFavoriteMovie(movieId: string): boolean {
    return this.userData.favoriteMovies.includes(movieId);
  }

  /**
   * Remove a movie from a user's favorites
   */
  removeFromFavorites(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });

      this.userData.favoriteMovies = this.userData.favoriteMovies.filter(
        (favId: string) => favId !== id
      );
      localStorage.setItem('user', JSON.stringify(this.userData));

      this.getMovies();
    });
  }
}
