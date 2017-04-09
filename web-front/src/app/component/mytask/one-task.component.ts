/**
 * Created by 李 on 2017/3/28.
 */
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from "../../service/task.service";

@Component({
  moduleId: module.id,
  selector: 'one-task',
  templateUrl: 'one-task.component.html',
  providers: [TaskService]
})
export class OneTaskComponent implements OnInit, AfterViewInit {
  @Input() task: any
  @Input() type: string
  @Output() _notify_task = new EventEmitter<any>()
  @Output() updateListByType = new EventEmitter<string>()

  delete_flag: boolean

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.checkTask()
  }

  ngAfterViewInit() {
    if (this.task.status === 1) {
      let dom = <any>document.getElementById("y$" + this.task.task_id)
      dom.checked = true
    }
  }

  //阻止冒泡
  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation();
  }

  notifyTask = () => {
    this._notify_task.emit(this.task)
  }

  //判断该任务是否完成
  checkTask = () => {
    if (this.task.status === 1) {
      this.delete_flag = true

    }
  }
  doneOneTask = (e) => {
    this.stopBubble(e)

    let obj = {
      task_id: this.task.task_id,
      status: 1,
      user_id: this.task.t_user_task.user_id
    }
    this.taskService.updateTaskStatus(obj)
      .subscribe(data => {
        if (data.success) {
          this.delete_flag = true
          setTimeout(() => {
            this.updateListByType.emit(this.type)
          }, 200)
        }
      })

  }
}
