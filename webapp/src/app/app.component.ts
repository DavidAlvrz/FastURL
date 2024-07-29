import { Component } from '@angular/core';
import { UrlsService } from './urls.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private urlsService: UrlsService) { }

  facog = faCog;
  samplePlaceholder = 'https://www.fasturl.com/dontVisitMe';

  baseUrl = 'www.fasturl.com/go/';

  loading = false;

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

  toggleCustomField() {
    if(this.loading || this.shortenedlURLField.show) return;
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
    if(this.loading) return;

    // UI
    this.loading = true;

    //Validate form
    const formOk = this.validateForm();
    if (!formOk){
      this.loading = false;
      return;
    }else{
      this.originalURLField.error = '';
      this.customURLField.error = '';
    }

    // Get ID
    let id = '';
    if (this.customURLField.show) {
      //Get custom ID
      id = this.customURLField.value.replace(this.baseUrl, '');

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
    const result = await this.urlsService.saveUrl(id, this.originalURLField.value);
    console.log(result);

    await new Promise(resolve => setTimeout(resolve, 1000));

    //UI
    this.loading = false;
    this.shortenedlURLField.show = true;
    this.shortenedlURLField.value = this.baseUrl + id;
  }

  validateForm() {

    if (this.originalURLField.value === '') {
      this.originalURLField.error = 'Enter an URL to shorten';
      return false;
    }

    if (this.customURLField.show && this.customURLField.value === this.baseUrl) {
      this.originalURLField.error = '';
      this.customURLField.error = 'Enter your custom URL';
      return false;
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
  }

}

