/**
 * Created by 李 on 2017/3/20.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'my-select',
  templateUrl: 'my-select.component.html'
})
export class MySelectComponent implements OnInit {

  @Input() place:string = ''
  @Input() datalist:string[]
  @Input() open:boolean
  @Output() selItem = new EventEmitter<any>()

  selName:string = ''
  constructor() {
  }

  ngOnInit() {
  }
  selectOne=(item)=>{
    this.selName = item.name
    this.selItem.emit(item)
  }
}
