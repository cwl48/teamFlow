/**
 * Created by 李 on 2017/2/10.
 */
import { NgModule } from '@angular/core';
import {ScheduleComponent} from "../component/mytask/schedule.component";
import {AppShareModule} from "./app-share.module";
import {ScheduleRoutingModule} from "../component/mytask/schedule.router";
import {CreateScheduleComponent} from "../component/createSchedule/createSchedule.component";
import {DropdownModule} from "ng2-bootstrap";

@NgModule({
    imports: [AppShareModule,ScheduleRoutingModule,DropdownModule.forRoot()],
    declarations: [ScheduleComponent,CreateScheduleComponent],
    providers: [],
})
export class ScheduleModule { }
