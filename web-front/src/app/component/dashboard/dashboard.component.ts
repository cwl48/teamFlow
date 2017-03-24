/**
 * Created by 李 on 2017/2/8.
 */
import {Component, OnChanges, OnInit} from '@angular/core';
import {socket} from "../../tool/socket/socket";
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.connectSocket()
    this.onResize();
    this.setMainWidth();
  }

  //动态设置右侧Main的宽度
  setMainWidth = () => {
    let main = document.getElementById('main');
    let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;    //获取宽度
    main.style.width = clientWidth - 60 + 'px';
  }

  //监听屏幕大小变化
  onResize = () => {
    window.onresize = () => {
      this.setMainWidth();      //动态设置宽度
    }
  }
  //socket连接 并触发登录
  connectSocket = () => {
    //建立socket连接
    //通知服务器 有人登录,传递登录人的id
    socket.on("connect", () => {                   //服务器断线重连
      console.log("Connect socket success")
      socket.emit("login", {
        user_id: sessionStorage.getItem("token")
      })
    })
    console.log("Connect socket success")          //浏览器刷新直接重连
    socket.emit("login", {
      user_id: sessionStorage.getItem("token")
    })
  }
}
