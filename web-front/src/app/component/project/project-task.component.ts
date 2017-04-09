/**
 * Created by 李 on 2017/3/27.
 */
import {Component, NgZone, OnInit} from '@angular/core';
import {Task, TaskService} from "../../service/task.service";
import {Project, ProjectService} from "../../service/project.service";
import {DragulaService} from "ng2-dragula";
import {TeamService} from "../../service/team.service";
import {User} from "../../service/user.service";
@Component({
  moduleId: module.id,
  selector: 'project-task',
  templateUrl: 'project-task.component.html',
  providers: [DragulaService, ProjectService, TaskService, TeamService]
})
export class ProjectTaskComponent implements OnInit {

  zone: NgZone
  task: Task
  show_task_detail: boolean
  top: boolean = true

  // 任务面板 收件箱
  taskpanels1: any = {
    tasks: [],
    addContent: "", handle_user_id: "", addShow: false, addShowSelect: false, type: "收件箱"
  }
  taskpanels2: any = {
    tasks: [],
    addContent: "", handle_user_id: "", addShow: false, addShowSelect: false, type: "开发中"
  }
  taskpanels3: any = {
    tasks: [],
    addContent: "", handle_user_id: "", addShow: false, addShowSelect: false, type: "待测试"
  }
  taskpanels4: any = {
    tasks: [],
    addContent: "", handle_user_id: "", addShow: false, addShowSelect: false, type: "待发布"
  }
  taskpanels5: any = {
    tasks: [],
    addContent: "", handle_user_id: "", addShow: false, addShowSelect: false, type: "已发布"
  }

  user_id: string
  project_id: string
  team_id: string
  //显示提示
  tip: string
  show_tip: boolean
  success: boolean
  userList: User[]
  place: string = '分配人员'
  select_focus: boolean


  constructor(private dragService: DragulaService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private teamService: TeamService) {
    this.zone = new NgZone({enableLongStackTrace: false});
    dragService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }

  ngOnInit() {
    document.addEventListener("click", () => {
      this.clearForm()
    })
    this.user_id = sessionStorage.getItem("token")
    this.project_id = sessionStorage.getItem("project_id")
    this.getTaskByUser(this.project_id)
    this.setMainHeight()

    //获取团队id
    this.projectService.getProjectInfo(this.project_id)
      .subscribe(data => {
        if (data.success) {
          this.team_id = data.datas.team_id
          this.getAllMemberOfProject()
        }
      })
  }

