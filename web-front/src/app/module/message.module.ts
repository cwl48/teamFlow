/**
 * Created by 李 on 2017/2/13.
 */
import { NgModule } from '@angular/core';
import {AppShareModule} from "./app-share.module";
import {MessageComponent} from "../component/message/message.component";
import {MessageRoutingModule} from "../component/message/message.router";

@NgModule({
    imports: [AppShareModule,MessageRoutingModule],
    declarations: [MessageComponent],
    providers: [],
})
export class MessageModule { }
