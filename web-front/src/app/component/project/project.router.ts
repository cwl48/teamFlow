/**
 * Created by 李 on 2017/3/27.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectIndexComponent} from "./project-index.component";
import {ProjectTaskComponent} from "./project-task.component";
import {ProjectCountComponent} from "./project-count.component";


const routes: Routes = [
  {
    path:'',
    component:ProjectIndexComponent,
    children:[
      {
        path:'',
        redirectTo:"project-task",
        pathMatch:'full'
      },
      {
        path:'project-task',
        component:ProjectTaskComponent
      },
      {
        path:"project-count",
        component:ProjectCountComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }

