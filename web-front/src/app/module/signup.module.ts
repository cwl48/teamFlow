/**
 * Created by 李 on 2017/3/8.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {SignUpRoutingModule} from "../component/home/signup.router";
import {SignUpComponent} from "../component/home/signup.component";


@NgModule({
    imports: [AppShareModule,SignUpRoutingModule],
    declarations: [SignUpComponent],
    providers: [],
})
export class SignUpModule { }
