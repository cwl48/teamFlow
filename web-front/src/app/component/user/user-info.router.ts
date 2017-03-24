/**
 * Created by 李 on 2017/2/13.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserInfoComponent} from "./user-info.component";

const routes: Routes = [
  { path: '', component: UserInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfoRoutingModule { }
