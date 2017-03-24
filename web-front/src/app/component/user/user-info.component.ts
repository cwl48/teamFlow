/**
 * Created by 李 on 2017/2/13.
 */
import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {socket} from "../../tool/socket/socket";


@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',

})
export class UserInfoComponent implements OnInit {

  user_id:string
  headImg: string = ''
  msg: string = ''
  imgData: string
  username: string
  modifyUserName: string = ''
  modifyName_flag: boolean = false
  modifyUser_btn_text: string = '修改用户名'
  tip: string
  show_tip: boolean = false

  //修改信息
  job: string = ""
  section: string = ""
  phone:string = ""
  modify_info_flag: boolean = false

  //修改密码
  modify_pass_flag: boolean = false
  old_pass: string = ''
  new_pass: string = ''
  new_pass1: string = ''

  success:boolean = false

  constructor(private userService: UserService,
              private router:Router
  ) {
  }

  ngOnInit() {
    document.addEventListener("click", (e) => {
      this.modifyName_flag = false
      this.modifyUser_btn_text = "修改用户名"
    })
    this.user_id = sessionStorage.getItem("token")
    this.getInitData(this.user_id)
    this.preView()
  }

  //初始化数据
  getInitData = (user_id) => {
      this.userService.getUserInfo(user_id)
        .subscribe(data=>{
          if(data.success){
            let res = data.datas
            this.headImg = res.imgurl
            this.username = res.username
            this.job = res.job||"未填写"
            this.section = res.section||"未填写"
            this.phone = res.phone ||"未填写"
          }else{

          }
        })
  }

  //阻止冒泡
  stopBuble = (e) => {
    if (e.stopPropagation) { //W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; //IE阻止冒泡方法
    }
  }
  //修改名字
  modifyName = (e) => {
    this.show_tip = false
    this.stopBuble(e)
    if (this.modifyName_flag) {
      if (this.modifyUserName === '') {
        this.showTip("用户名不能为空")
        return false
      }
      this.modifyName_flag = false
      this.modifyUser_btn_text = "修改用户名"
      //发送请求修改名字
      let obj = {
        user_id: this.user_id,
        username: this.modifyUserName,
      }
      this.userService.updateUserInfo(obj)
        .subscribe(data => {
          if (data.success) {
            this.getInitData(this.user_id)
            this.modifyUserName = ''
          } else {
            this.showTip(data.msg)
          }
        })
    }
    else {
      this.modifyName_flag = true
      this.modifyUser_btn_text = '确认修改'
    }
  }

  //修改信息
  modifyInfo = () => {
    if (this.modify_info_flag) {
      //请求修改信息
      let obj = {
        user_id: this.user_id,
        job: this.job,
        section: this.section,
        phone:this.phone
      }
      this.userService.updateUserInfo(obj)
        .subscribe(data => {
          if (data.success) {
            this.getInitData(this.user_id)
            this.cancelModify()
          }
          else {
            this.showTip(data.msg)
          }
        })
    }
    else {
      if (this.job === "未填写") {
        this.job = ""
      }
      if (this.section === "未填写") {
        this.section = ""
      }
      if (this.phone === "未填写") {
        this.phone = ""
      }
      this.modify_info_flag = true
    }
  }
  //取消修改信息
  cancelModify = () => {
    if (this.job === "") {
      this.job = "未填写"
    }
    if (this.section === "") {
      this.section = "未填写"
    }
    if (this.phone === "") {
      this.phone = "未填写"
    }
    this.modify_info_flag = false
  }

  //修改密码
  modifyPass = () => {

    if (this.modify_pass_flag) {
      if(this.old_pass === ""){
        this.showTip("原密码不能为空")
        return
      }
      //判断两次密码是否相同
      if ( this.new_pass.length<6 || this.new_pass1.length<6) {
        this.showTip("新密码至少6位")
        return
      }
      if (this.new_pass !== this.new_pass1) {
        this.showTip("新密码两次输入不一致")
        return
      }
      let obj = {
        user_id: this.user_id,
        oldPass: this.old_pass,
        newPass: this.new_pass
      }
      this.userService.modifyPass(obj)
        .subscribe(data => {
          if (data.success) {
            this.cancelModifyPass()
            this.showTip("修改成功,3秒后重新登录",true)
            sessionStorage.removeItem("token")
            setTimeout(()=>{
              this.router.navigate(["/login"])
            },3000)
          }
          else {
            this.showTip(data.msg)
          }
        })
    } else {
      this.modify_pass_flag = true
    }
  }
  cancelModifyPass = () => {
    this.modify_pass_flag = false
    this.old_pass = ''
    this.new_pass = ''
    this.new_pass1 = ''
  }
  //显示提示
  showTip = (tip: string, nodify?: boolean) => {
    this.tip = tip
    this.show_tip = true
    if (nodify) {
      this.success = true
    }
    setTimeout(()=>{
      this.show_tip = false
      this.success =false
    },1200)
  }

  //给上传图片相关事件绑定
  preView() {
    let _this_ = this
    //获取上传input框
    let img_input = document.querySelector("#upload");

    //选定图片事件
      img_input.addEventListener('change', (ev: any) => {
        // 获取第一张图片
        let img = ev.target.files[0];
        // 当文件不是图片时 return false;
        if (!img.type.match('image.*')) {
          return;
        }
        let size = img.size / 1000;
        if (size > 300) {
          _this_.showTip("图片大小请控制在300k以内")
          return
        }
        // 之后读取文件  并  预览
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.addEventListener('load', (e: any) => {
          _this_.uploadImg(e.target.result)
        });

      })

  }

  //上传头像
  uploadImg = (imgData) => {
    this.show_tip = false
    let obj = {
      user_id: this.user_id,
      imgData: imgData
    }
    this.userService.uploadImg(obj)
      .subscribe(data => {
        if (data.success) {

          //通知服务器修改了头像
          let obj ={
            msg:"modify_user_imgurl"
          }
          socket.emit("notify_msg",obj)
          this.headImg = data.datas.imgurl
          sessionStorage.setItem("headImg", this.headImg)
        }
        else {
          this.showTip(data.msg)
        }
      })
  }

  //退出系统
  exitSystem=()=>{
    sessionStorage.removeItem("token")
    this.router.navigate(["/login"])
  }
}
