import { Component } from '@angular/core';
import { UrlsService } from './urls.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(private urlsService: UrlsService) { }

  showResultField: boolean = false;
  showCustomField: boolean = false;

  toggleCustomField() {
    this.showCustomField = !this.showCustomField;
  }

  baseUrl = 'www.fasturl.com/';

  originalURL = '';
  customUrl = this.baseUrl;

  handleCustomInputChange(event: any) {
    const text = event.target.value;
    if (text.length < this.baseUrl.length)
      event.target.value = this.baseUrl;
  }

  async shortenURL() {
    const formOk = this.validateForm();
    if (!formOk) return;

    let id;
    if (this.showCustomField) {
      //Get custom ID
      id = this.customUrl.replace(this.baseUrl, '');

      //Check if custom URL is being used
      const  associatedURL = await this.urlsService.getUrl(id)
    }
    else {
      //Generate random ID
      id = Math.random().toString(36).substring(2, 8);
      alert('Your shortened URL is: ' + this.baseUrl + id);
    }
  }

  validateForm() {
    if (this.originalURL === '') {
      alert('Please enter a URL to shorten');
      return false;
    }

    if (this.showCustomField && this.customUrl === this.baseUrl) {
      alert('Please enter a custom URL');
      return false;
    }

    return true;
  }

}

