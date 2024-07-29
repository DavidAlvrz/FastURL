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
    else {
      event.target.value = event.target.value.trim();
    }
  }

  async shortenURL() {
    const formOk = this.validateForm();
    if (!formOk) return;

    let id = '';
    if (this.showCustomField) {
      //Get custom ID
      id = this.customUrl.replace(this.baseUrl, '');

      //Check if custom URL is being used
      const response = await this.urlsService.getUrl(id);
      if (response) {
        alert('Custom URL already in use');
        return;
      }
    }
    else {
      //Generate random ID
      let freeIdFound = false;
      while (!freeIdFound) {
        id = Math.random().toString(36).substring(2, 8);
        const response = await this.urlsService.getUrl(id);
        if (!response) {
          freeIdFound = true;
        }
      }
    }

    //Save URL
    await this.urlsService.saveUrl(id, this.originalURL);

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

