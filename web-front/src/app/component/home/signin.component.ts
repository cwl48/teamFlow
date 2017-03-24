/**
 * Created by 李 on 2017/2/7.
 */
import {Component, OnInit} from '@angular/core';
import {UserService, User} from "../../service/user.service";
import {Router} from "@angular/router";
import {ValidationService} from "../../tool/validation/validation";

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit {

  email: string = '';      //姓名
  password: string = '';       //密码
  tip: string = '';           //提示
  error: number = 0;        //错误条数

  constructor(private validation: ValidationService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.listenEnter()
  }

  login = () => {
    if (this.checkForm()) {
      let email_classList = document.getElementById('email').classList
      let password_classList = document.getElementById('password').classList
      //表单验证
      if (this.email === '') {
        this.tip = '请输入邮箱'
        this.error++
        //添加样式error
        email_classList.add('error')
      }
      if (this.password === '') {
        this.tip = '请输入密码'
        this.error++;
        password_classList.add('error')
      }
      if (this.error > 1) {
        this.tip = '请完整填写'
      }
      let user: User = {
        email: this.email,
        password: this.password
      }
      this.userService.login(user)
        .subscribe(data => {
          console.log(data)
          if (data.success) {

            let res = data.datas

            //存入页面持久数据
            sessionStorage.setItem("token", res.user_id)
            sessionStorage.setItem("headImg", res.imgurl)
            sessionStorage.setItem("username",res.username)
            sessionStorage.setItem("email",res.email.email)
            sessionStorage.setItem("job",res.job)
            sessionStorage.setItem("section",res.section)
            sessionStorage.setItem("phone",res.phone)
            this.router.navigate(["task"])
          }else{
            this.tip = data.msg
            this.error++;
          }
        })
    }
  };

  cancelError = (e): void => {
    let classList = e.target.classList
    classList.remove('error')
    this.error = 0
  }

  checkForm = () => {
    //邮箱能为空 格式也要正确
    if (!this.validation.verifiEmail(this.email)) {
      this.tip = '邮箱格式不正确'
      this.error++
      return false
    }
    return true
  }

  //监听回车键登录
  listenEnter=()=>{
    document.addEventListener("keyup",(e)=>{
      if(e.keyCode ===13){
        this.login()
      }
    })
  }

}
