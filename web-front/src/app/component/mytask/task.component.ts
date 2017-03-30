import {Component, OnInit} from '@angular/core';
import {DragulaService} from "ng2-dragula";
import {Project, ProjectService} from "../../service/project.service";
import {Task, TaskService} from "../../service/task.service";

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  providers: [DragulaService, ProjectService, TaskService]
})
export class TaskComponent implements OnInit {

  task: Task
  show_task_detail: boolean
  top: boolean = true
  // 任务面板 收件箱
  taskpanels1: any = {
    tasks: [],
    addContent: "", project_id: "", addShow: false, addShowSelect: false, type: "收件箱"
  }
  taskpanels2: any = {
    tasks: [],
    addContent: "", project_id: "", addShow: false, addShowSelect: false, type: "今天"
  }
  taskpanels3: any = {
    tasks: [],
    addContent: "", project_id: "", addShow: false, addShowSelect: false, type: "下一步"
  }
  taskpanels4: any = {
    tasks: [],
    addContent: "", project_id: "", addShow: false, addShowSelect: false, type: "以后"
  }

  projectList: Project[] = []
  user_id: string
  place: string = '所属项目'
  select_focus: boolean

  //显示提示
  tip: string
  show_tip: boolean
  success: boolean

  constructor(private dragService: DragulaService,
              private projectService: ProjectService,
              private taskService: TaskService) {
    dragService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }

  ngOnInit() {

    document.addEventListener("click", () => {
      this.clearForm()
    })

    this.user_id = sessionStorage.getItem("token")
    this.getUserAllProjectInfo(this.user_id)
    this.setMainHeight()
    this.getTaskByUser(this.user_id)

  }

  clearForm = () => {
    this.taskpanels1.addContent = ''
    this.taskpanels2.addContent = ''
    this.taskpanels3.addContent = ''
    this.taskpanels4.addContent = ''
    this.taskpanels1.addShow = false
    this.taskpanels2.addShow = false
    this.taskpanels3.addShow = false
    this.taskpanels4.addShow = false
    this.taskpanels1.addShowSelect = false
    this.taskpanels2.addShowSelect = false
    this.taskpanels3.addShowSelect = false
    this.taskpanels1.project_id = ""
    this.taskpanels2.project_id = ""
    this.taskpanels3.project_id = ""
    this.taskpanels4.project_id = ""

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
    if (pre_order === -1) {
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
        type = "今天"
        break
      case "next":
        type = "下一步"
        break
      case "later":
        type = "以后"
        break
      default:
        type = ""
    }
    //判断是否只是在自己任务区移动  是->只更新任务order 否则还要更新type
    if (target === source) {
      let obj = {
        task_id: move_task_id,
        newOrder: newOrder,
        type: ''
      }
      console.log(obj)
      this.updateTaskOrder(obj, type)
    } else {
      let obj = {
        task_id: move_task_id,
        newOrder: newOrder,
        type: type
      }
      this.updateTaskOrder(obj, type)
    }
  }
  //更新task的order
  updateTaskOrder = (task: any, type) => {
    this.taskService.updateTaskOrder(task)
      .subscribe(data => {
        if (data.success) {
          this.getTaskByType(this.user_id, type)
        }
      })
  }

