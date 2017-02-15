/**
 * Created by 李 on 2017/2/8.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashBoardComponent implements OnInit {

    constructor() { }
    ngOnInit() {
      this.onResize();
      this.setMainWidth();
    }

    //动态设置右侧Main的宽度
    setMainWidth=()=>{
      let main = document.getElementById('main');
      let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;    //获取宽度
      main.style.width = clientWidth-60+'px';
    }

    //监听屏幕大小变化
      onResize=()=>{
        window.onresize = ()=>{
          this.setMainWidth();      //动态设置宽度
        }
      }

}