  //关闭task详情modal
  closeTaskModal = (e) => {
    this.show_task_detail = e
  }
  changeSelectFocus = (e, panel, cla) => {
    panel.addShowSelect = !panel.addShowSelect
    this.scrollToBottom(cla)
    this.stopBubble(e)
  }
  clearForm = () => {
    this.taskpanels1.addContent = ''
    this.taskpanels2.addContent = ''
    this.taskpanels3.addContent = ''
    this.taskpanels4.addContent = ''
    this.taskpanels5.addContent = ''
    this.taskpanels1.addShow = false
    this.taskpanels2.addShow = false
    this.taskpanels3.addShow = false
    this.taskpanels4.addShow = false
    this.taskpanels5.addShow = false
    this.taskpanels1.addShowSelect = false
    this.taskpanels2.addShowSelect = false
    this.taskpanels3.addShowSelect = false
    this.taskpanels4.addShowSelect = false
    this.taskpanels5.addShowSelect = false
    this.taskpanels1.handle_user_id = ''
    this.taskpanels2.handle_user_id = ''
    this.taskpanels3.handle_user_id = ''
    this.taskpanels4.handle_user_id = ''
    this.taskpanels5.handle_user_id = ''
  }

//显示创建任务框
  addTaskShow = (e, type, cla) => {
    this.stopBubble(e)
    type.addShow = true
    this.scrollToBottom(cla)
  }
  //取消添加框
  cancelAdd = (type) => {
    type.addShow = false
  }
  // 滚动条滚到最底部
  scrollToBottom = (panel_) => {
    let panel = <any>document.getElementById(panel_);
    setTimeout(() => {
      panel.scrollTop = panel.scrollHeight;
    }, 50)
  }
  onDrop = (arg) => {
    let move_task_id = arg[0].id             //移动的任务id

    let target = arg[1].id               //移动后的目标任务区域
    let source = arg[2].id                //之前的目标任务区域
    let current_order = this.getOrderOfTask(arg[0].id, arg[1].id, "current")
    let pre_order = this.getOrderOfTask(arg[0].id, arg[1].id, "pre")            //上一个任务的order
    let next_order = this.getOrderOfTask(arg[0].id, arg[1].id, "next")      //下一个任务order
    let type: string                                                         //移入的区域块类型
    console.log(move_task_id, pre_order, current_order, next_order)


    let newOrder: number
    if (pre_order === -1 && next_order === -1) {
      newOrder = 65536
    }
    else if (pre_order === -1) {
      newOrder = next_order / 2
    }
    else if (next_order === -1) {
      newOrder = pre_order + 65536
    }
    else {
      newOrder = (next_order + pre_order) / 2
    }

    switch (target) {
      case "mail":
        type = "收件箱"
        break
      case "today":
        type = "开发中"
        break
      case "next":
        type = "待测试"
        break
      case "later":
        type = "待发布"
        break
      case "final":
        type = "已发布"
        break
      default:
        type = ""
    }
    //判断是否只是在自己任务区移动  是->只更新任务order 否则还要更新type
    if (target === source) {
      let obj = {
        task_id: move_task_id,
        newOrder: newOrder,
        type_project: ''
      }
      this.updateTaskOrder(obj, type)
    } else {
      let obj = {
        task_id: move_task_id,
        newOrder: newOrder,
        type_project: type
      }
      this.updateTaskOrder(obj, type)
    }
  }
  updateList=(e)=>{
    this.getTaskByType(this.project_id,e)
  }
  //获取任务在目标模板中的位置
  getOrderOfTask = (task_id: string, target_id: string, type: string): number => {
    if (type === "pre") {
      switch (target_id) {
        case "mail":
          return this.getPreOrder(task_id, this.taskpanels1.tasks)
        case "today":
          return this.getPreOrder(task_id, this.taskpanels2.tasks)
        case "next":
          return this.getPreOrder(task_id, this.taskpanels3.tasks)
        case "later":
          return this.getPreOrder(task_id, this.taskpanels4.tasks)
        case "final":
          return this.getPreOrder(task_id, this.taskpanels5.tasks)
        default:
          return -1
      }
    } else if (type === "next") {
      switch (target_id) {
        case "mail":
          return this.getLastOrder(task_id, this.taskpanels1.tasks)
        case "today":
          return this.getLastOrder(task_id, this.taskpanels2.tasks)
        case "next":
          return this.getLastOrder(task_id, this.taskpanels3.tasks)
        case "later":
          return this.getLastOrder(task_id, this.taskpanels4.tasks)
        case "final":
          return this.getLastOrder(task_id, this.taskpanels5.tasks)
        default:
          return -1
      }
    }
    else {
      switch (target_id) {
        case "mail":
          return this.getCurrentOrder(task_id, this.taskpanels1.tasks)
        case "today":
          return this.getCurrentOrder(task_id, this.taskpanels2.tasks)
        case "next":
          return this.getCurrentOrder(task_id, this.taskpanels3.tasks)
        case "later":
          return this.getCurrentOrder(task_id, this.taskpanels4.tasks)
        case "final":
          return this.getCurrentOrder(task_id, this.taskpanels5.tasks)
        default:
          return -1
      }
    }

  }
  // 获取当前元素的order
  getCurrentOrder = (task_id: string, tasks: any[]): number => {
    let len = tasks.length
    for (let i = 0; i < len; i++) {
      if (tasks[i].task_id === task_id) {
        return tasks[i].order_project
      }
    }
  }
  // 获取前一个元素的order
  getPreOrder = (task_id: string, tasks: any[]): number => {
    let len = tasks.length
    for (let i = 0; i < len; i++) {
      if (tasks[i].task_id === task_id && i > 0) {
        return tasks[i - 1].order_project
      }
    }
    return -1
  }

