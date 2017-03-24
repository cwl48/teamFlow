import {Component, OnInit} from '@angular/core';
import {DragulaService} from "ng2-dragula";

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  providers: [DragulaService]
})
export class TaskComponent implements OnInit {

  // 任务面板
  taskpanels: Array<any> = [
    {num: 1, tasks: [{content: '测试是死死死死死死死死', projectName: 'teamFlow'}]},
    {num: 1, tasks: [{content: '测试是死死死死死死死死', projectName: 'teamFlow'}]}
  ];

  constructor(private dragService: DragulaService) {
    dragService.dropModel.subscribe((value) => {
      this.onDropModel(value.slice(1));
    });
    dragService.removeModel.subscribe((value) => {
      this.onRemoveModel(value.slice(1));
    });
  }

  // 拖动之后判断是否为空
  onDropModel = (arg) => {
    const [e, el] = arg;
  }
  onRemoveModel = (arg) => {
  }
  ngOnInit() {
  }
}
