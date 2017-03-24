/**
 * Created by 李 on 2017/3/8.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpComponent } from './signup.component';

const routes: Routes = [
  { path: '', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpRoutingModule { }
