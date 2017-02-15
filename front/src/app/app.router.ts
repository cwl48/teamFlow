/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'',loadChildren:'app/module/home.module#HomeModule'},
  {path:'forgetPass',loadChildren:'app/module/forgetPass.module#ForgetPassModule'},
  {path:'dashboard',loadChildren:'app/module/dashboard.module#DashBoardModule'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRootRoutingModule { }
