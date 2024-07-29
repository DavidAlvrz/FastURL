import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../urls.service';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    BrowserModule,
    HttpClientModule
    ],
  providers: [UrlsService, HttpClient],
  exports: [AppComponent, NavbarComponent],
  bootstrap: [AppComponent]
})
export class MainModule { }
