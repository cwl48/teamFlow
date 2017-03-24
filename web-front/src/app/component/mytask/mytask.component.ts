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
  }
}
