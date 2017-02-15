/**
 * Created by 李 on 2017/2/7.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'sign-up',
    templateUrl: 'signup.component.html'
})
export class SignUpComponent implements OnInit {

    email:string='';        //邮箱地址
    userName:string='';      //姓名
    password:string='';       //密码
    tip:string='';           //提示
    error:number=0;        //错误条数
    code:string;

    constructor() { }
    ngOnInit() { }
    signUp=()=>{
      let email_classList = document.getElementById('email').classList;
      let username_classList =document.getElementById('username').classList;
      let password_classList = document.getElementById('password').classList;
      //表单验证
      if(this.email===''){
        this.tip='请输入邮箱'
        this.error++;
        //添加样式error
        email_classList.add('error');
      }
      if(this.userName===''){
        this.tip='请输入姓名'
        this.error++;
        username_classList.add('error');
      }
      if(this.password==='') {
        this.tip = '请输入密码'
        this.error++;
        password_classList.add('error');
      }
      if(this.error>1){
        this.tip='请完整填写'
      }
    };
    cancelError=(e):void=>{
       let classList = e.target.classList;
       classList.remove('error');
       this.error = 0;
    };
}
