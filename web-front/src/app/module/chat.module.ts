/**
 * Created by 李 on 2017/3/30.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {ChatRoutingModule} from "../component/chat/chat.router";
import {ChatPanelComponent} from "../component/chat/chat.component";


@NgModule({
    imports: [AppShareModule,ChatRoutingModule],
    declarations: [ChatPanelComponent],
    providers: [],
})
export class ChatModule { }
