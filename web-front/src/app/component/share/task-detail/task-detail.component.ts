/**
 * Created by 李 on 2017/3/29.
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Task, TaskService} from "../../../service/task.service";
import {ProjectService} from "../../../service/project.service";
import {User} from "../../../service/user.service";
import {TeamService} from "../../../service/team.service";
import {socket} from "../../../tool/socket/socket";

@Component({
  moduleId: module.id,
  selector: 'task-detail',
  templateUrl: 'task-detail.component.html',
  providers: [TaskService, ProjectService, TeamService]
})
export class TaskDetailComponent implements OnInit {
  @Input() show: boolean
  @Input() task: any
  @Output() close = new EventEmitter<Boolean>()
  @Output() updateByType = new EventEmitter<string>()
  text_show: boolean = false
  user_show: boolean
  userList: User[] = []

  user_info_show_direct: string = "right-center"
  user_info_show: boolean

  tip:string
  show_tip:boolean
  success:boolean

  user_id:string
  constructor(private taskService: TaskService,
              private projectService: ProjectService,
              private teamService: TeamService) {
  }

  ngOnInit() {
    this.user_id = sessionStorage.getItem("token")
    document.addEventListener("click", () => {
      this.user_info_show = false
      this.user_show = false
    })
  }
  //关闭此Modal
  closeModal() {
    this.close.emit(false)
    this.text_show = false
    this.user_show = false
  }

  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation()
  }
  //增加描述
  addDesc() {
    this.text_show = !this.text_show
  }
  //保存
  saveTask = () => {
    if(this.task.task_content===""){
      this.showTip("任务名不能为空")
      return
    }
    let obj = {
      task_content: this.task.task_content,
      task_id: this.task.task_id,
      desc: this.task.desc
    }
    this.taskService.updateUserInfo(obj)
      .subscribe(data => {
        if (data.success) {
          this.text_show = false
        }
      })
  }
  //分配任务
  giveTaskToUser = (e) => {
    this.stopBubble(e)
    this.user_show = true
    this.getTeamUserList()
  }
  // 获取团队任务
  getTeamUserList = () => {
    this.teamService.getTeamInfo(this.task.t_project.team_id)
      .subscribe(data => {
        if (data.success) {
          this.userList = data.datas.users
        }
      })
  }
  //分配人员
  selOneUser = (item) => {
    let old_user_id = this.task.t_user_task.user_id
    let obj = {
      handle_user_id: item.user_id,
      task_id: this.task.task_id,
      user_id:this.user_id,
      team_id:this.task.t_project.team_id
    }

    this.taskService.updateUserInfo(obj)
      .subscribe(data => {
        if (data.success) {
          this.user_info_show = false
          //通知父组件更新列表 根据type重新获取task
          this.updateByType.emit(this.task.type)
          //如果任务分配做用户更换了
          // 通知那个用户更新列表
          if(old_user_id!==obj.handle_user_id){
            let task ={
              user_id:obj.handle_user_id,
              type:this.task.type
            }
            socket.emit("update_task_user",task)
          }
        }
        else{
          this.showTip(data.msg)
        }
      })
  }
  //显示提示
  showTip = (tip: string, nodify?: boolean) => {
    this.tip = tip
    this.show_tip = true
    if (nodify) {
      this.success = true
    }
    setTimeout(() => {
      this.show_tip = false
      this.success = false
    }, 1200)
  }
  showUserInfoModal = (e) => {
    this.stopBubble(e)
    this.user_info_show = !this.user_info_show
  }
}
