/**
 * Created by 李 on 2017/3/25.
 */
import {Component, OnInit} from '@angular/core';
import {TeamService} from "../../../service/team.service";

@Component({
  moduleId: module.id,
  selector: 'team-member-option',
  templateUrl: 'option-member.component.html'
})
export class TeamMemberOptionComponent implements OnInit {

  team_id:string
  direct:string = 'right-center'
  userList:any[] = []

  //显示提示
  tip:string
  show_tip:boolean
  success:boolean
  constructor(private teamService:TeamService) {
  }

  ngOnInit() {
    document.addEventListener("click",()=>{
      this.clearAll()
    })
    this.team_id = sessionStorage.getItem("team_id")
    this.getTeamMemberInfo(this.team_id)
  }

  //获取团队成员信息
  getTeamMemberInfo=(team_id)=>{
    this.teamService.getTeamInfo(team_id)
      .subscribe(data=>{
          if(data.success){
            //拼接数据
            let arr = []
            let users = data.datas.users
            users.forEach(user=>{
              let auth = '成员'
              if(user.team_user.auth===1){
                auth = "管理员"
              }else if(user.team_user.auth===100){
                auth = "创建者"
              }
              let obj = {
                user_id:user.user_id,
                username:user.username,
                phone:user.phone,
                email:user.email.email,
                auth:auth,
                authNum:user.team_user.auth,
                createdAt:user.team_user.createdAt.substr(0,10),
                show:false,
                show_auth:false
              }
              arr.push(obj)
            })
            //对arr排序 根据auth字段 简单的冒泡
            for(let i=0;i<arr.length;i++){
              for(let j=0;j<arr.length-i-1;j++){
                let temp:any
                if(arr[j+1].authNum>arr[j].authNum){
                  temp = arr[j+1]
                  arr[j+1] = arr[j]
                  arr[j] = temp
                }
              }
            }
            this.userList =arr
          }
      })
  }
  showUserInfoMoal=(item,e)=>{
    window.event?e.cancelBubble = true:e.stopBubble = true
    this.clearAll()
    item.show = !item.show
  }
  //去除所有的userModal
  clearAll=()=>{
    for(let i=0;i<this.userList.length;i++){
      this.userList[i].show = false
      this.userList[i].show_auth = false
    }

  }
  cancelAuth=(item)=>{
    item.show_auth = false
  }
  showAuthManage=(item,e)=>{
    window.event?e.cancelBubble = true:e.stopBubble = true
    item.show_auth = !item.show_auth
  }

  //修改权限
  modifyAuth=(item,auth)=>{
    let obj = {
      handle_user_id:sessionStorage.getItem("token"),
      user_id:item.user_id,
      auth:auth,
      team_id:this.team_id
    }
    this.teamService.modifyUserAuth(obj)
      .subscribe(data=>{
        if(data.success){
          if(auth===1){
            item.auth = "管理员"
          }else if(auth===0){
            item.auth = "成员"
          }
          item.show_auth = false
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
}
