/**
 * Created by 李 on 2017/3/25.
 */
import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TeamService} from "../../service/team.service";

@Component({
    selector: 'team-index',
    templateUrl: 'team-index.component.html'
})
export class TeamIndexComponent implements OnInit {

    teamName:string
    params:string = ''
    constructor(private teamService:TeamService,
                private route:ActivatedRoute
    ) { }

    ngOnInit() {
      this.getTeamInfo()
    }

    getTeamInfo=()=>{
      this.route.params.
        subscribe((data:any)=>{
          let team_id = data.id
          if(team_id!==this.params){
            this.params = team_id
            this.teamService.getTeamInfo(team_id)
              .subscribe(data=>{
                this.teamName = data.datas.teamName
              })
          }
      })
    }
}
