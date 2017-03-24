/**
 * Created by 李 on 2017/3/8.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {SignInComponent} from "../component/home/signin.component";
import {SignInRoutingModule} from "../component/home/signin.router";
import {ValidationService} from "../tool/validation/validation";




@NgModule({
    imports: [AppShareModule,SignInRoutingModule],
    declarations: [SignInComponent],
    providers: [ValidationService],
})
export class SignInModule { }
