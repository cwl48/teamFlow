import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {AppRootRoutingModule} from "./app.router";
import {AppCoreModule} from "./module/app-core.module";

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
