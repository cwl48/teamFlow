/**
 * Created by 李 on 2017/2/13.
 */
import { NgModule } from '@angular/core';
import {UserInfoComponent} from "../component/user/user-info.component";
import {AppShareModule} from "./app-share.module";
import {UserInfoRoutingModule} from "../component/user/user-info.router";

@NgModule({
    imports: [AppShareModule,UserInfoRoutingModule],
    declarations: [UserInfoComponent],
    providers: [],
})
export class UserInfoModule { }
