/**
 * Created by 李 on 2017/3/8.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from "./signin.component";

const routes: Routes = [
  { path: '', component:SignInComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInRoutingModule{ }
