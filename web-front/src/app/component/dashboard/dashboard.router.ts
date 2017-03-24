/**
 * Created by 李 on 2017/2/8.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashBoardComponent} from "./dashboard.component";
import {MyTaskComponent} from "../mytask/mytask.component";
import {TaskComponent} from "../mytask/task.component";
import {SignUpComponent} from "../home/signup.component";
import {SignInComponent} from "../home/signin.component";

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
            path:'schedule',loadChildren:'app/module/schedule.module#ScheduleModule'
          },
          {
            path:'message',loadChildren:'app/module/message.module#MessageModule'
          },

        ]
      },
      {path:'userInfo',loadChildren:'app/module/userinfo.module#UserInfoModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashBoardRoutingModule { }
