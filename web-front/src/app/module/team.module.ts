/**
 * Created by 李 on 2017/3/25.
 */
import { NgModule } from '@angular/core';
import {TeamIndexComponent} from "../component/team-detail/team-index.component";
import {AppShareModule} from "./app-share.module";
import {TeamRoutingModule} from "../component/team-detail/team.router";
import {TeamService} from "../service/team.service";
import {TeamMemberComponent} from "../component/team-detail/team-member.component";
import {TeamOptionComponent} from "../component/team-detail/option/team-option.component";
import {TeamProjectComponent} from "../component/team-detail/team-project.component";

@NgModule({
    imports: [AppShareModule,TeamRoutingModule],
    declarations: [
      TeamIndexComponent,
      TeamMemberComponent,
      TeamProjectComponent
    ],
    providers: [TeamService],
})
export class TeamModule { }
