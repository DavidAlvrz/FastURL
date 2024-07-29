import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <nav>
      <h1 class="main-title"> Fast URL </h1>
      <h6 class="subtitle"> Shorten your URLs for free, no ads included!</h6>
    </nav>
  `
})
export class NavbarComponent {

}
