import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {AppRootRoutingModule} from "./app.router";
import {AppCoreModule} from "./module/app-core.module";
import {SignInComponent} from "./component/home/signin.component";
import {SignUpComponent} from "./component/home/signup.component";
import {UserService} from "./service/user.service";
import {AuthService} from "./service/AuthService";
import {TeamService} from "./service/team.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRootRoutingModule,
    AppCoreModule,
  ],
  providers: [UserService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
