/**
 * Created by 李 on 2017/2/8.
 */
import {Component, OnInit} from '@angular/core';
import {socket} from "../../tool/socket/socket";
import {Tool} from "../../tool/tool/tool";
import {Team, TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'left-bar',
  templateUrl: './left-bar.component.html',
  providers: [Tool, TeamService]
})
export class LeftBarComponent implements OnInit {
  user_id: string
  imgurl: string
  has_add: boolean = false;

  show_modal: boolean
  width: string
  height: string

  title: string
  type: string

  showMyTeam: boolean = false

  teamList: Team[] = []
  router_in_team: boolean

  constructor(private tool: Tool,
              private teamService: TeamService,
              private router: Router) {
  }

  ngOnInit() {
    //监听document中的点击事件
    document.addEventListener('click', (evt) => {
      this.has_add = false
      this.showMyTeam = false
    })
    this.imgurl = sessionStorage.getItem("headImg")
    this.listenSocket()
    this.user_id = sessionStorage.getItem("token")
    this.getTeamByUser(this.user_id)
    this.listenUrl()
  }

  //监听url看根目录是否是team
  //是则把团队tag标志未选中
  listenUrl = () => {
    this.router.events
      .subscribe(data => {
          let url = data.url.split('/')[1]
        if(url==="team"){
            this.router_in_team = true
        }else{
          this.router_in_team = false
        }
      })
  }

  toggleFast = (e) => {
    this.has_add = !this.has_add;
    this.tool.stopBubble(e)
  }
  toggleShowMyTeam = (e) => {
    if(!this.show_modal){
      this.getTeamByUser(this.user_id)
    }
    this.showMyTeam = !this.showMyTeam;
    this.tool.stopBubble(e)
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
  closeShowModal = () => {
    this.show_modal = false
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
        console.log("接收到了")
      }
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

  selOneTeam = (item, e) => {
    this.stopBubble(e)
    this.showMyTeam = false
    this.router_in_team = true
    sessionStorage.setItem("team_id",item.team_id)
    this.router.navigate(["/team", item.team_id])
  }
}
