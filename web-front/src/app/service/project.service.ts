/**
 * Created by 李 on 2017/3/24.
 */
import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {config} from "../app.config";
import {Team} from "./team.service";

const host = config.host
@Injectable()
export class ProjectService {

  projectUrl: string = `${host}/api/project`
  userProjectInfoUrl:string = `${host}/api/user/allProject`

  constructor(private http: Http) {
  }

  //创建项目
  createProject = (project: Project) => {
    return this.http.post(this.projectUrl, project)
      .map(this.send)
  }

  //获取一个用户的所有项目信息
  getUserAllProjectInfo=(user_id:string)=>{
     return this.http.get(`${this.userProjectInfoUrl}?user_id=${user_id}`)
       .map(this.send)
  }
  //获取一个项目信息
  getProjectInfo=(project_id)=>{
     return this.http.get(`${this.projectUrl}?project_id=${project_id}`)
       .map(this.send)
  }

  send = (res: Response) => {
    return res.json()
  }
}
export class Project {
  project_id?: string
  projectName?: string
  projectInfo?: string
  user_id?: string
  team_id?:string
  team?:Team
}
