/**
 * Created by 李 on 2017/2/7.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForgetPassComponent} from "./forgetpass.component";

const routes: Routes = [
  { path: '', component: ForgetPassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetPassRoutingModule { }
