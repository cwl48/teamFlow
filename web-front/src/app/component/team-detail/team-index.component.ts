/**
 * Created by 李 on 2017/3/25.
 */
import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'team-index',
    templateUrl: 'team-index.component.html'
})
export class TeamIndexComponent implements OnInit {
    constructor(private route:ActivatedRoute) { }

    ngOnInit() {

    }
}
