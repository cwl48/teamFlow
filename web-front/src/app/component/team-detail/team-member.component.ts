/**
 * Created by 李 on 2017/3/25.
 */
import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../service/task.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {ValidationService} from "../../tool/validation/validation";
import {socket} from "../../tool/socket/socket";

@Component({
  selector: 'team-member',
  templateUrl: 'team-member.component.html',
  providers:[TaskService,UserService,ValidationService]
})
export class TeamMemberComponent implements OnInit {

  membersList:any[] = []

  show_modal:boolean  = false
  team_id:string
  user_id:string
  email:string

  tip:string
  show_tip:boolean
  success:boolean
  constructor(private taskService:TaskService,
              private router:Router,
              private userService:UserService,
              private validation:ValidationService
  ) {
  }

  ngOnInit() {
    document.addEventListener("click",()=>{
      this.show_modal = false
    })
    this.user_id = sessionStorage.getItem("token")
      this.team_id = sessionStorage.getItem("team_id")
      this.getStateByTeam(this.team_id)
  }
  //通过团队获取成员的完成情况
  getStateByTeam=(team_id)=>{
    this.taskService.getStateByTeam(team_id)
      .subscribe(data=>{

        this.membersList = data.datas

      })
  }
  jump=()=>{
    this.router.navigate(["/team",this.team_id,"admin","member-option"])
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
  addMember=(e)=>{
    window.event?e.cancelBubble = true:e.stopPropagation()
    this.show_modal = true
  }

  visiteMember=()=>{
    if(this.email===""){
      this.showTip("不能为空")
      return
    }
    if(!this.validation.verifiEmail(this.email)){
      this.showTip("邮箱格式不对")
      return
    }
    let obj = {
      team_id:this.team_id,
      user_id:this.user_id,
      email:this.email
    }
    this.userService.visiteMember(obj)
      .subscribe(data=>{
        console.log(data)
        if(data.success){
          let arr = []
          arr.push(data.datas.visit_user_id)
          socket.emit("client_notify_member_ids",arr)
          this.show_modal = false
        }else{
          this.showTip(data.msg)
        }
      })
  }
  stopBubble(e){
    window.event?e.cancelBubble = true:e.stopPropagation()
  }
}
