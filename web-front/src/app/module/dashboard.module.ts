/**
 * Created by 李 on 2017/2/8.
 */
import { NgModule } from '@angular/core';
import {DashBoardComponent} from "../component/dashboard/dashboard.component";
import {AppShareModule} from "./app-share.module";
import {DashBoardRoutingModule} from "../component/dashboard/dashboard.router";
import {LeftBarComponent} from "../component/index-navbar/left-bar.component";
import {TooltipModule} from "ng2-bootstrap";
import {MyTaskComponent} from "../component/mytask/mytask.component";
import {TaskComponent} from "../component/mytask/task.component";
import {SignUpComponent} from "../component/home/signup.component";
import {SignInComponent} from "../component/home/signin.component";

@NgModule({
    imports: [AppShareModule,DashBoardRoutingModule,TooltipModule.forRoot()],
    declarations: [
      DashBoardComponent,
      LeftBarComponent,
      MyTaskComponent,
      TaskComponent
    ],
    providers: [],
})
export class DashBoardModule { }
