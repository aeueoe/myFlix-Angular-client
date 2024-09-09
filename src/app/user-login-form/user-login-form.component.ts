import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatInputModule, FormsModule],
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent {
  @Input() userData = {
    Username: '',
    Password: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.dialogRef.close();

        this.snackBar.open(this.userData.Username, 'Welcome back!', {
          duration: 3000,
        });
        this.router.navigate(['movies']);
      },
      (response) => {
        this.snackBar.open(response, 'OK', {
          duration: 3000,
        });
      }
    );
  }
}
