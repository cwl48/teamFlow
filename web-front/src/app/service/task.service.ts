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

  //根据项目获取任务
  getTaskByProject = (project_id) => {
    return this.http.get(`${this.taskUrl}/byproject?project_id=${project_id}`)
      .map(this.send)
  }

  //更新任务排序
  updateTaskOrder = (task: Task) => {
    return this.http.put(`${this.taskUrl}/${task.task_id}`, task)
      .map(this.send)
  }

  //更新任务排序
  updateTaskProjctOrder = (task: Task) => {
    return this.http.put(`${this.taskUrl}/byProject/${task.task_id}`, task)
      .map(this.send)
  }

  //根据区域type获取任务
  getTaskByType = (user_id, type) => {
    return this.http.get(`${this.taskUrl}/bytype?user_id=${user_id}&type=${type}`)
      .map(this.send)
  }

  //更新任务信息
  updateUserInfo = (task: Task) => {
    return this.http.post(`${this.taskUrl}/update`, task)
      .map(this.send)
  }

  //对任务的完成状态更新
  updateTaskStatus = (task: Task) => {
    return this.http.put(`${this.taskUrl}/status/update/${task.task_id}`, task)
      .map(this.send)
  }

  //获取任务动态
  getMsgOfTaskByUser = (user_id, offset) => {
    return this.http.get(`${this.taskUrl}/msg/byuser?user_id=${user_id}&offset=${offset}`)
      .map(this.send)
  }

  //根据区域type_project获取任务
  getTaskByTypeProject = (project_id, type_porject) => {
    return this.http.get(`${this.taskUrl}/bytype?project_id=${project_id}&type_project=${type_porject}`)
      .map(this.send)
  }

  //获取项目任务完成情况
  getStateOfTask = (obj) => {
    return this.http.post(`${this.taskUrl}/state/tubiao1`, obj)
      .map(this.send)
  }

  //获取项目任务完成情况细节
  getStateTaskThroughType = (obj) => {
    return this.http.post(`${this.taskUrl}/state/tubiao2`, obj)
      .map(this.send)
  }

  //获取项目中人员的完成情况
  getSomePeopleState = (obj) => {
    return this.http.post(`${this.taskUrl}/state/tubiao3`, obj)
      .map(this.send)
  }

  //获取所有团队项目的任务完成情况
  getTeamProjectTaskState = (team_id) => {
    return this.http.get(`${this.taskUrl}/byTeam?team_id=${team_id}`)
      .map(this.send)
  }

  //通过团队获取成员的完成情况
  getStateByTeam=(team_id)=>{
    return this.http.get(`${this.taskUrl}/team/state?team_id=${team_id}`)
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
  t_project?: Project
  t_user_task?: any
  hand_user_id?: string
}

export class TaskMessage extends Task {
  message: string
}
