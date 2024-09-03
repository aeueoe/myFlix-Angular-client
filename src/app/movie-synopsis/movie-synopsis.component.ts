import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-synopsis',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './movie-synopsis.component.html',
  styleUrls: ['./movie-synopsis.component.scss'],
})
export class MovieSynopsisComponent implements OnInit {
  /**
   * Called when creating an instance of the class
   * @constructor
   * @param data pulled from Description key of movies array
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Description: string;
      Language: string;
      ReleaseYear: string;
      CountryOfOrigin: string;
      Runtime: string;
    }
  ) {}

  ngOnInit(): void {}
}
