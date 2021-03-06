/**
 * Created by 李 on 2017/3/22.
 */
import {Injectable} from '@angular/core';
import {config} from "../app.config";
import {User} from "./user.service";
import {Http, Response} from "@angular/http";

const host = config.host
@Injectable()
export class TeamService {

  teamUrl:string  =`${host}/api/team`
  getTeamMemberUrl: string = `${host}/api/team/member`
  modifyUserAuthUrl:string = `${host}/api/ateam/userAuth`

  constructor(private http: Http) {
  }

  /*
   *  获取团队成员  有两种情况
   *  1.获取自己所在的团队(可能有多个团队)的人员（user_id）
   */
  getTeamMember = (user_id: User) => {
    let url = `${this.getTeamMemberUrl}?user_id=${user_id}`
    return this.http.get(url)
      .map(this.send)
  }
  /*
   *  获取用户所在团队
   */
  getTeamByUser =(user_id:User)=>{
    let url = `${this.teamUrl}/byuser?user_id=${user_id}`
    return this.http.get(url)
      .map(this.send)
  }

  send = (res: Response) => {
    return res.json()
  }

  //创建团队
  createTeam=(obj:any)=>{
    return this.http.post(this.teamUrl,obj)
      .map(this.send)
  }

  //获取一个团队的信息 包括所有成员
  getTeamInfo=(team_id:string)=>{
     return this.http.get(`${this.teamUrl}?team_id=${team_id}`)
       .map(this.send)
  }
  //修改团队信息
  modifyInfo=(team:Team)=>{
    let url = `${this.teamUrl}/${team.team_id}`
    return this.http.put(url,team)
      .map(this.send)
  }

  //解散团队
  destroy=(team:Team)=>{
    let url = `${this.teamUrl}?teamId=${team.team_id}&userId=${team.user_id}`
    return this.http.delete(url,team)
      .map(this.send)
  }
  //修改团队中权限
  modifyUserAuth=(auth)=>{
    return this.http.put(this.modifyUserAuthUrl,auth)
      .map(this.send)
  }

  //获取team_log
  getTeamLogs=(team_id:string)=>{
    let url = `${this.teamUrl}/log?team_id=${team_id}`
     return this.http.get(url)
       .map(this.send)
  }

}

export class Team {
  team_id?: string
  teamName?: string
  belongs_phone?: string
  user_id?: string
  bussiness?: string
  status?: string
  memberNum?:number
  imgurl?:string
}

export class TeamLog {
  handle_user_id?: string
  user_id?: string
  ip?: string
  type?: string
  message?: string
  team_id?: string
  project_id?: string
  show?:boolean
}

