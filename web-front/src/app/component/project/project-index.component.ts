/**
 * Created by 李 on 2017/3/27.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../service/project.service";

@Component({
  moduleId: module.id,
  selector: 'project-index',
  templateUrl: 'project-index.component.html'
})
export class ProjectIndexComponent implements OnInit {
  projectName:string
  params:string
  constructor(private route:ActivatedRoute,
              private projectService:ProjectService
  ) {
  }

  ngOnInit() {
    this.getProjectInfo()
    this.setMainHeight()

  }

  getProjectInfo = () => {
    this.route.params.subscribe((data: any) => {
      let project_id = data.id
      if (project_id !== this.params) {
        this.params = project_id
        this.projectService.getProjectInfo(project_id)
          .subscribe(data => {
            console.log(data)
            this.projectName = data.datas.projectName
          })
      }
    })
  }

  //动态设置右侧Main的高度
  setMainHeight = () => {
    let main = document.getElementById('task-wrap');
    let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;    //获取宽度
    main.style.height = clientHeight - 80 + 'px';
  }
}
