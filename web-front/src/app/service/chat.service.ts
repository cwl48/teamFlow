/**
 * Created by 李 on 2017/3/31.
 */
import {Injectable} from '@angular/core';
import {config} from "../app.config";
import {Http,Response} from "@angular/http";

const host = config.host
@Injectable()
export class ChatsService {

  emojiUrl:string = `${host}/api/emoji`
  constructor(private http:Http) {
  }

  getAllEmoji=()=>{
    return this.http.get(this.emojiUrl)
      .map(this.send)
  }

  send=(res:Response)=>{
    return res.json()
  }

}
