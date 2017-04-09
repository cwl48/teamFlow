///<reference path="../../../../node_modules/@angular/core/src/animation/metadata.d.ts"/>
/**
 * Created by 李 on 2017/2/8.
 */
import {animate, Component, OnDestroy, OnInit, state, style, transition, trigger} from '@angular/core';
import {socket} from "../../tool/socket/socket";
import {Tool} from "../../tool/tool/tool";
import {Team, TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";
import {Router} from "@angular/router";
import {Project, ProjectService} from "../../service/project.service";

@Component({
  selector: 'left-bar',
  templateUrl: './left-bar.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({left: "60px"})),
      state("out", style({left: '-350px'})),
      transition('out => in', animate("300ms ease-in")),
      transition("*=>in", animate("300ms ease-in")),
      transition('in => out', [
        animate("300ms ease-out")
      ])
    ])
  ],
  providers: [Tool, TeamService, ProjectService]
})
export class LeftBarComponent implements OnInit,OnDestroy {
  user_id: string
  imgurl: string
  has_add: boolean = false;

  show_modal: boolean
  width: string
  height: string

  searchName:string
  title: string
  type: string
  // 我的团队相关
  showMyTeam: boolean = false
  teamList: Team[] = []
  router_in: string

  // 我的项目相关
  showMyProject: boolean = false
  projectList: Project[] = []
  state: string
  hasInfo:boolean

  constructor(private tool: Tool,
              private teamService: TeamService,
              private router: Router,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    //监听document中的点击事件
    document.addEventListener('click', (evt) => {
      this.has_add = false
      this.showMyTeam = false
      this.state = 'out'
      this.has_add = false
    })
    this.imgurl = sessionStorage.getItem("headImg")
    this.listenSocket()
    this.user_id = sessionStorage.getItem("token")
    this.getTeamByUser(this.user_id)
    this.getUserAllProjectInfo(this.user_id)
    this.listenUrl()
    this.searchProject()
  }

  //监听url看根目录是否是team
  //是则把团队tag标志未选中
  listenUrl = () => {
    this.router.events
      .subscribe(data => {
        let url = data.url.split('/')[1]
        if (url === "team") {
          this.router_in = 'team'
        } else if(url==="project") {
          this.router_in = "project"
        }else if(url==="message"){
          this.router_in = "message"
        }else if(url==="task"){
          this.router_in = "task"
        }
        else{
          this.router_in = ""
        }
      })
  }

  toggleFast = (e) => {
    this.has_add = !this.has_add;
    this.tool.stopBubble(e)
  }
  toggleShowMyTeam = (e) => {
    if (!this.showMyTeam) {
      this.getTeamByUser(this.user_id)
    }
    this.showMyTeam = !this.showMyTeam;
    this.tool.stopBubble(e)
    this.state = 'out'
    this.has_add = false
  }
  stopBubble = (e) => {
    this.tool.stopBubble(e)
  }
  createTeam = (e) => {
    this.tool.stopBubble(e)
    this.show_modal = true
    this.width = "678"
    this.height = "491"
    this.title = '新建团队'
    this.type = 'team'
    //重置
    this.has_add = false
    this.showMyTeam = false
  }

  createProject = () => {
    this.show_modal = true
    this.width = "678"
    this.height = "400"
    this.title = '新建项目'
    this.type = 'project'
  }
  closeShowModal = (e) => {
    this.show_modal = false
  }

  toggleShowMyProject = (e) => {
    this.tool.stopBubble(e)
    this.showMyTeam = false
    this.has_add = false
    if (this.state === 'in') {
      this.state = 'out'
    } else {
      this.getUserAllProjectInfo(this.user_id)
      this.state = 'in'
    }
  }

  //监听服务器socket通知
  listenSocket = () => {
    //监听改变该组件上的头像
    socket.on("notify_msg", (msg) => {
      if (msg === "change user_img") {
        this.imgurl = sessionStorage.getItem("headImg")
      }
    })

    //监听改变该组件上的通知
    socket.on("notify_msg", (msg) => {
      if (msg === "has notify") {
        this.hasInfo = true
      }
    })
    socket.on("server_notify_message",msg=>{
      this.hasInfo = true
    })
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
  //选择进入一个团队
  selOneTeam = (item, e) => {
    this.stopBubble(e)
    this.showMyTeam = false
    this.router_in = "team"
    sessionStorage.setItem("team_id", item.team_id)
    this.router.navigate(["/team", item.team_id])
  }

  //进入一个项目
  selOneProject = (item,e)=>{
    this.stopBubble(e)
    this.state ="out"
    this.router_in = "project"
    sessionStorage.setItem("project_id",item.project_id)
    this.router.navigate(["/project",item.project_id])
  }

  //获取一个用户的所有项目信息
  getUserAllProjectInfo = (user_id) => {
    let id = user_id||this.user_id
    this.projectService.getUserAllProjectInfo(id)
      .subscribe(data => {
        console.log(data)
        if (data.success) {
          this.projectList = data.datas
        }
      })
  }
  getUserAllProjectInfo1 = ()=>{
    let id = this.user_id
    this.projectService.getUserAllProjectInfo(id)
      .subscribe(data => {
        console.log(data)
        if (data.success) {
          this.projectList = data.datas
        }
      })
  }
  //搜索项目
  searchProject = () => {

    let search = document.getElementById("search")
    let flag = false
    search.addEventListener("compositionstart",()=>{
      flag = true
    })
    search.addEventListener("compositionend",()=>{
      flag = false
    })
    search.addEventListener("keyup",()=>{
        if(!flag){
          let arr = []
          if(this.searchName===""){
            this.getUserAllProjectInfo(this.user_id)
          }else{
            this.projectList.forEach(pro => {
              if (pro.projectName.indexOf(this.searchName)>-1) {
                arr.push(pro)
              }
            })
            this.projectList = arr
          }

        }
    })
  }
  ngOnDestroy=()=>{
    let search = document.getElementById("search")
    search.removeEventListener("compositionstart")
    search.removeEventListener("compositionend")
    search.removeEventListener("input")
    document.removeEventListener("click")
  }
}
