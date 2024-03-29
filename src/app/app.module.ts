import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetaModule } from '@ngx-meta/core';
import { ModalModule} from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { HttpClientModule} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RepSignupComponent } from './components/rep-signup/rep-signup.component';
import {ApiService} from './api-service';
// import { FileUploadModule } from 'file-upload';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactusComponent,
    AboutusComponent,
    RepSignupComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,MetaModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    MomentModule
    // FileUploadModule
    // CookieService
  ],
  providers: [CookieService,ApiService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
