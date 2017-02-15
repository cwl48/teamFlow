/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";

@NgModule({
    imports: [FormsModule,CommonModule],
    exports: [FormsModule,CommonModule,DragulaModule],
    declarations: [],
    providers: [],
})
export class AppShareModule { }
