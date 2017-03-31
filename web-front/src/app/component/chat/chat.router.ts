/**
 * Created by 李 on 2017/3/30.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatPanelComponent} from "./chat.component";


const routes: Routes = [
  { path: '', component: ChatPanelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule { }

