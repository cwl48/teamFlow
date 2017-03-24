import * as Koa from 'koa'
import TeamModel from "../model/m_team"
import TeamUserModel from "../model/m_team_user"
import MessageModel from "../model/m_message"
import UserModel from "../model/m_user"
import Email from "../controller/c_email"
import VisitedModel from "../model/m_visited"
import EmailModel from "../model/m_email"
import { config } from "../config/common"
import * as _ from "lodash"
const uuidV1 = require('uuid/v1')
export default class Team {
    // 创建团队
    static createTeam = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let phone = ctx.request.body.phone
        let teamName = ctx.request.body.teamName
        let bussiness = ctx.request.body.bussiness
        let member_ids: string[] = ctx.request.body.member_ids        //已有团队中的成员
        let inviteEmails: string[] = ctx.request.body.inviteEmails
        //查询创建人信息
        let userInfo: any = await UserModel.findOne({
            where: {
                user_id: user_id
            }
        })
        let teamInfo: any
        /*
             1.创建团队 和用户是否邀请成功无关，直接创建
        */
        try {
            //创建团队
            teamInfo = await TeamModel.create({
                user_id: user_id,
                team_id: uuidV1(),
                teamName: teamName,
                belongs_phone: phone,
                bussiness: bussiness
            })
            //把创建人加入团队
            await TeamUserModel.create({
                user_id: user_id,
                team_id: teamInfo.team_id,
                auth: 100
            })
        } catch (e) {
            throw new Error(e)
        }

        // 2.邀请已有团队中的人员，直接加入
        try {
            //去除创建人id
            _.remove(member_ids, (id) => {
                return id === user_id
            })
            console.log(member_ids)
            member_ids.forEach(async (id) => {
                //记录消息
                await MessageModel.create({
                    message: `${userInfo.username}邀请您加入了团队${teamName},您可以前往团队页面查看详情`,
                    user_id: id,
                    type: '邀请信息',
                    message_id: uuidV1()
                })
                //成员加入团队
                await TeamUserModel.create({
                    user_id: id,
                    team_id: teamInfo.team_id
                })
            })
            /*
                3.其次是邀请邮箱，判断是否是已注册用户，是则写入一条邀请信息
                如果不是注册用户就发送邮件邀请注册
            */
            inviteEmails.forEach(async (email) => {
                //是注册用户
                if (await !Email.checkEmailIsNotActive(email)) {

                    //查找email对应的user_id
                    let userInfo: any = await UserModel.findOne({
                        include: [{
                            model: EmailModel,
                            attributes: ["email"],
                            where: {
                                email: email,
                                isActive: 1
                            }
                        }]
                    })
                    //添加邀请
                    await VisitedModel.create({
                        visit_user_id: user_id,
                        user_id: userInfo.user_id,
                        team_id: teamInfo.team_id
                    })

                } else {
                    // 发送邮件邀请
                    let content: string = `
                    <center style="color:#B0E2FF;font-size:18px">团队邀请信</center>
                    <center><span style="color:#fb9fad;margin-right:3px">${userInfo.username}</span>邀请您加入他的团队<span style="color:#fb9fad;margin-right:3px">${teamName}</span>,请点击下列的链接</center>
                    <center>${config.fronthost}/register?team_id=${teamInfo.team_id}</center>
                    `
                    Email.sendEmail(email, content)
                }
            })
            ctx.body = {
                success: true,
                msg: '创建团队成功',
                datas: teamInfo
            }

        } catch (e) {
            ctx.body = {
                success: false,
                msg: '服务器异常'
            }
            throw new Error(e)
        }
    }

    //获取自己所在团队的所有成员
    static getAllTeamMember = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id

        try {
            //先查找自己所在的所有团队
            let teams: any[] = await TeamUserModel.findAll({
                where: {
                    user_id: user_id
                }, attributes: ["team_id"]
            })
            //然后查找团队中所有的成员
            let users: any[] = []

            for (let team of teams) {
                let user: any = await TeamUserModel.findAll({
                    include: [{
                        model: UserModel,
                        attributes: ["imgurl", "username"]
                    }],
                    where: {
                        team_id: team.team_id
                    }
                })

                user.forEach((u: any) => {
                    users.push(u)
                })
            }
            //去除创建人id
            _.remove(users, (user) => {
                return user.user_id === user_id
            })
            ctx.body = {
                success: true,
                mag: "查询成功",
                datas: users
            }
        } catch (e) {
            ctx.body = {
                success: false,
                msg: "服务器异常"
            }
            throw new Error(e)
        }
    }
    //查找用户所在的团队
    static getTeamByUser = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id
        try {
            //先查找自己所在的所有团队
            let teams: any[] = await TeamUserModel.findAll({
                where: {
                    user_id: user_id
                }, attributes: ["team_id", "teamName"]
            })
            ctx.body = {
                success:true,
                msg:'查询成功',
                datas:teams
            }
        } catch (e) {
            ctx.body = {
                success:false,
                msg:'查询出现异常'
            }
            throw new Error(e)
        }
    }

}