/**
 * Created by 李 on 2017/3/25.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TeamService} from "../../../service/team.service";

@Component({
  selector: 'team-basic-option',
  templateUrl: 'option-basic.component.html'
})
export class TeamBasicOptionComponent implements OnInit {

  team_id: string

  //团队信息
  teamName: string
  bussiness: string
  phone: string
  createTime: string
  desc: string
  imgurl

  //编辑控制
  modifyTeamInfo: boolean

  //确定是否删除团队
  destoryTeam:boolean = false

  //提示
  tip: string
  show_tip: boolean
  success: boolean

  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private router:Router
  ) {
  }

  ngOnInit() {
    this.team_id = sessionStorage.getItem("team_id")
    this.getTeamInfo(this.team_id)
    this.preView()
  }

  //获取团队信息
  getTeamInfo = (team_id: string) => {
    this.teamService.getTeamInfo(team_id)
      .subscribe(data => {
        if (data.success) {
          let res = data.datas
          this.teamName = res.teamName
          this.phone = res.belongs_phone
          this.bussiness = res.bussiness
          this.desc = res.desc
          this.createTime = res.createdAt.slice(0, 10)
          this.imgurl = res.imgurl
        }
      })
  }
  //修改信息
  modifyInfo = () => {
    if (this.modifyTeamInfo) {
      if (this.bussiness === "" || this.teamName === "" || this.phone === "") {
        this.showTip("请填写完整")
        return
      }
      let obj = {
        team_id: this.team_id,
        teamName: this.teamName,
        desc: this.desc,
        phone: this.phone,
        bussiness: this.bussiness
      }
      this.teamService.modifyInfo(obj)
        .subscribe(data => {
          if (data.success) {
            this.getTeamInfo(this.team_id)
            this.modifyTeamInfo = false
          }
          else {
            this.showTip(data.msg)
          }
        })
    } else {
      this.modifyTeamInfo = true
    }
  }
  //取消修改信息
  cancelModify = () => {
    this.getTeamInfo(this.team_id)
    this.modifyTeamInfo = false
  }
  //显示提示
  showTip = (tip: string, nodify?: boolean) => {
    this.tip = tip
    this.show_tip = true
    if (nodify) {
      this.success = true
    }
    setTimeout(() => {
      this.show_tip = false
      this.success = false
    }, 1200)
  }

  //给上传图片相关事件绑定
  preView = () => {
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
        this.showTip("图片大小请控制在300k以内")
        return
      }
      // 之后读取文件  并  预览
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.addEventListener('load', (e: any) => {
        this.uploadImg(e.target.result)
      });

    })

  }
  //上传logo
  uploadImg = (imgData: string) => {
    let obj = {
      team_id: this.team_id,
      imgData: imgData
    }
    this.teamService.modifyInfo(obj)
      .subscribe(data => {
        if (data.success) {
          this.getTeamInfo(this.team_id)
        }
        else {
          this.showTip(data.msg)
        }
      })
  }

  showDestroyModal=()=>{
    this.destoryTeam = !this.destoryTeam
  }
  //解散团队
  destroy=()=>{
    let obj = {
      team_id:this.team_id,
      user_id:sessionStorage.getItem("token")
    }
    this.teamService.destroy(obj)
      .subscribe(data=>{
        if(data.success){
          this.destoryTeam = false
          this.showTip(`您解散了->${this.teamName}`,true)
          setTimeout(()=>{
            this.router.navigate(["/task"])
          },2300)
        }else{
          this.showTip(data.msg)
        }
      })
  }
}
