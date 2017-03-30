/**
 * Created by 李 on 2017/2/8.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashBoardComponent} from "./dashboard.component";
import {MyTaskComponent} from "../mytask/mytask.component";
import {TaskComponent} from "../mytask/task.component";

const routes: Routes = [
  {path:'',component:DashBoardComponent,
    children:[
      { path:'',
        component:MyTaskComponent,
        children:[
          {
            path:'',
            redirectTo:'task',
            pathMatch:'full'
          },
          {path:'task',component:TaskComponent},
          {
            path:'message',loadChildren:'app/module/message.module#MessageModule'
          },

        ]
      },
      {path:'userInfo',loadChildren:'app/module/userinfo.module#UserInfoModule'},
      {path:'team/:id',loadChildren:'app/module/team.module#TeamModule'},
      {path:"project/:id",loadChildren:"app/module/project.module#ProjectModule"}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashBoardRoutingModule { }
