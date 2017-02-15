/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {HomeRoutingModule} from "../component/home/home-router";
import {HomeComponent} from "../component/home/home.component";
import {SignUpComponent} from "../component/home/signup.component";
import {SignInComponent} from "../component/home/signin.component";
@NgModule({
    imports: [AppShareModule,HomeRoutingModule],
    declarations: [HomeComponent,SignUpComponent,SignInComponent],
    providers: [],
})
export class HomeModule { }
