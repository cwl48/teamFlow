/**
 * Created by 李 on 2017/3/20.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'my-select',
  templateUrl: 'my-select.component.html'
})
export class MySelectComponent implements OnInit {

  open:boolean
  @Input() place:string = ''
  @Input() datalist:string[]
  @Input() selName:string = ''
  @Input()
  set _open(open:boolean){
     if(!open){
       this.open = open
     }
  }
  @Output() change = new EventEmitter<boolean>()
  @Output() _selName = new EventEmitter<string>()
  constructor() {
  }

  ngOnInit() {
  }
  stopBuble = (e) => {
    if (e.stopPropagation) { //W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; //IE阻止冒泡方法
    }
  }
  toggleSelect = (e) => {
    this.stopBuble(e)
    this.open ? this.open = false : this.open = true
    if(this.open){
      this._openChange()
    }
  }

  _openChange=()=>{
    this.change.emit(true)
  }

  selectOne=(item)=>{
    this.selName = item
    this._selName.emit(item)
  }
}
