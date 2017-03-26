///<reference path="../../../../../node_modules/@angular/core/src/animation/metadata.d.ts"/>
/**
 * Created by 李 on 2017/3/20.
 */
import {
  Component, OnInit, trigger, state, style, transition, animate, Input, Output,
  EventEmitter
} from '@angular/core';
import {Team, TeamService} from "../../../service/team.service";
import {ValidationService} from "../../../tool/validation/validation";
import {socket} from "../../../tool/socket/socket";
import {User} from "../../../service/user.service";
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'my-modal',
  templateUrl: 'my-modal.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({width: "*", height: "*"})),
      transition('void => *', [
        style({transform: 'scale(1)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'scale(0)'}))
      ])
    ])
  ],
  providers:[TeamService,ProjectService]
})
export class MyModalComponent implements OnInit{

  @Input() show: boolean               //是否显示
  @Input() title: string
  @Input() content: string             //内容指示
  @Input() width: string = '200'       //默认宽高
  @Input() height: string = '200'
  @Input() position: string = 'center'    //默认垂直居中
  @Input() type:string                  //开启方式
  @Output() notifyShow = new EventEmitter<boolean>()
  state: string



  //创建团队modal
  teamStep: number = 1
  select_focus: boolean
  teamName:string = ''
  belongs_phone:string = ''
  businessList: any[] = [{name:"互联网"},{name:"游戏"},{name:'金融'}]
  business: string = ''
  businessPlace: string = '行业'
  memberList:any[] = []                   //所有的团队成员（自己所在的团队，有多个）
  sel_members:any[] = []            //选择了的团队成员
  yaoqingEmailList: any[] = [             //邀请邮箱列表
    {email: ''}
  ]

  user_id:string                          //当前用户的id


  //提示相关
  tip: string
  show_tip: boolean
  success: boolean

  //创建项目相关
  projectName:string
  @Input() teamList:Team[] = []
  sel_team_id:string
  projectInfo:string
  teamPlace:string = "团队"

  constructor(private teamService:TeamService,
              private validation:ValidationService,
              private projectService:ProjectService
  ) {

  }

  ngOnInit() {
    document.addEventListener('click', (evt) => {
      this._notifyShow()
    })
    this.user_id = sessionStorage.getItem("token")
    let obj = {
      user_id:this.user_id,
      show:false
    }
    this.sel_members.push(obj)

  }


  //阻止冒泡
  stopBuble = (e) => {
    this.select_focus = false
    for(let i=0;i<this.sel_members.length;i++){
      this.sel_members[i].show = false
    }
    for(let i=0;i<this.memberList.length;i++){
      this.memberList[i].show = false
    }
    if (e.stopPropagation) { //W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; //IE阻止冒泡方法
    }
  }

  //通知父组件关闭此Modal
  _notifyShow = () => {
    this.teamStep = 1
    this.teamName = ''
    this.business = ''
    this.belongs_phone = ''
    this.yaoqingEmailList = [{email: ''}]
    this.sel_members = []
    let obj = {
      user_id:this.user_id,
      show:false
    }
    this.sel_members.push(obj)
    this.sel_team_id = ''
    this.projectName = ''
    this.projectInfo = ''
    this.notifyShow.emit(false)
  }

  changeSelectFocus=(e) =>{
    this.select_focus?this.select_focus=false:this.select_focus =true
    if (e.stopPropagation) { //W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; //IE阻止冒泡方法
    }
  }
  changeUserInfoModal=(item,items,e)=>{
    if(!item.show){
      for(let i=0;i<items.length;i++){
        items[i].show = false
      }
      item.show = true
    }else{
      item.show = false
    }
    if (e.stopPropagation) { //W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; //IE阻止冒泡方法
    }
  }
  //选择行业
  selBusiness = (e) => {
    this.business = e.name
  }

  //选择团队
  selectTeam=(e)=>{
     this.sel_team_id = e.team_id
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
  //添加邮箱
  addEmail = () => {
    if (this.yaoqingEmailList.length < 2) {
      let obj = {email: ''}
      this.yaoqingEmailList.push(obj)
    }
    else {
      this.showTip("目前只支持一次性邀请两个邮箱")
    }
  }
  switchStep = (num) => {
    if(num===2){
      //验证电话号码
      if(this.teamName===""||this.belongs_phone===""||this.business===""){
        this.showTip("请填写完整")
      }
      else if(!this.validation.verifyPhone(this.belongs_phone)){
        this.showTip("电话号码格式不对")
      } else{
        this.teamStep = num
        this.getTeamMemberByUser()
      }
    }else{
      this.memberList.forEach(user=>{
        if(user.sel){
          let obj ={
            user_id:user.user_id,
            show:false
          }
          this.sel_members.push(obj)
        }
      })
      this.teamStep = num
    }
  }

  //获取当前用户所在团队的成员
  getTeamMemberByUser=()=>{
    this.teamService.getTeamMember(sessionStorage.getItem("token"))
      .subscribe(data=>{
        console.log(data);
        if(data.success){
          let arr:any[] = []
          data.datas.forEach((user:any)=>{
            let obj = {
              show:false,
              sel:false,
              user_id:user.user_id,
              username:user.username
            }
            arr.push(obj)
          })
           this.memberList = arr
        }else{
          this.showTip(data.msg)
        }
      })
  }



  //选择需要邀请的成员
  selUser=(item)=>{
      item.sel?item.sel=false:item.sel = true
  }

  //创建团队
  createTeam=()=>{
    let emails = []
    this.yaoqingEmailList.forEach(obj=>{
      if(obj.email!==""){
       emails.push(obj.email)
      }
    })
    let arr = []
    for(let i=0;i<this.sel_members.length;i++){
      arr.push(this.sel_members[i].user_id)
    }
    let obj = {
      user_id:this.user_id,
      teamName:this.teamName,
      phone:this.belongs_phone,
      bussiness:this.business,
      member_ids:arr,
      inviteEmails:emails
    }
    this.teamService.createTeam(obj)
      .subscribe(data=>{
        if(data.success){
          Object.assign(obj,{msg:"invite_into_team"})
          socket.emit("notify_msg",obj)
          this._notifyShow()
        }else{
          this.showTip(data.msg)
        }
      })
  }
  //创建项目
  createProject=()=>{
    //验空
    if(this.projectName===""){
      this.showTip("项目名不能为空")
      return
    }
    if(this.sel_team_id===""){
      this.showTip("请选择团队")
      return
    }
     let obj ={
       user_id:this.user_id,
       projectName:this.projectName,
       team_id:this.sel_team_id,
       projectInfo:this.projectInfo
     }
     this.projectService.createProject(obj)
       .subscribe(data=>{
         if(data.success){
           this._notifyShow()
         }else{
           this.showTip(data.msg)
         }
       })
  }

}
