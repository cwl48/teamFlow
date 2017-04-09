/**
 * Created by 李 on 2017/3/18.
 */
import {
  Component, OnInit, Input, OnChanges, trigger, state, transition, style, animate,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'top-tip',
  templateUrl: 'top-tip.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class TopTipComponent implements OnInit,OnChanges {

  @Input() show: boolean
  @Input() msg:string
  @Input() success:boolean
  state:string
  constructor() {
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges){
    if(this.show){
      setTimeout(()=>{
        this.show = false
        this.success = false
      },1200)
    }
  }
}
