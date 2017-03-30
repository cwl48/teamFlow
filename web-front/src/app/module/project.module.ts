/**
 * Created by 李 on 2017/3/27.
 */
import { NgModule } from '@angular/core';
import {ProjectIndexComponent} from "../component/project/project-index.component";
import {AppShareModule} from "./app-share.module";
import {ProjectService} from "../service/project.service";
import {ProjectCountComponent} from "../component/project/project-count.component";
import {ProjectTaskComponent} from "../component/project/project-task.component";
import {ProjectRoutingModule} from "../component/project/project.router";


@NgModule({
    imports: [AppShareModule,ProjectRoutingModule],
    declarations: [
      ProjectIndexComponent,
      ProjectCountComponent,
      ProjectTaskComponent
    ],
    providers: [ProjectService],
})
export class ProjectModule { }
