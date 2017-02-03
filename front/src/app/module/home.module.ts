/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {HomeRoutingModule} from "../component/home-router";
import {HomeComponent} from "../component/home.component";
@NgModule({
    imports: [AppShareModule,HomeRoutingModule],
    declarations: [HomeComponent],
    providers: [],
})
export class HomeModule { }
