import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <nav>
      <h1 class="main-title"> <fa-icon [icon]="fabolt"></fa-icon> Fast URL </h1>
      <h6 class="subtitle"> Shorten your URLs for free, no ads included!</h6>
    </nav>
  `
})
export class NavbarComponent {
  fabolt = faBolt;
}
