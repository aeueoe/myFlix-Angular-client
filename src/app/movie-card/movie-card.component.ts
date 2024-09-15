import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent,
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  data = localStorage.getItem('user');
  userData = JSON.parse(this.data!);

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.getMovies();
    } else {
      this.router.navigate(['welcome']);
      this.getFavorites();
    }
  }

  /**
   * Retrieves all movies from the database and assigns them to the movies property.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Fetches the user's favorite movies and updates the favoriteMovies property.
   */
  getFavorites(): void {
    this.fetchApiData.getUser(this.userData.Username).subscribe(
      (resp: any) => {
        if (resp.user && resp.user.favoriteMovies) {
          this.favoriteMovies = resp.user.favoriteMovies;
        } else {
          this.favoriteMovies = []; // Set an empty array if data is not available
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favoriteMovies = []; // Set an empty array on error as well
      }
    );
  }

  /**
   * Checks if a movie is already in the user's favorites.
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is a favorite, otherwise false.
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies
      ? user.favoriteMovies.indexOf(movieId) >= 0
      : false;
  }

  /**
   * Opens a dialog with details of the director.
   * @param name - The name of the director.
   * @param bio - A short biography of the director.
   * @param birth - The birth date of the director.
   * @param death - The death date of the director.
   */

  openDirectorDialog(
    name: string,
    bio: string,
    birth: string,
    death: string
  ): void {
    console.log('Director Data:', { name, bio, birth, death });
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: name,
        bio: bio,
        birth: birth,
        death: death,
      },
      width: '600px',
    });
  }

  /**
   * Opens a dialog with movie synopsis including description, language, release year, country of origin, and runtime.
   * @param movie - The movie object containing synopsis details.
   */
  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: movie.description,
        Language: movie.language,
        ReleaseYear: movie.releaseYear,
        CountryOfOrigin: movie.countryOfOrigin,
        Runtime: movie.runtime,
      },
      width: '600px',
    });
  }

  /**
   * Opens a dialog with genre details.
   * @param name - The name of the genre.
   * @param description - The description of the genre.
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '600px',
    });
  }

  /**
   * Adds or removes a movie from the user's favorites and updates the favorites list.
   * @param id - The ID of the movie to add or remove from favorites.
   */

  addToFavorites(id: string): void {
    console.log(id);
    if (this.isFavoriteMovie(id)) {
      this.removeFromFavorites(id);
    } else {
      this.fetchApiData.addFavoriteMovie(id).subscribe((response: any) => {
        if (response === 'Movie has been added to favorites') {
          this.snackBar.open('Movie added to favorites', 'OK', {
            duration: 2000,
          });
          this.getFavorites();
        } else {
          this.snackBar.open('Failed to add movie to favorites', 'OK', {
            duration: 2000,
          });
        }
      });
    }
  }

  /**
   * Removes a movie from the user's favorites and updates the favorites list.
   * @param id - The ID of the movie to remove from favorites.
   */
  removeFromFavorites(id: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });

      const username = localStorage.getItem('Username');
      if (username !== null) {
        this.fetchApiData
          .getFavoriteMovies(username)
          .subscribe((favorites: any) => {
            this.favoriteMovies = favorites;
          });
      }
    });
  }
}
