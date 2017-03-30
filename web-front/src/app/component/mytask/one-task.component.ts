/**
 * Created by 李 on 2017/3/28.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from "../../service/task.service";

@Component({
  moduleId: module.id,
  selector: 'one-task',
  templateUrl: 'one-task.component.html',
  providers:[TaskService]
})
export class OneTaskComponent implements OnInit {
  @Input() task: any
  @Input() type:string
  @Output() _notify_task = new EventEmitter<any>()
  @Output() updateListByType = new EventEmitter<string>()

  delete_flag:boolean
  constructor(private taskService:TaskService) {
  }

  ngOnInit() {

  }

  //阻止冒泡
  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation();
  }

  notifyTask = () => {
      this._notify_task.emit(this.task)
  }

  doneOneTask=(e)=>{
    this.stopBubble(e)
     let obj = {
       task_id:this.task.task_id,
       status:1
     }
     this.taskService.updateTaskStatus(obj)
       .subscribe(data=>{
         if(data.success){
           this.delete_flag = true
           setTimeout(()=>{
             this.updateListByType.emit(this.type)
           },200)
         }
       })
  }
}
