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
   * Get all movies from the database
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

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
   * Check if a movie is a user's favorite already
   * */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies
      ? user.favoriteMovies.indexOf(movieId) >= 0
      : false;
  }
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

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '600px',
    });
  }

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
   * Removes a movie from a user's favorites
   * */
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
