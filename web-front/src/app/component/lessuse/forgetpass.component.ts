/**
 * Created by 李 on 2017/2/7.
 */
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'forget-pw',
  templateUrl: './forgetpass.component.html'
})
export class ForgetPassComponent implements OnInit {

  email: string = '';        //邮箱地址
  code: string = '';       //验证码
  error: number = 0;      //错误数量

  constructor() {
  }

  ngOnInit() {
  }

  //获取验证码
  getsms=()=>{

  }
  cancelError = (e): void => {
    let classList = e.target.classList;
    classList.remove('error');
    this.error = 0;
  };

  //验证邮箱验证码
  veriCode=()=>{

  }
}
