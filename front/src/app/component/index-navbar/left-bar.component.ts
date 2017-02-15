/**
 * Created by 李 on 2017/2/8.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'left-bar',
    templateUrl: 'left-bar.component.html',
})
export class LeftBarComponent implements OnInit {

    has_add:boolean = false;
    constructor() { }

    ngOnInit() {
      //监听document中的点击事件
      document.addEventListener('click',(evt)=>{
        this.has_add = false;
      })
    }
    toggle=(e)=>{
      this.has_add  = !this.has_add;
      //阻止点击冒泡
      window.event? window.event.cancelBubble = true : e.stopPropagation();
    }
}
