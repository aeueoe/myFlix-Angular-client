import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  faves: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
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
}
