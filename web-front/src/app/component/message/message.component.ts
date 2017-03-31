/**
 * Created by 李 on 2017/2/13.
 */
import {Component, OnInit} from '@angular/core';
import {TaskMessage, TaskService} from "../../service/task.service";
import {count} from "rxjs/operator/count";

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  providers: [TaskService]
})
export class MessageComponent implements OnInit {

  msgList: TaskMessage[] = []
  user_id: string
  offset: number = 1
  count:number
  loading: boolean = true
  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.user_id = sessionStorage.getItem("token")
    this.getMsgOfTaskByUser(this.user_id, 1)
  }

  //滚动加载
  scrollLoading = (e) => {
    let target = e.target
    if (target.scrollHeight > 1200 && target.scrollTop + target.clientHeight + 1 >= target.scrollHeight&&this.msgList.length<this.count) {
      this.offset++
      this.getMsgOfTaskByUser(this.user_id, this.offset)
    }
  }

  getMsgOfTaskByUser = (user_id, offset) => {
    this.loading = true
    this.taskService.getMsgOfTaskByUser(user_id, offset)
      .subscribe(data => {
        if (data.success) {
          this.loading = false
          this.count = data.count
          this.msgList = this.msgList.concat(data.datas)
        }
      })
  }

  refresh = () => {
    this.getMsgOfTaskByUser(this.user_id, 1)
    this.offset = 1
  }
}
