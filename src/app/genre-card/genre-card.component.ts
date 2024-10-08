import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-genre',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './genre-card.component.html',
  styleUrls: ['./genre-card.component.scss'],
})
export class GenreCardComponent implements OnInit {
  /**
   * Called when creating an instance of the class
   * @constructor
   * @param data pulled from the genre object
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) {}

  ngOnInit(): void {}
}
