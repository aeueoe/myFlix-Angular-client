import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * Opens the user registration form in a MatDialog modal.
   * @returns void
   */

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
    });
  }

  /**
   * Opens the user login form in a MatDialog modal.
   * @returns void
   */

  openLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '400px',
    });
  }
}
