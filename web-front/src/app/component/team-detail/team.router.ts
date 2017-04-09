/**
 * Created by 李 on 2017/3/25.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TeamIndexComponent} from "./team-index.component";
import {TeamProjectComponent} from "./team-project.component";
import {TeamMemberComponent} from "./team-member.component";
import {TeamOptionComponent} from "./option/team-option.component";

const routes: Routes = [

  {
    path:'',
    component:TeamIndexComponent,
    children:[
      {
        path: '',
        redirectTo:"project",
        pathMatch:"full"
      },
      {
        path:'project',
        component:TeamProjectComponent
      },
      {
        path:'member',
        component:TeamMemberComponent
      },
      {
        path:'admin',
        loadChildren:'app/module/teamOption.module#TeamOptionModule'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
