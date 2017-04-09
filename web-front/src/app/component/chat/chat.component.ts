/**
 * Created by 李 on 2017/3/30.
 */
import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Team, TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";
import {socket} from "../../tool/socket/socket";
import {ChatsService} from "../../service/chat.service";

@Component({
  moduleId: module.id,
  selector: 'chat-panel',
  templateUrl: 'chat.component.html',
  providers: [TeamService, ChatsService]
})
export class ChatPanelComponent implements OnInit, AfterViewInit {

  zone: NgZone
  user_id: string
  dataList: any[] = []
  dataList1: any[] = []

  groupChat: boolean = true

  team_id: string
  target_user_id: string

  show_emoji: boolean
  emojiList1: any[] = []
  emojiList2: any[] = []
  emojiList3: any[] = []
  emojiList4: any[] = []
  emoji_page: string

  //光标最后位置
  savedRange: any
  // 是否发送成功
  isSend: boolean

  messageList: any[] = []
  messageList1: any[] = []

  totalList: any[] = []
  room_name: string
  room_name1: string

  offsetPage: number = 1
  count: number
  count1: number
  loading: boolean

  // 在其他栏目是否有新消息
  newChatInUser: boolean
  newChatInTeam: boolean

  // 向上滚之前的聊天记录高度
  preHeight: number = 0

  //提示
  tip: string
  show_tip: boolean
  success: boolean

