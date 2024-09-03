import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-director',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './director-card.component.html',
  styleUrls: ['./director-card.component.scss'],
})
export class DirectorCardComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      bio: string;
      birth: string;
      death?: string;
    }
  ) {}

  ngOnInit(): void {}
}
