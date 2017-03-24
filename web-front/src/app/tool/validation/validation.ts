/**
 * Created by 李 on 2017/3/22.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    constructor() { }

    //验证电话号码
    verifyPhone=(str:string)=>{
      if(!(/^1(3|4|5|7|8)\d{9}$/.test(str))){
        return false;
      }
      return true
    }

  //验空
  verifiNull=(str:string)=>{
    if(str===""){
      return false
    }
    return true
  }

  //验证邮箱格式
  verifiEmail=(str:string)=>{
    let reg = /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/
    if(reg.test(str)){
      return true
    }
    return false
  }

}