  //成员信息modal位置
  direct:string = "right-center"
  constructor(private teamService: TeamService,
              private chatService: ChatsService) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  ngOnInit() {

    document.addEventListener("click", () => {
      let textArea = <any>document.getElementById("editor")
      textArea.focus()
      this.show_emoji = false
      for(let i=0;i<this.messageList.length;i++){
        this.messageList[i].show_info =false
      }
      for(let i=0;i<this.messageList1.length;i++){
        this.messageList1[i].show_info =false
      }
    })
    document.addEventListener("selectionchange", this.HandleSelectionChange, false)

    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        this.sendMessage()
      }
    })
    let textArea = <any>document.getElementById("editor")
    textArea.focus()

    this.user_id = sessionStorage.getItem("token")
    this.emoji_page = '1'
    this.getAllTeam()
    this.getTeamsAllUser()
    this.getAllEmoji()
    this.listenMsgByTeamRoom()

  }

  ngAfterViewInit() {
    let panel = <any>document.getElementById("messageList")
    setTimeout(() => {
      this.preHeight = panel.scrollHeight;
    }, 50)
  }

  selRoomType = (type) => {

    if (type === "team") {
      this.newChatInTeam = false
      this.groupChat = true
    } else {
      this.newChatInUser = false
      this.groupChat = false
    }
    this.offsetPage = 1
    this.getFocus()
    this.scrollToBottom()
  }

  //寻找focus的元素
  getFocus = () => {
    if (this.groupChat) {
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].focus) {
          this.room_name = this.dataList[i].name
        }
      }
    } else {
      for (let i = 0; i < this.dataList1.length; i++) {
        if (this.dataList1[i].focus) {
          this.room_name = this.dataList1[i].name
        }
      }
    }
  }

  //获取所有的团队
  getAllTeam = () => {
    this.teamService.getTeamByUser(this.user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              imgurl: d.imgurl,
              name: d.teamName,
              id: d.team_id,
              focus: false,
              tip_num: 0
            }
            arr.push(obj)
          })
          this.dataList = arr
          this.team_id = this.dataList[0].id
          this.room_name = this.dataList[0].name
          this.dataList[0].focus = true
          this.getMsgByTeam(1)
        }
      })
  }

  //获取所有的成员好友
  getTeamsAllUser = () => {
    this.teamService.getTeamMember(this.user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              imgurl: d.imgurl,
              name: d.username,
              id: d.user_id,
              focus: false,
              tip_num: 0
            }
            arr.push(obj)
          })
          this.dataList1 = arr
          this.target_user_id = this.dataList1[0].id
          this.room_name = this.dataList1[0].name
          this.dataList1[0].focus = true
          this.getMsgByPerson(1)
        }
      })
  }


  selOne = (item) => {
    this.offsetPage = 1
    this.preHeight = 0
    if (this.groupChat) {
      this.messageList = []
      //清除其他房间的选择
      this.dataList.forEach(data => {
        data.focus = false
      })
      this.team_id = item.id
      this.room_name = item.name
      this.getMsgByTeam(1)
      item.tip_num = 0
      item.focus = true

    } else {
      this.messageList1 = []
      //清除其他房间的选择
      this.dataList1.forEach(data => {
        data.focus = false
      })
      this.target_user_id = item.id
      this.room_name = item.name
      this.getMsgByPerson(1)
      item.focus = true
      item.tip_num = 0
    }
    this.scrollToBottom()
  }

  getAllEmoji = () => {
    this.chatService.getAllEmoji()
      .subscribe(data => {
        this.emojiList1 = data.datas.slice(0, 32)
        this.emojiList2 = data.datas.slice(32, 64)
        this.emojiList3 = data.datas.slice(64, 95)
      })
  }
  switchPage = (num) => {
    this.emoji_page = num
  }
  showEmoji = (e) => {
    this.stopBubble(e)
    this.show_emoji = true

  }

  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation()
  }

  selOneEmoji = (item) => {
    //选择一个emoji就往内容框中拼接一个数据
    this.doInsert(item.url)
    this.show_emoji = false
  }


  doInsert = (text) => {
    let textArea = <any>document.getElementById("editor")
    let sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount == 0 && this.savedRange != null) {
      sel.addRange(this.savedRange);
    }
    if (sel && sel.rangeCount > 0) {
      let range = sel.getRangeAt(0);
      let node = document.createElement("img");
      let node_last = node.lastChild
      node.src = text
      node.style.width = 20 + "px"
      range.deleteContents()
      range.insertNode(node)
      range.setStart(textArea, range.endOffset)               //妈的，搞了好久啊，设置光标自动往下挑一格
      range.setEnd(textArea, range.endOffset)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
  //监听光标改变，设置光标位置
  HandleSelectionChange = () => {
    let sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0)
    }
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
  //发送按钮
  sendMessage = () => {
    let textArea = <any>document.getElementById("editor")
    if (textArea.innerHTML.trim() === "") {
      this.showTip("消息不能为空")
      return
    }
    let obj = {}
    if (this.groupChat) {
      obj = {
        team_id: this.team_id,
        chat_content: `${textArea.innerHTML}`,
        user_id: this.user_id
      }
      socket.emit("send_in_room", obj)
      this.messageList.push(obj)
    } else {
      obj = {
        user_id: this.user_id,
        target_user_id: this.target_user_id,
        chat_content: `${textArea.innerHTML}`
      }
      socket.emit("send_in_person", obj)
      this.messageList1.push(obj)
    }


    this.isSend = true
    textArea.innerHTML = ""
    this.scrollToBottom()
  }

  //监听发来的消息
  listenMsgByTeamRoom = () => {
    socket.on("send_in_room", (msg) => {
      this.zone.run(() => {
        if (msg.team_id !== this.team_id) {
          let index = this.getIndex(msg.team_id, "team")
          this.dataList[index].tip_num++
        }

        if (!this.groupChat) {
          this.newChatInTeam = true
          this.messageList1.push(msg)
        } else {
          this.messageList.push(msg)
        }
        this.scrollToBottom()
      })
    })
    socket.on("send_in_person", (msg) => {
      this.zone.run(() => {
        console.log(msg,msg.target_user_id,this.target_user_id)
        if (msg.user_id !== this.target_user_id) {
          let index = this.getIndex(msg.user_id, "user")
          this.dataList1[index].tip_num++
        }
        if (this.groupChat) {
          this.newChatInUser = true
          this.messageList.push(msg)
        } else {
          this.messageList1.push(msg)
        }

        this.scrollToBottom()
      })
    })
    //监听是否发送成功
    socket.on("send_success", msg => {
      this.zone.run(() => {
        this.isSend = false
      })
    })
  }
  //获取team中的消息
  getMsgByTeam = (offsetPage) => {
    this.loading = true
    this.chatService.getTeamChats(this.team_id, offsetPage)
      .subscribe(data => {
        if (data.success) {
          let panel = <any>document.getElementById("messageList");
          this.count = data.count
          this.loading = false
          data.datas.forEach(d=>{
            Object.assign(d,{show_info:false})
          })
          this.messageList = this.resverArr(data.datas).concat(this.messageList)

          if(offsetPage===1){
            this.scrollToBottom()
          }
          console.log(this.offsetPage)
          if (this.preHeight > 0&&offsetPage!==1) {
            setTimeout(() => {
              panel.scrollTop = panel.scrollHeight - this.preHeight;
            }, 50)
          }
          // 记录高度
          setTimeout(() => {
            this.preHeight = panel.scrollHeight;
          }, 50)
        }
      })
  }
  //获取私聊信息
  getMsgByPerson = (offsetPage) => {

    this.loading = true
    let obj = {
      user_id: this.user_id,
      target_user_id: this.target_user_id,
      offsetPage: offsetPage
    }
    this.chatService.getUsersChats(obj)
      .subscribe(data => {
        if (data.success) {
          let panel = <any>document.getElementById("messageList");
          this.count1 = data.count
          this.loading = false
          data.datas.forEach(d=>{
            Object.assign(d,{show_info:false})
          })
          this.messageList1 = this.resverArr(data.datas).concat(this.messageList1)
          if(offsetPage===1){
            this.scrollToBottom()
          }
          if (this.preHeight > 0&&offsetPage!==1) {
            setTimeout(() => {
              panel.scrollTop = panel.scrollHeight - this.preHeight;
            }, 50)
          }
          // 记录高度
          setTimeout(() => {
            this.preHeight = panel.scrollHeight;
          }, 50)

        }
      })
  }

  //监听滚轮向上滚
  listenTopScroll = (e) => {
    let target = e.target
    if (this.groupChat) {
      if (target.scrollTop === 0 && this.messageList.length < this.count) {
        this.offsetPage++
        this.getMsgByTeam(this.offsetPage)
      }
    } else {
      if (target.scrollTop === 0 && this.messageList1.length < this.count1) {
        this.offsetPage++
        this.getMsgByPerson(this.offsetPage)
      }
    }

  }
  // 滚动条滚到最底部
  scrollToBottom = () => {
    let panel = <any>document.getElementById("messageList");
    setTimeout(() => {
      panel.scrollTop = panel.scrollHeight;
    }, 50)
  }

  //数组颠倒顺序
  resverArr = (arr) => {
    return arr.reverse()
  }
  //查找team_id对应的datalist位置
  getIndex = (id, type) => {
    if (type === "team") {
      for (let i = 0; i < this.dataList.length; i++) {
        if (id === this.dataList[i].id) {
          return i
        }
      }
    } else {
      for (let i = 0; i < this.dataList1.length; i++) {
        if (id === this.dataList1[i].id) {
          return i
        }
      }
    }
    return -1
  }
  changeUserInfoModal=(item,items,e)=>{
    this.stopBubble(e)
    if(!item.show){
      for(let i=0;i<items.length;i++){
        items[i].show_info = false
      }
      item.show_info = true
    }else{
      item.show_info = false
    }
  }
}
