/**
 * Created by 李 on 2017/2/3.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
    switch=(e,position:string)=>{
       let c_classList = e.target.classList;             //当前选中circle的样式组
       let img_classList = document.getElementById(position).classList;
       let circles = document.getElementsByClassName('circle');            //所有的circle样式类
       let bg_imgs = document.getElementsByClassName('bg_img');            //所有的背景图样式类
      //先把其他选中的去除.active样式
       for(let i=0;i<circles.length;i++){
         let _classList = circles[i].classList;
         _classList.remove('active');
       }
       //给当前选中的添加active样式类
       c_classList.add('active');
      // 改变显示的图片
      for(let i=0;i<bg_imgs.length;i++){
        let _classList = bg_imgs[i].classList;
        _classList.remove('active');
      }
      img_classList.add('active');
    }
}
