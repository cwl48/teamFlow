/**
 * Created by 李 on 2017/3/25.
 */
import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../service/task.service";
import {Project} from "../../service/project.service";
import {Router} from "@angular/router";
import {TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";

@Component({
  selector: 'team-project',
  templateUrl: 'team-project.component.html',
  providers: [TaskService]
})
export class TeamProjectComponent implements OnInit {
  team_id: string

  noDoneNums: number
  doneNums: number

  projectList: any[] = []

  show_modal: boolean
  width: string
  height: string
  title:string
  type:string
  teamList:any[]
  user_id:string

  constructor(private taskService: TaskService,
              private router:Router,
              private teamService:TeamService
  ) {
  }

  ngOnInit() {
    this.user_id =sessionStorage.getItem('token')
    this.team_id = sessionStorage.getItem("team_id")
    this.getTeamProjectTaskState()
    this.getTeamByUser(this.user_id)
  }

  //获取所有团队项目的任务完成情况
  getTeamProjectTaskState = () => {
    this.taskService.getTeamProjectTaskState(this.team_id)
      .subscribe(data => {
        this.projectList = data.datas
      })
  }

  jump=(item)=>{
    this.router.navigate(["/project",item.project_id])
  }
  closeShowModal = () => {
    this.show_modal = false
  }
  createProject = (e) => {
    window.event?e.cancelBubble=true:e.stopPropagation()
    this.show_modal = true
    this.width = "678"
    this.height = "400"
    this.title = '新建项目'
    this.type = 'project'
  }
  //获取当前用户所在的所有团队
  getTeamByUser = (user_id: User) => {
    this.teamService.getTeamByUser(user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              team_id: d.team_id,
              name: d.teamName,
              imgurl: d.imgurl,
              memberNum: d.memberNum
            }
            arr.push(obj)

          })
          this.teamList = arr
        }
      })
  }

}