  // 获取某一个区域块中的所有任务
  getTaskByType(user_id, type) {
    this.taskService.getTaskByType(this.user_id, type)
      .subscribe(data => {
        console.log(data)
        if (data.success) {
          switch (type) {
            case "收件箱":
              this.taskpanels1.tasks = this.sortOrder(data.datas)
              break
            case "今天":
              this.taskpanels2.tasks = this.sortOrder(data.datas)
              break
            case "下一步":
              this.taskpanels3.tasks = this.sortOrder(data.datas)
              break
            case "以后":
              this.taskpanels4.tasks = this.sortOrder(data.datas)
              break
          }
        }
      })
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
        return tasks[i].order
      }
    }
  }
  // 获取前一个元素的order
  getPreOrder = (task_id: string, tasks: any[]): number => {
    let len = tasks.length
    for (let i = 0; i < len; i++) {
      if (tasks[i].task_id === task_id && i > 0) {
        return tasks[i - 1].order
      }
    }
    return -1
  }

  // 获取后一个元素的order
  getLastOrder = (task_id: string, tasks: any[]): number => {
    let len = tasks.length
    for (let i = 0; i < len; i++) {
      if (tasks[i].task_id === task_id && i < len - 1) {
        return tasks[i + 1].order
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
    let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;    //获取宽度
    panel1.style.maxHeight = clientHeight - 240 + 'px';
    panel2.style.maxHeight = clientHeight - 240 + 'px';
    panel3.style.maxHeight = clientHeight - 240 + 'px';
    panel4.style.maxHeight = clientHeight - 240 + 'px';

  }

  //监听滚轮滚动
  listenWeel = (e) => {
    let deltaY = e.deltaY
    let mytask = document.getElementById("allTask")
    mytask.scrollLeft += deltaY
  }
  selOneItem = (item, type) => {
    type.project_id = item.project_id
  }

  //获取用户的所有的项目
  getUserAllProjectInfo = (user_id) => {
    this.projectService.getUserAllProjectInfo(user_id)
      .subscribe(data => {
        if (data.success) {
          let arr = []
          data.datas.forEach(d => {
            let obj = {
              name: d.projectName,
              project_id: d.project_id
            }
            arr.push(obj)
          })
          this.projectList = arr
        }
      })
  }
  //阻止冒泡
  stopBubble = (e) => {
    window.event ? e.cancelBubble = true : e.stopPropagation();
  }
  changeSelectFocus = (e, panel, cla) => {
    panel.addShowSelect = !panel.addShowSelect
    this.scrollToBottom(cla)
    this.stopBubble(e)
  }
  //阻止滚动事件冒泡
  prevent = (e) => {
    this.stopBubble(e)
  }
  //显示创建任务框
  addTaskShow = (e, type, cla) => {
    this.stopBubble(e)
    type.addShow = true
    this.scrollToBottom(cla)
  }
  // 滚动条滚到最底部
  scrollToBottom = (panel_) => {
    let panel = <any>document.getElementById(panel_);
    setTimeout(() => {
      panel.scrollTop = panel.scrollHeight;
    }, 50)
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
  //创建任务
  createTask = (type, e) => {
    this.stopBubble(e)
    //先判断是否填写project和task内容
    if (type.addContent === "") {
      this.showTip("任务内容不能为空")
      return
    }
    if (type.project_id === "") {
      this.showTip("请选择所属项目")
      return
    }
    let len = type.tasks.length
    let lastOrder = 0
    if (len > 0) {
      lastOrder = type.tasks[len - 1].order
    }
    let obj = {
      task_content: type.addContent,
      user_id: this.user_id,
      project_id: type.project_id,
      handle_user_id: this.user_id,
      type: type.type,
      lastOrder: lastOrder
    }
    this.taskService.createTask(obj)
      .subscribe(data => {
        if (data.success) {
          this.clearForm()
          this.getTaskByUser(this.user_id)
        }
      })

  }

  // 获取任务板
  getTaskByUser = (user_id) => {
    this.taskService.getTaskByUser(user_id)
      .subscribe(data => {
        if (data.success) {
          let res = data.datas
          // 根据order排序
          let tasks1 = this.sortOrder(res.tasks1)
          let tasks2 = this.sortOrder(res.tasks2)
          let tasks3 = this.sortOrder(res.tasks3)
          let tasks4 = this.sortOrder(res.tasks4)


          this.taskpanels1.tasks = tasks1
          this.taskpanels2.tasks = tasks2
          this.taskpanels3.tasks = tasks3
          this.taskpanels4.tasks = tasks4

        }
      })
  }


  //取消添加框
  cancelAdd = (type) => {
    type.addShow = false
  }

  //根据order排序算法
  sortOrder = (arr) => {
    let len = arr.length
    let temp
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (arr[j + 1].order < arr[j].order) {
          temp = arr[j + 1]
          arr[j + 1] = arr[j]
          arr[j] = temp
        }
      }
    }
    return arr
  }
  //从子组件获取task
  getOneTaskFromChild = (e) => {
    console.log(e)
    this.task = e
    this.show_task_detail = true
  }
  //关闭task详情modal
  closeTaskModal = (e) => {
    this.show_task_detail = e
  }

  updateList=(e)=>{
    this.getTaskByType(this.user_id,e)
  }
}
