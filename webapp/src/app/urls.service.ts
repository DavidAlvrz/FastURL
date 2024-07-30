import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';


@Injectable({
  providedIn: 'root',
})
export class UrlsService {

  constructor(private http: HttpClient) { }

  backendUrl = environment.backendUrl;

  async getUrl(id: string) {
    try {
      return await this.http.get(`${this.backendUrl}/url/get?id=${id}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async saveUrl(id: string, url: string): Promise<any> {
    try {
      const body = { "id": id, "url": url };
      return await this.http.post(`${this.backendUrl}/url/add`, body).toPromise();
    } catch (error) {
      throw error;
    }
  }

}
