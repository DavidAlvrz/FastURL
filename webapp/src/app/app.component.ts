import { Component } from '@angular/core';
import { UrlsService } from './urls.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSkull } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private urlsService: UrlsService) { }

  facog = faCog;
  faskull = faSkull;
  samplePlaceholder = 'https://www.fasterurl.com/go/dontVisitMe';

  baseUrl = 'www.fasterurl.com/go/';

  loading = false;
  serviceDown = false;

  originalURLField = {
    show: true,
    value: '',
    error: ''
  }

  customURLField = {
    show: false,
    value: this.baseUrl,
    error: ''
  }

  shortenedlURLField = {
    show: false,
    value: '',
    msg: ''
  }

  requests = {

    getUrl: async (id: string) => {
      try {
        return await this.urlsService.getUrl(id);
      } catch (e) {
        this.serviceDown = true;
        return null;
      }
    },
    saveUrl: async (id: string, url: string) => {
      try {
        return await this.urlsService.saveUrl(id, url);
      } catch (e) {
        this.serviceDown = true;
        return null;
      }
    }

  }

  toggleCustomField() {
    if (this.loading || this.shortenedlURLField.show) return;
    this.customURLField.show = !this.customURLField.show;
    this.customURLField.error = '';
  }

  handleCustomInputChange(event: any) {
    const text = event.target.value;
    if (text.length < this.baseUrl.length)
      event.target.value = this.baseUrl;
    else {
      event.target.value = event.target.value.trim();
    }
  }

  async shortenURL() {
    if (this.loading) return;

    // UI
    this.loading = true;

    //Validate form
    const formOk = await this.validateForm();
    if (!formOk) {
      this.loading = false;
      return;
    } else {
      this.originalURLField.error = '';
      this.customURLField.error = '';
    }

    // Get ID
    let id = '';
    if (this.customURLField.show) {
      //Get custom ID
      id = this.customURLField.value.replace(this.baseUrl, '');
    }
    else {
      //Generate random ID
      let freeIdFound = false;
      while (!freeIdFound) {
        id = Math.random().toString(36).substring(2, 8);
        const response = await this.requests.getUrl(id);
        if (!response) {
          freeIdFound = true;
        }
        
      }
    }

    if (this.serviceDown) 
      return;
    
    //Save URL
    const result = await this.requests.saveUrl(id, this.originalURLField.value);

    if (this.serviceDown)
      return;

    await new Promise(resolve => setTimeout(resolve, 1000));

    //UI
    this.loading = false;
    this.shortenedlURLField.show = true;
    this.shortenedlURLField.value = this.baseUrl + id;
  }

  async validateForm() {

    //Check if URL is empty
    if (this.originalURLField.value === '') {
      this.originalURLField.error = 'Enter an URL to shorten';
      return false;
    }

    //Check if URL is valid
    const urlRegex = /^(https?:\/\/)[^\s\/$.?#].[^\s]*$/
    if (!urlRegex.test(this.originalURLField.value)) {
      this.originalURLField.error = 'Enter a valid URL';
      return false;
    }

    //Check if user is to use an empty custom URL
    if (this.customURLField.show && this.customURLField.value === this.baseUrl) {
      this.originalURLField.error = '';
      this.customURLField.error = 'Enter your custom URL';
      return false;
    }

    //Check if custom URL is valid and available
    if (this.customURLField.show) {

      //Get custom ID
      const id = this.customURLField.value.replace(this.baseUrl, '');

      //Check if custom URL is valid
      const idRegex = /^[a-zA-Z0-9_-]{2,}$/;
      if (!idRegex.test(id)) {
        this.originalURLField.error = '';
        this.customURLField.error = 'Enter a valid custom URL';
        return false;
      }

      //Check if custom URL is already in use 
      const response = await this.requests.getUrl(id);
      if (response) {
        this.originalURLField.error = '';
        this.customURLField.error = 'URL already in use';
        this.loading = false;
        return false;
      }
    }

    return true;
  }
  copyToClipboard() {
    const inputElement = document.createElement('input');
    inputElement.value = this.shortenedlURLField.value;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    this.shortenedlURLField.msg = 'Copied to clipboard';
  }

  resetUI() {
    this.originalURLField.value = '';
    this.customURLField.value = this.baseUrl;
    this.shortenedlURLField.value = '';
    this.customURLField.show = false;
    this.shortenedlURLField.show = false;
    this.shortenedlURLField.msg = '';
    this.serviceDown = false;
    this.loading = false;
  }

}

