/**
 * Created by 李 on 2017/2/8.
 */
import { Component, OnInit } from '@angular/core';
import { DragulaService } from "ng2-dragula/ng2-dragula";

@Component({
  selector: " my-task ",
  templateUrl: './mytask.component.html',
  providers: [DragulaService]
})
export class MyTaskComponent implements OnInit {
  ngOnInit() {
    this.setMainHeight()
  }

  //动态设置右侧Main的高度
  setMainHeight = () => {
    let main = document.getElementById('task-wrap');
    let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;    //获取宽度
    main.style.height = clientHeight - 70 + 'px';
  }
}
