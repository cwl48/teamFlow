/**
 * Created by 李 on 2017/3/27.
 */
import {Component, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import {TaskService} from "../../service/task.service";
@Component({
  moduleId: module.id,
  selector: 'project-count',
  templateUrl: 'project-count.component.html',
  providers: [TaskService]
})
export class ProjectCountComponent implements OnInit {


  project_id: string

  doneNums: number
  noDoneNums: number
  totalNums: number
  percent: number

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.project_id = sessionStorage.getItem("project_id")

    this.getTopData()
    this.getDatasByTypes()
    this.setCapacity()
    this.getTaskAboutMember()
  }

  setProcess = (first,second) => {

    let charts = echarts.init(<any>document.getElementById("biao1"))
    let options = {
      title: {},
      tooltip: {},
      legend: {
        data: ['未完成', '已完成']
      },
      xAxis: {
        data: ["收件箱", "开发中", "待测试", "待发布", "已发布"]
      },
      yAxis: {},
      series: [{
        name: '未完成',
        type: 'bar',
        stack: 'one',
        data: first
      }, {
        name: '已完成',
        type: 'bar',
        stack: 'one',
        data: second
      },
      ],
      barWidth: '55%'
    }
    charts.setOption(options)
  }

  setPower = (arr,arr1,arr2) => {

    let charts = echarts.init(<any>document.getElementById('biao2'));

    let options = {
      tooltip: {},
      legend: {
        data: ['未完成', '已完成']
      },
      grid: {
        top: "25px",
        left: "20%",
        bottom: "10%"
      },
      dataZoom: [
        {
          yAxisIndex: [0],
          type: 'slider',
          start: 1,
          end: 50,
          width: 20,
        }
      ],
      xAxis: {
        axisLine: {            //隐藏坐标轴
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data:arr
      },
      series: [
        {
          name: '未完成',
          type: 'bar',
          stack:'two',
          // 和itemStyle一样则不需要设置
          // lineStyle: {
          //   normal: {
          //     color:"#249de0"   // 线条颜色
          //   }
          // },
          data: arr1
        }, {
          name: '已完成',
          type: 'bar',
          stack:'two',
          // 和itemStyle一样则不需要设置
          // lineStyle: {
          //   normal: {
          //     color:"#249de0"   // 线条颜色
          //   }
          // },
          data: arr2
        }
      ],
      color: ['#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      barWidth: '20%'
    };

    // 使用刚指定的配置项和数据显示图表。
    charts.setOption(options);
  }
  setCapacity = () => {

    let charts = echarts.init(<any>document.getElementById('bing'));

    let options = {
      tooltip: {},
      title: {
        text: this.percent + "%",
        x: 'center',
        y: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} \n ({d}%)'
              },
              labelLine: {
                show: true
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          // itemStyle: {
          //   normal: {
          //     color: "#249de0",  // 会设置点和线的颜色，所以需要下面定制 line
          //     borderColor: "#249de0"  // 点边线的颜色
          //   }
          // },
          // 和itemStyle一样则不需要设置
          // lineStyle: {
          //   normal: {
          //     color:"#249de0"   // 线条颜色
          //   }
          // },
          data: [
            {name: "完成", value: this.doneNums},
            {name: "未完成", value: this.noDoneNums}
          ]
        }
      ],
      color: ["#0c506d", "#249de0", "#6fc8ef", "#64f2bb", "#1ee09a", "#07ad6d", '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
    }

    // 使用刚指定的配置项和数据显示图表
    charts.setOption(options);
  }


  //获取图表数据
  getTopData = () => {
    let obj = {
      project_id: this.project_id
    }
    this.taskService.getStateOfTask(obj)
      .subscribe(data => {
        this.doneNums = data.datas.doneNums
        this.noDoneNums = data.datas.noDoneNums
        this.totalNums = this.doneNums + this.noDoneNums
        this.percent = this.doneNums / this.totalNums * 100
        this.setCapacity()
      })
  }

  //获取项目进度相关数据
  getDatasByTypes=()=>{
    let obj = {
      project_id: this.project_id
    }
    this.taskService.getStateTaskThroughType(obj)
      .subscribe(data => {
        this.setProcess(data.datas.first,data.datas.second)
      })
  }

  //获取项目的成员完成情况
  getTaskAboutMember=()=>{
    let obj = {
      project_id:this.project_id
    }
    this.taskService.getSomePeopleState(obj)
      .subscribe(data=>{
        if(data.success){
          //把所有的人名放进专门的一个数组
          let arr = []
          //没有完成的
          let arr1 = []
          //完成了的
          let arr2 = []
          let res = data.datas
          res.forEach(d=>{
            arr.push(d.username)
            arr1.push(d.noDonetasksNum)
            arr2.push(d.donetasksNum)
          })
          this.setPower(arr,arr1,arr2)
        }
      })
  }

}
