import GroupChatsModel from '../model/m_group_chat';
import * as Koa from 'koa';
import UserModel from '../model/m_user';
import User from './c_user';
import * as moment from 'moment';
import PersonChatsModel from '../model/m_person_chat';
const uuidV1 = require('uuid/v1')
export default class Chat {

    //保存发送到团队里的消息
    static sendChatToTeam = async (chat: any) => {
        await GroupChatsModel.create({
            source_user_id: chat.user_id,
            team_id: chat.team_id,
            chat_content: chat.chat_content,
            chat_id: uuidV1()
        })
    }
    //保存发送给用户的消息
    static sendChatToPerson = async (chat: any) => {
        await PersonChatsModel.create({
            source_user_id: chat.user_id,
            target_user_id: chat.target_user_id,
            chat_content: chat.chat_content,
            chat_id: uuidV1()
        })
    }

    //获取team房间中的消息
    static getMessageByTeam = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.query.team_id
        let offset = ctx.query.offsetPage

        let count = await GroupChatsModel.count({
            where: {
                team_id: team_id
            }
        })
        let chats: any[] = await GroupChatsModel.findAll({
            where: {
                team_id: team_id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ["username", "imgurl"]
                }
            ],
            limit: 8,
            offset: (offset - 1) * 8,
            order: "createdAt DESC"
        })
        let arr: any[] = []
        chats.forEach((chat) => {
            let obj = {
                username: chat.user.username,
                imgurl: chat.user.imgurl,
                user_id: chat.source_user_id,
                chat_content: chat.chat_content,
                created_at: moment(chat.createdAt).format("MM-DD HH:mm")
            }
            arr.push(obj)
        })

        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: arr,
            count: count
        }
    }
    //获取用户之间的消息
    static getChatsByTwoUsers = async (ctx: Koa.Context, next: Function) => {
        let source_user_id = ctx.query.user_id
        let target_user_id = ctx.query.target_user_id
        let offsetPage = ctx.query.offsetPage

        //获取消息总数
        let count = await PersonChatsModel.count({
            where: {
                $or: [
                    {
                        source_user_id: source_user_id,
                        target_user_id: target_user_id
                    },
                    {
                        source_user_id: target_user_id,
                        target_user_id: source_user_id
                    }
                ]

            }
        })

        let chats: any[] = await PersonChatsModel.findAll({
            where: {
                $or: [
                    {
                        source_user_id: source_user_id,
                        target_user_id: target_user_id
                    },
                    {
                        source_user_id: target_user_id,
                        target_user_id: source_user_id
                    }
                ]
            },
            include: [
                {
                    model: UserModel,
                    attributes: ["username", "imgurl"]
                }
            ],
            limit: 8,
            offset: (offsetPage - 1) * 8,
            order: "createdAt DESC"
        })

        let arr: any[] = []
        chats.forEach((chat) => {
            let obj = {
                username: chat.user.username,
                imgurl: chat.user.imgurl,
                user_id: chat.source_user_id,
                chat_content: chat.chat_content,
                created_at: moment(chat.createdAt).format("MM-DD HH:mm")
            }
            arr.push(obj)
        })

        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: arr,
            count: count
        }
    }
}