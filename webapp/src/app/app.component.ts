import { Component } from '@angular/core';
import { UrlsService } from './urls.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  facog = faCog;

  constructor(private urlsService: UrlsService) { }

  baseUrl = 'www.fasturl.com/go/';

  loading = false;
  finished = false;

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

  shortenlURLField = {
    show: false,
    value: '',
    error: ''
  }

  toggleCustomField() {
    if(this.loading) return;
    this.customURLField.show = !this.customURLField.show;
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

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    return

    //Validate form
    const formOk = this.validateForm();
    if (!formOk) return;

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
    await this.urlsService.saveUrl(id, this.originalURLField.value);

  }

  validateForm() {
    if (this.originalURLField.value === '') {
      alert('Please enter a URL to shorten');
      return false;
    }

    if (this.customURLField.show && this.customURLField.value === this.baseUrl) {
      alert('Please enter a custom URL');
      return false;
    }

    return true;
  }

}

