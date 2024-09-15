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
   * Retrieves all movies and filters them based on the user's favorite movies list.
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

  /**
   * Checks if a movie is in the user's favorites list.
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is a favorite, otherwise false.
   */
  isFavoriteMovie(movieId: string): boolean {
    return this.userData.favoriteMovies.includes(movieId);
  }

  /**
   * Removes a movie from the user's favorites and updates the local storage and component state.
   * @param id - The ID of the movie to remove from favorites.
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
