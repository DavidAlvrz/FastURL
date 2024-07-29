import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  
  showResultField: boolean = false;
  showCustomField: boolean = false;

  shortenURL() {
    this.showResultField = true;
  }

  toggleCustomField() {
    this.showCustomField = !this.showCustomField;
  } 

  baseUrl = 'www.fasturl.com/';
  customUrl = this.baseUrl;

  handleCustomInputChange(event: any) {
    const text = event.target.value;
    if(text.length < this.baseUrl.length)
      event.target.value = this.baseUrl;
  }


}
