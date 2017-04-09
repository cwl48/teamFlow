/**
 * Created by 李 on 2017/3/31.
 */
import {Injectable} from '@angular/core';
import {config} from "../app.config";
import {Http, Response} from "@angular/http";

const host = config.host
@Injectable()
export class ChatsService {

  emojiUrl: string = `${host}/api/emoji`
  groupChatsUrl: string = `${host}/api/chats/group`
  personChatsUrl: string = `${host}/api/chats/person`

  constructor(private http: Http) {
  }

  getAllEmoji = () => {
    return this.http.get(this.emojiUrl)
      .map(this.send)
  }

  //获取团队中的消息
  getTeamChats = (team_id, offsetPage) => {
    return this.http.get(`${this.groupChatsUrl}?team_id=${team_id}&offsetPage=${offsetPage}`)
      .map(this.send)
  }

  //获取用户间的消息
  getUsersChats = (obj) => {
    return this.http.get(`${this.personChatsUrl}?user_id=${obj.user_id}&target_user_id=${obj.target_user_id}&offsetPage=${obj.offsetPage}`)
      .map(this.send)
  }

  send = (res: Response) => {
    return res.json()
  }

}
