/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from "./component/home/signin.component";
import {SignUpComponent} from "./component/home/signup.component";
import {AuthService} from "./service/AuthService";

const routes: Routes = [
  {path:'forgetPass',loadChildren:'app/module/forgetPass.module#ForgetPassModule'},


];
const router:Routes = [
  {path:'login',loadChildren:'app/module/signin.module#SignInModule'},
  {path:'register',loadChildren:'app/module/signup.module#SignUpModule'},
  {
    path:'',
    canActivate:[AuthService],
    loadChildren:'app/module/dashboard.module#DashBoardModule'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes),RouterModule.forChild(router)],
  exports: [RouterModule],
})
export class AppRootRoutingModule { }
