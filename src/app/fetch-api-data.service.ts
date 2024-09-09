import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const apiUrl = 'https://movieapi-aeueoes-projects.vercel.app/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Get user data from local storage
  private getUserData(): any {
    const userdata = localStorage.getItem('user');
    return userdata ? JSON.parse(userdata) : null;
  }

  // User registration
  public userRegistration(userData: any): Observable<any> {
    console.log(userData);
    return this.http
      .post(apiUrl + 'users', userData)
      .pipe(catchError(this.handleError));
  }

  // User login
  public userLogin(userData: any): Observable<any> {
    console.log(userData);
    return this.http
      .post(apiUrl + 'login', userData)
      .pipe(catchError(this.handleError));
  }

  // Get user
  getUser(Username: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(Username);
    return this.http
      .get(apiUrl + 'users/' + Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch all movies
   * @retuns All movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.Username, updatedUser, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a movie by title
  getMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/:Title', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Get director by name
  getDirector(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors/:name', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Get genre by name
  getGenre(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'genre/:name', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Before:', user.favoriteMovies);
    user.favoriteMovies.push(movieId);
    console.log('After:', user.favoriteMovies);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(
        apiUrl + 'users/' + user.Username + '/favoriteMovies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text', // Add this option
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const index = user.favoriteMovies.indexOf(movieId);
    if (index > -1) {
      user.favoriteMovies.splice(index, 1);
    }

    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .delete(
        apiUrl + 'users/' + user.Username + '/favoriteMovies/' + movieId,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text',
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Get favorite movies
  getFavoriteMovies(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(Username);
    return this.http
      .get(apiUrl + 'users/' + Username + '/favoriteMovies/', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  // Non-typed response extraction
  private extractResponseData(res: any | object): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.log(error);
      console.log(error.error);
      console.error('Some error occurred:', error.error.message);
    } else {
      console.log(error);
      console.log(error.error);
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something did not work; please try again later.')
    );
  }
}
