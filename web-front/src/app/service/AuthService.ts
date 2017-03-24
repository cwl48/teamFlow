/**
 * Created by 李 on 2017/3/18.
 */
import { Injectable } from '@angular/core';
import { CanActivate,Router }    from '@angular/router';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class AuthService implements CanActivate  {

  constructor(private route:Router) { }

  canActivate() {
    let session = window.sessionStorage;
    let token = session.getItem('token');
    if (token) {
      return true;
    }
    this.route.navigate(['/login']);
    return false;
  }
}
