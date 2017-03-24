/**
 * Created by 李 on 2017/2/8.
 */
import {Component, OnInit} from '@angular/core';
import {socket} from "../../tool/socket/socket";

@Component({
  selector: 'left-bar',
  templateUrl: './left-bar.component.html',
})
export class LeftBarComponent implements OnInit {

  imgurl: string
  has_add: boolean = false;

  show_modal: boolean
  width:string
  height:string

  title:string
  type:string
  constructor() {
  }

  ngOnInit() {
    //监听document中的点击事件
    document.addEventListener('click', (evt) => {
      this.has_add = false;
    })
    this.imgurl = sessionStorage.getItem("headImg")
    this.listenSocket()

  }

  toggle = (e) => {
    this.has_add = !this.has_add;
    //阻止点击冒泡
    window.event ? e.cancelBubble = true : e.stopPropagation();
  }

  createTeam = () => {
    this.show_modal = true
    this.width = "678"
    this.height = "491"
    this.title = '新建团队'
    this.type = 'team'
  }

  createProject = () =>{
    this.show_modal = true
    this.width = "678"
    this.height = "350"
    this.title = '新建项目'
    this.type = 'project'
  }
  closeShowModal=()=>{
    this.show_modal = false
  }

  //监听服务器socket通知
  listenSocket=()=>{
    //监听改变该组件上的头像
    socket.on("notify_msg",(msg)=>{
      if(msg==="change user_img") {
        this.imgurl = sessionStorage.getItem("headImg")
      }
    })

    //监听改变该组件上的通知
    socket.on("notify_msg",(msg)=>{
      if(msg==="has notify"){
        console.log("接收到了")
      }
    })
  }

}
