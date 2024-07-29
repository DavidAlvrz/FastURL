import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UrlsService {

  constructor(private http: HttpClient) { }

  backendUrl = 'http://localhost:8088';

  async getUrl(id: string) {
    return await this.http.get(`${this.backendUrl}/url/get?id=${id}`).toPromise();
  }

}
