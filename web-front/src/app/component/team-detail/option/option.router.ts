/**
 * Created by 李 on 2017/3/25.
 */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TeamOptionComponent} from "./team-option.component";
import {TeamBasicOptionComponent} from "./option-basic.component";
import {TeamMemberOptionComponent} from "./option-member.component";
import {TeamOptionSecurityComponent} from "./option-security.component";


const routes: Routes = [
  {
    path: '',
    component: TeamOptionComponent,
    children: [
      {
        path:"",
        redirectTo:"basic",
        pathMatch:"full"
      },
      {
        path:'basic',
        component:TeamBasicOptionComponent
      },
      {
        path:'member-option',
        component:TeamMemberOptionComponent
      },
      {
        path:'security',
        component:TeamOptionSecurityComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamOptionRoutingModule {
}

