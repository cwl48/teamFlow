/**
 * Created by 李 on 2017/2/3.
 */
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";
import {FlowerBgComponent} from "../component/home/flower.component";
import {TopTipComponent} from "../component/share/top-tip/top-tip.component";
import {MyModalComponent} from "../component/share/my-modal/my-modal.component";
import {MySelectComponent} from "../component/share/my-select/my-select.component";
import {ValidationService} from "../tool/validation/validation";
import {UserInfoImgComponent} from "../component/share/userInfo-img/userInfo-img.component";

@NgModule({
    imports: [FormsModule,CommonModule],
    exports: [
      FormsModule,
      CommonModule,
      DragulaModule,
      FlowerBgComponent,
      TopTipComponent,
      MyModalComponent,
      MySelectComponent,
      UserInfoImgComponent
    ],
    declarations: [
      FlowerBgComponent,
      TopTipComponent,
      MyModalComponent,
      MySelectComponent,
      UserInfoImgComponent
    ],
    providers: [ValidationService],
})
export class AppShareModule { }
