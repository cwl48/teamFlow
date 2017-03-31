/**
 * Created by 李 on 2017/3/30.
 */
import {Component, OnInit} from '@angular/core';
import {Team, TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";
import {socket} from "../../tool/socket/socket";
import {ChatsService} from "../../service/chat.service";

@Component({
  moduleId: module.id,
  selector: 'chat-panel',
  templateUrl: 'chat.component.html',
  providers: [TeamService,ChatsService]
})
export class ChatPanelComponent implements OnInit {

  user_id: string
  dataList:any[] = []

  groupChat:boolean = true

  team_id:string
  target_user_id:string

  show_emoji:boolean
  emojiList1:any[] =[]
  emojiList2:any[] =[]
  emojiList3:any[] =[]
  emojiList4:any[] =[]
  emoji_page:string
  constructor(private teamService: TeamService,
              private chatService:ChatsService
  ) {

  }

  ngOnInit() {
    document.addEventListener("click",()=>{
      this.show_emoji = false
    })
    this.user_id = sessionStorage.getItem("token")
    this.emoji_page  ='1'
    this.getAllTeam()
    this.getAllEmoji()
  }

  //获取所有的团队
  getAllTeam = () => {
    this.teamService.getTeamByUser(this.user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              imgurl: d.imgurl,
              name: d.teamName,
              id:d.team_id
            }
            arr.push(obj)
          })
          this.dataList = arr
        }
      })
  }

  getTeamsAllUser = () => {
    this.teamService.getTeamMember(this.user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              imgurl: d.imgurl,
              name: d.username,
              id: d.user_id
            }
            arr.push(obj)
          })
          this.dataList = arr
        }
      })
  }

  selOne=(item)=>{
    if(this.groupChat){
       this.team_id = item.id
    }else{
      this.target_user_id = item.id
    }
  }

  getAllEmoji=()=>{
    this.chatService.getAllEmoji()
      .subscribe(data=>{
        this.emojiList1= data.datas.slice(0,32)
        this.emojiList2= data.datas.slice(32,64)
        this.emojiList3= data.datas.slice(64,95)
      })
  }
  switchPage=(num)=>{
   this.emoji_page = num
  }
  showEmoji=(e)=>{
    this.stopBubble(e)
    this.show_emoji = true
  }

  stopBubble(e){
    window.event?e.cancelBubble = true:e.stopPropagation()
  }
}
