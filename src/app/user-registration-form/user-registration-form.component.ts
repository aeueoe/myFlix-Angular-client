import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatInputModule, FormsModule],
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  registerUser(): void {
    console.log('Registering user...');
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.dialogRef.close();
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error('Registration error:', error);
        this.snackBar.open('Registration failed. Please try again.', 'OK', {
          duration: 3000,
        });
      }
    );
  }
}
