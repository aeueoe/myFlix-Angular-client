import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Called when creating an instance of the class
   * @constructor
   * @param router - the Router module for navigation
   */

  constructor(public router: Router) {}

  ngOnInit(): void {}

  public launchMovies(): void {
    this.router.navigate(['movies']);
  }

 
  public logoutUser(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
