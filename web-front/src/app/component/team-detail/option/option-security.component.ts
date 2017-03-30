/**
 * Created by 李 on 2017/3/25.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TeamLog, TeamService} from "../../../service/team.service";

@Component({
  moduleId: module.id,
  selector: 'team-option-security',
  templateUrl: 'option-security.component.html'
})
export class TeamOptionSecurityComponent implements OnInit,OnDestroy {

  logList: TeamLog[] = []
  team_id:string
  constructor(private teamService:TeamService) {
  }

  ngOnInit() {
    document.addEventListener("click",()=>{
      this.clearAll()
    })
    this.team_id = sessionStorage.getItem("team_id")
    this.getTeamLog(this.team_id)
  }

  getTeamLog=(team_id)=>{
    this.teamService.getTeamLogs(team_id)
      .subscribe(data=>{
        console.log(data)
        if(data.success){
          for(let i;i<this.logList.length;i++){
             Object.assign(data.datas[i],{show:false,handle_user_show:false})
          }
          this.logList = data.datas
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
    for(let i=0;i<this.logList.length;i++){
      this.logList[i].show = false
    }

  }
  ngOnDestroy(){
    document.removeEventListener("click")
  }
}
