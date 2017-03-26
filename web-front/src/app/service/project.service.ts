/**
 * Created by 李 on 2017/3/24.
 */
import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {config} from "../app.config";

const host = config.host
@Injectable()
export class ProjectService {

  projectUrl: string = `${host}/api/project`

  constructor(private http: Http) {
  }

  //创建项目
  createProject = (project: Project) => {
    return this.http.post(this.projectUrl, project)
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
}
