/**
 * Created by 李 on 2017/3/15.
 */
import {Injectable} from '@angular/core';
import {Response, Http} from '@angular/http';
import {config} from '../app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const host = config.host       //主机
@Injectable()
export class UserService {

  userLoginUrl = `${host}/api/user/login`
  userRegisterUrl = `${host}/api/user/register`
  emailUrl = `${host}/api/email`
  uploadImgUrl = `${host}/api/user/uploadImg`
  updateUserInfoUrl = `${host}/api/user/updateInfo`
  modifyPassUrl = `${host}/api/user/modifyPass`
  userUrl = `${host}/api/user`

  visitUrl  =`${host}/api/visite`

  constructor(private http:Http) {
  }


  //登录
  login = (obj: User) :Observable<any>=> {
     return this.http.post(this.userLoginUrl, obj)
       .map(this.send)
  }

  //注册
  register = (obj: any):Observable<any> => {
    return this.http.post(this.userRegisterUrl, obj)
      .map(this.send)

  }

  //获取邮箱验证码
  getEmailCode=(email:Email):Observable<any>=>{
    let url = `${this.emailUrl}?email=${email}`
    return this.http.get(url)
      .map(this.send)
  }

  //上传头像
  uploadImg=(user:User):Observable<any>=>{
      return this.http.put(this.uploadImgUrl,user)
        .map(this.send)
  }

  //修改信息
  updateUserInfo=(user:User):Observable<any>=>{
    return this.http.put(this.updateUserInfoUrl,user)
      .map(this.send)
  }

  //修改密码
  modifyPass=(user:User):Observable<any>=>{
    return this.http.put(this.modifyPassUrl,user)
      .map(this.send)
  }

  //获取多个用户信息
  getSomeUserInfo=(user_ids:User[]):Observable<any>=>{
    return this.http.post(this.userUrl,user_ids)
      .map(this.send)
  }

  //查询某一用户的信息
  getUserInfo=(user_id:User)=>{
    let url = `${this.userUrl}?user_id=${user_id}`
    return this.http.get(url)
      .map(this.send)

  }
  //邀请用户进入团队
  visiteMember=(obj)=>{
   return this.http.post(this.visitUrl,obj)
      .map(this.send)
  }
  send = (res: Response) => {
    return res.json()
  }

}
export class User {
  user_id?:string
  email_id?:string
  email?: string
  password?: string
  username?:string
  imgurl?:string
  job?:string
  section?:string
  createdAt?:string
  updatedAt?:string
}
export class Email{
  email?:string
  email_id?:string
  code?:string
  isActive?:number
  modifiFlag?:string
  createdAt?:string
  updatedAt?:string
}