  // 获取后一个元素的order
  getLastOrder = (task_id: string, tasks: any[]): number => {
    let len = tasks.length
    for (let i = 0; i < len; i++) {
      if (tasks[i].task_id === task_id && i < len - 1) {
        return tasks[i + 1].order_project
      }
    }
    return -1
  }
  //动态设置右各任务板块的最大高度
  setMainHeight = () => {
    let panel1 = <any>document.getElementById('panel_content1');
    let panel2 = <any>document.getElementById('panel_content2');
    let panel3 = <any>document.getElementById('panel_content3');
    let panel4 = <any>document.getElementById('panel_content4');
    let panel5 = <any>document.getElementById('panel_content5');
    let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;    //获取宽度
    panel1.style.maxHeight = clientHeight - 240 + 'px';
    panel2.style.maxHeight = clientHeight - 240 + 'px';
    panel3.style.maxHeight = clientHeight - 240 + 'px';
    panel4.style.maxHeight = clientHeight - 240 + 'px';
    panel5.style.maxHeight = clientHeight - 240 + 'px';

  }
  //选择一个项目
  selOneItem = (item, type) => {
    type.handle_user_id = item.handle_user_id
  }
  //监听滚轮滚动
  listenWeel = (e) => {
    let deltaY = e.deltaY
    let mytask = document.getElementById("allTask")
    mytask.scrollLeft += deltaY
  }
  //阻止冒泡
  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation()
  }

  //更新task的order
  updateTaskOrder = (task: any, type) => {
    this.taskService.updateTaskProjctOrder(task)
      .subscribe(data => {
        if (data.success) {
          this.getTaskByType(this.project_id, type)
        }
      })
  }

  // 获取某一个区域块中的所有任务
  getTaskByType(project_id, type) {
    this.taskService.getTaskByTypeProject(this.project_id, type)
      .subscribe(data => {
        if (data.success) {
          //强制更新
          this.zone.run(() => {
            switch (type) {
              case "收件箱":
                this.taskpanels1.tasks = this.sortOrder(data.datas)
                break
              case "开发中":
                this.taskpanels2.tasks = this.sortOrder(data.datas)
                break
              case "待测试":
                this.taskpanels3.tasks = this.sortOrder(data.datas)
                break
              case "待发布":
                this.taskpanels4.tasks = this.sortOrder(data.datas)
                break
              case "已发布":
                this.taskpanels5.tasks = this.sortOrder(data.datas)
                break
            }
          })
        }
      })
  }

  // 获取任务板
  getTaskByUser = (project_id) => {
    this.taskService.getTaskByProject(project_id)
      .subscribe(data => {
        if (data.success) {

          let res = data.datas
          // 根据order排序
          let tasks1 = this.sortOrder(res.tasks1)
          let tasks2 = this.sortOrder(res.tasks2)
          let tasks3 = this.sortOrder(res.tasks3)
          let tasks4 = this.sortOrder(res.tasks4)
          let tasks5 = this.sortOrder(res.tasks5)

          this.taskpanels1.tasks = tasks1
          this.taskpanels2.tasks = tasks2
          this.taskpanels3.tasks = tasks3
          this.taskpanels4.tasks = tasks4
          this.taskpanels5.tasks = tasks5

        }
      })
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

  //获取该项目所属团队的成员
  getAllMemberOfProject = () => {
    this.teamService.getTeamInfo(this.team_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.users.forEach(d => {
            let obj = {
              name: d.username,
              handle_user_id: d.user_id
            }
            arr.push(obj)
          })
          this.userList = arr
        }
      })
  }


  //创建任务
  createTask = (type, e) => {
    this.stopBubble(e)
    //先判断是否填写project和task内容
    if (type.addContent === "") {
      this.showTip("任务内容不能为空")
      return
    }
    if (type.handle_user_id === "") {
      this.showTip("人员安排不能为空")
      return
    }
    let len = type.tasks.length
    let lastOrder = 0
    if (len > 0) {
      lastOrder = type.tasks[len - 1].order_project
    }
    let obj = {
      task_content: type.addContent,
      user_id: this.user_id,
      handle_user_id: type.handle_user_id,
      project_id: this.project_id,
      type_project: type.type,
      lastOrder: lastOrder
    }
    this.taskService.createTask(obj)
      .subscribe(data => {
        if (data.success) {
          this.clearForm()
          this.getTaskByType(this.project_id, type.type)
        }
      })

  }

  //根据order排序算法
  sortOrder = (arr) => {
    let len = arr.length
    let temp
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (arr[j + 1].order_project< arr[j].order_project) {
          temp = arr[j + 1]
          arr[j + 1] = arr[j]
          arr[j] = temp
        }
      }
    }
    return arr
  }
}
