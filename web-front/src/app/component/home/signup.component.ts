/**
 * Created by 李 on 2017/2/7.
 */
import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router, ActivatedRoute} from "@angular/router";
import {ValidationService} from "../../tool/validation/validation";

@Component({
  selector: 'sign-up',
  templateUrl: './signup.component.html',
  providers: [UserService, ValidationService]
})
export class SignUpComponent implements OnInit {

  email: string = ''       //邮箱地址
  userName: string = ''      //姓名
  password: string = ''       //密码
  tip: string = ''           //提示
  error: number = 0        //错误条数
  code: string;
  button_msg: string = '获取验证码'
  isRegister:boolean = false
  team_id = ''
  constructor(private validation: ValidationService,
              private userService: UserService,
              private router: Router,
              private route:ActivatedRoute

) {
  }

  //获取当前Url的team_id参数
  getQueryParams=()=>{
    this.route.queryParams
      .subscribe(data=>{
         this.team_id = data["team_id"]
      })
  }

  ngOnInit() {
    this.getQueryParams()
    //判断获取验证码时间是否小于现在的时间60s
    let getTime = window.sessionStorage.getItem('click_time')
    let getSms = document.querySelector("#getSms")
    let classList = <any>getSms.classList
    if (getTime !== null) {
      //更新按钮内容
      let timer = setInterval(() => {
        let now = Number(getTime) - Math.floor(new Date().getTime() / 1000);
        if (now >= 0) {
          this.button_msg = `${now}s之后获取`
          classList.value = 'btn disabled';
          getSms.setAttribute("disabled", 'disabled')

        } else {
          this.button_msg = '获取验证码';
          classList.value = 'btn btn-success getsms bg-fb9fad';
          getSms.removeAttribute('disabled');
          clearInterval(timer);
        }
      }, 1000);

    }
  }

  //验证码60秒获取延迟
  flag_delay = () => {
    //记住(或更新)点击时间
    let click_time = Math.floor(new Date().getTime() / 1000) + 60 + '';
    let getSms = document.querySelector("#getSms");
    let classList = <any>getSms.classList;
    classList.value = 'btn disabled';
    //保存
    window.sessionStorage.setItem('click_time', click_time);
    let getTime = window.sessionStorage.getItem('click_time');
    //更新按钮内容
    let timer = setInterval(() => {
      let now = Number(getTime) - Math.floor(new Date().getTime() / 1000);
      if (now >= 0) {
        this.button_msg = `${now}s之后获取`;
        getSms.setAttribute("disabled", 'disabled')
      } else {
        this.button_msg = '获取验证码';
        classList.value = 'btn btn-success getsms bg-fb9fad';
        getSms.removeAttribute('disabled');
        clearInterval(timer);
      }
    }, 1000);
  }

  //注册
   register = () => {
    if (this.checkForm()) {
      let email_classList = document.getElementById('email').classList
      let username_classList = document.getElementById('username').classList
      let password_classList = document.getElementById('password').classList
      //表单验证
      if (this.email === '') {
        this.tip = '请输入邮箱'
        this.error++
        //添加样式error
        email_classList.add('error');
      }
      if (this.userName === '') {
        this.tip = '请输入姓名'
        this.error++;
        username_classList.add('error');
      }
      if (this.password === '') {
        this.tip = '请输入密码'
        this.error++
        password_classList.add('error');
      }
      if (this.error > 1) {
        this.tip = '请完整填写'
      }
      let obj = {
        email: this.email,
        code: this.code,
        username: this.userName,
        password: this.password
      }
      if(this.team_id!==''){
         Object.assign(obj,{team_id:this.team_id})
      }
      //注册请求
      this.userService.register(obj)
        .subscribe(data => {
          if (data.success) {
            this.isRegister = true
            setTimeout(()=>{                        //三秒后登陆
              this.router.navigate(["login"])
            },3000)
          } else {
            this.tip = data.msg
            this.error++
          }
        })
    }
  }
  //获取邮箱验证码
  getEmailCode = () => {
    if (this.checkForm()) {
      this.userService.getEmailCode(this.email)
        .subscribe(data => {
          if (data.success) {
            this.flag_delay()
          } else {
            this.tip = data.msg
            this.error++
          }
        })
    }
  }
  //去除错误提示
  cancelError = (e): void => {
    let classList = e.target.classList;
    classList.remove('error')
    this.error = 0
  }
// 表单验证
  checkForm = () => {
    //邮箱能为空 格式也要正确
    if (!this.validation.verifiEmail(this.email)) {
      this.tip = '邮箱格式不正确'
      this.error++
      return false
    }
    return true
  }
}
