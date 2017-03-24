/**
 * Created by 李 on 2017/2/7.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {ForgetPassComponent} from "../component/lessuse/forgetpass.component";
import {ForgetPassRoutingModule} from "../component/lessuse/forgetpass.router";

@NgModule({
    imports: [AppShareModule,ForgetPassRoutingModule],
    declarations: [ForgetPassComponent],
    providers: [],
})
export class ForgetPassModule { }
