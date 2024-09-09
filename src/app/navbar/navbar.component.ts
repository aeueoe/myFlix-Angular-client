import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Called when creating an instance of the class
   * @constructor
   * @param router - the Router module for navigation
   */

  constructor(public snackBar: MatSnackBar, public router: Router) {}

  ngOnInit(): void {}

  public launchMovies(): void {
    this.router.navigate(['movies']);
  }

  public launchProfile(): void {
    this.router.navigate(['profile']);
  }

  public launchFavorites(): void {
    this.router.navigate(['favorites']);
  }

  public logoutUser(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('Logout successful!', 'OK', {
      duration: 3000,
    });
  }
}
