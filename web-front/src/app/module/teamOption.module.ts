/**
 * Created by 李 on 2017/3/25.
 */
import { NgModule } from '@angular/core';
import {TeamOptionComponent} from "../component/team-detail/option/team-option.component";
import {AppShareModule} from "./app-share.module";
import {TeamOptionRoutingModule} from "../component/team-detail/option/option.router";
import {TeamMemberOptionComponent} from "../component/team-detail/option/option-member.component";
import {TeamBasicOptionComponent} from "../component/team-detail/option/option-basic.component";
import {TeamOptionSecurityComponent} from "../component/team-detail/option/option-security.component";


@NgModule({
    imports: [AppShareModule,TeamOptionRoutingModule],
    declarations: [
      TeamOptionComponent,
      TeamMemberOptionComponent,
      TeamBasicOptionComponent,
      TeamOptionSecurityComponent
    ],
    providers: [],
})
export class TeamOptionModule { }
