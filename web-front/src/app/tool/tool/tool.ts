/**
 * Created by 李 on 2017/3/23.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class Tool {

  constructor() {
  }

  //判断数组是否有相同的值
  arrayHasTheSame=(arr:string[],ele:string)=>{
     for(let i=0;i<arr.length;i++){
       if(arr[i]===ele){
         return true
       }
     }
     return false
  }

  //阻止冒泡
  stopBubble=(e)=>{
    window.event ? e.cancelBubble = true : e.stopPropagation();

  }
}
