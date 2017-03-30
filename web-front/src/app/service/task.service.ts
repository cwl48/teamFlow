/**
 * Created by 李 on 2017/3/28.
 */
import {Injectable} from '@angular/core';
import {config} from "../app.config";
import {Http, Response} from "@angular/http";
import {Project} from "./project.service";

const Host = config.host
@Injectable()
export class TaskService {

  taskUrl: string = `${Host}/api/task`

  constructor(private http: Http) {
  }

  //创建任务
  createTask = (task: Task) => {
    return this.http.post(this.taskUrl, task)
      .map(this.send)
  }

  //根据用户获取任务
  getTaskByUser = (user_id: string) => {
    return this.http.get(`${this.taskUrl}?user_id=${user_id}`)
      .map(this.send)
  }

  //更新任务排序
  updateTaskOrder = (task: Task) => {
    return this.http.put(`${this.taskUrl}/${task.task_id}`, task)
      .map(this.send)
  }

  //根据区域type获取任务
  getTaskByType = (user_id, type) => {
    return this.http.get(`${this.taskUrl}/bytype?user_id=${user_id}&type=${type}`)
      .map(this.send)
  }

  //更新任务信息
  updateUserInfo=(task:Task)=>{
    return this.http.post(`${this.taskUrl}/update`,task)
      .map(this.send)
  }

  //对任务的完成状态更新
  updateTaskStatus=(task:Task)=>{
    return this.http.put(`${this.taskUrl}/status/update/${task.task_id}`,task)
      .map(this.send)
  }
  send = (res: Response) => {
    return res.json()
  }
}

export class Task {
  task_id?: string
  task_content?: string
  project_id?: string
  desc?: string
  order?: number
  project_order?: number
  type?: string
  t_project?:Project
  t_user_task?:any
  hand_user_id?:string

}
