/**
 * Created by 李 on 2017/3/22.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'userInfo-img',
  templateUrl: 'userInfo-img.component.html'
})
export class UserInfoImgComponent implements OnInit{

  @Input() user_id:string  //该组件所展示的用户id
  @Input() show:boolean   //父组件控制显示
  imgurl: string
  username:string
  section:string
  job:string
  phone:string
  email:string



  tip:string
  show_tip:boolean
  success:boolean
  constructor(private userService:UserService) {

  }

  ngOnInit() {
    this.getOneUserInfo(this.user_id)
  }
  getOneUserInfo=(user_id)=>{
    this.userService.getUserInfo(user_id)
      .subscribe(data=>{
        if(data.success){
          let res = data.datas
          this.imgurl = res.imgurl
          this.username = res.username
          this.email = res.email.email||"未填写"
          this.job = res.job||"未填写"
          this.section = res.section||"未填写"
          this.phone =res.phone||"未填写"
        }else{

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
