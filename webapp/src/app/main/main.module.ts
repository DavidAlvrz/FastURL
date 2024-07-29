import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../urls.service';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from '../footer/footer.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FooterComponent  
    ],
  providers: [UrlsService, HttpClient],
  exports: [AppComponent, NavbarComponent],
  bootstrap: [AppComponent]
})
export class MainModule { }
