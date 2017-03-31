import { config } from './../config/common';
import * as Koa from 'koa'
import MessageModel from "../model/m_message"
import Email from "../controller/c_email"
import VisitedModel from "../model/m_visited"
import EmailModel from '../model/m_email';
import * as _ from "lodash"
import UserModel from '../model/m_user';
import TeamModel from '../model/m_team';
import TeamUserModel from '../model/m_team_user';
import * as path from "path"
import TeamLogModel from '../model/m_team_log';
import * as moment from "moment"
const fsp = require('fs-promise');
const host = config.host
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
                bussiness: bussiness,
                imgurl: `${host}/team_pic/team_default.png`
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
            throw new Error(e)
        }
    }

    //获取自己所在团队的所有成员
    static getAllTeamMember = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id

        try {
            //先查找自己所在的所有团队
            let user: any = await UserModel.findOne({
                include: [
                    {
                        model: TeamModel,
                        where: {
                            status: 1
                        }
                    }
                ],
                where: {
                    user_id: user_id
                }
            })
            //然后查找团队中所有的成员
            let arr: any[] = []
            let users: any[] = []
            user = JSON.parse(JSON.stringify(user))
            for (let team of user.teams) {
                let _team: any = await TeamModel.findOne({
                    include: [{
                        model: UserModel,
                        attributes: ["imgurl", "username", "user_id"]
                    }],
                    where: {
                        team_id: team.team_id,
                        status: 1
                    }
                })
                _team = JSON.parse(JSON.stringify(_team))

                _team.users.forEach((u: any) => {
                    if (_.indexOf(arr, u.user_id) === -1) {
                        arr.push(u.user_id)
                        users.push(u)
                    }
                })
            }

            _.remove(users, (user) => {
                return user.user_id === user_id
            })
            ctx.body = {
                success: true,
                mag: "查询成功",
                datas: users
            }
        } catch (e) {
            throw new Error(e)
        }
    }
    //查找用户所在的团队
    static getTeamByUser = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id
        try {
            let teamsObject = []

            //先查找自己所在的所有团队
            let user: any = await UserModel.findOne({
                include: [
                    {
                        model: TeamModel,
                        attributes: ["teamName", "imgurl", "team_id"],
                        where: {
                            status: 1
                        }
                    }
                ],
                where: {
                    user_id: user_id
                }
            })
            for (let team of user.teams || []) {
                //查找团队中的人数
                let users = await TeamUserModel.findAll({
                    where: {
                        team_id: team.team_id
                    }
                })
                user = JSON.parse(JSON.stringify(users))
                let _team = {
                    team_id: team.team_id,
                    teamName: team.teamName,
                    imgurl: team.imgurl,
                    memberNum: users.length
                }
                teamsObject.push(_team)
            }
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: teamsObject
            }
        } catch (e) {
            throw new Error(e)
        }
    }
    //获取一个team的信息
    //包括所有成员
    static getTeamInfoByTeamId = async (team_id: string) => {
        return await TeamModel.findOne({
            include: [
                {
                    model: UserModel,
                    include: [{
                        model: EmailModel,
                        attributes: ["email"]
                    }]
                }
            ],
            where: {
                team_id: team_id
            }
        })
    }

    static getTeamInfoByTeamIdApi = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.query.team_id
        try {
            let teamInfo = await Team.getTeamInfoByTeamId(team_id)
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: teamInfo
            }
        } catch (e) {
            throw new Error(e.stack)
        }
    }

    //修改团队信息
    static modifyTeamInfo = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.params.teamId
        let teamName = ctx.request.body.teamName
        let desc = ctx.request.body.desc || ""
        let belongs_phone = ctx.request.body.phone
        let bussiness = ctx.request.body.bussiness
        let imgData = ctx.request.body.imgData || ""
        let user_id = ctx.request.body.user_id

        //判断权限
        let auth = await TeamUserModel.findOne({
            where: {
                user_id: user_id,
                team_id: team_id,
                auth: {
                    $gte: 1
                }
            }
        })
        if (auth === null) {
            ctx.body = {
                success: false,
                msg: '您没有权限'
            }
        }
        else {
            //单独修改信息
            if (imgData === "") {
                try {
                    let updateInfo = await TeamModel.update({
                        teamName: teamName,
                        desc: desc,
                        belongs_phone: belongs_phone,
                        bussiness: bussiness
                    }, {
                            where: {
                                team_id: team_id
                            }
                        })
                    ctx.body = {
                        success: true,
                        msg: "修改成功"
                    }
                } catch (e) {
                    throw new Error(e.stack)
                }
            } else {
                try {
                    //先判断文件夹是否存在
                    let exe = await fsp.exists(path.join(__dirname, "..", "..", "public/team_pic"))
                    if (exe) {
                        await makeFile()
                    }
                    else {
                        let err = await fsp.mkdir(path.join(__dirname, "..", "..", "public/team_pic"))
                        if (!err) {
                            await makeFile()
                        }
                    }

                    //创建文件
                    async function makeFile() {
                        let date = new Date().getTime()
                        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                        let dataBuffer = new Buffer(base64Data, 'base64');
                        let filename = `${path.join(__dirname, "..", "..", "public/team_pic")}/${date}.png`;

                        let err = await fsp.writeFile(filename, dataBuffer)
                        if (!err) {
                            //更新用户表的头像url
                            let url = `${host}/team_pic/${date}.png`
                            let update = await TeamModel.update({
                                imgurl: url
                            }, {
                                    where: {
                                        team_id: team_id
                                    }
                                })
                            if (update.length > 0) {
                                ctx.body = {
                                    success: true,
                                    msg: '上传Logo成功',
                                    datas: {
                                        imgurl: url
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {

                    throw new Error(e.stack)
                }
            }
        }
    }

    //解散团队
    static destroyTeam = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.query.teamId
        let user_id = ctx.query.userId

        try {


            //判断该用户是否是创建人
            let isCreateUser = await TeamUserModel.findOne({
                where: {
                    user_id: user_id,
                    team_id: team_id,
                    auth: 100
                }
            })
            if (isCreateUser === null) {
                ctx.body = {
                    success: false,
                    msg: "您没有该权限"
                }
            } else {
                //把该团队的status 置为0
                await TeamModel.update({
                    status: 0
                }, {
                        where: {
                            team_id: team_id
                        }
                    })
                ctx.body = {
                    success: true,
                    msg: '解散成功'
                }
            }
        } catch (e) {
            throw new Error(e.stack)
        }
    }

    //修改成员权限
    static modifyUserAuth = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let auth = ctx.request.body.auth
        let team_id = ctx.request.body.team_id
        let handle_user_id = ctx.request.body.handle_user_id

        try {
            //判断用户是否是创建人 只有创建人 才有修改权限
            let userAuth = await TeamUserModel.findOne({
                where: {
                    user_id: handle_user_id,
                    team_id: team_id,
                    auth: 100
                }
            })
        
            if (userAuth === null) {
                ctx.body = {
                    success: false,
                    msg: "您没有权限"
                }
            }
            else {
                try {
                    await TeamUserModel.update({
                        auth: auth
                    }, {
                            where: {
                                user_id: user_id,
                                team_id: team_id
                            }
                        })
                    ctx.body = {
                        success: true,
                        msg: '修改成功'
                    }
                } catch (e) {
                    throw new Error(e)
                }
            }
        } catch (e) {
            throw new Error(e)
        }

    }
    //获取客户端的ip地址
    static getClientIp = async (req: any) => {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
    }

    //获取team_log
    static getTeamLog = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.query.team_id

        try {
            let team_logs: any[] = await TeamLogModel.findAll({
                include: [
                    {
                        model: UserModel,
                        attributes: ['username']
                    }
                ],
                where: {
                    team_id: team_id
                }
            })

            for (let i = 0; i < team_logs.length; i++) {
                team_logs[i] = JSON.parse(JSON.stringify(team_logs[i]))
                Object.assign(team_logs[i], { created_at: moment(team_logs[i].createdAt).format("YYYY-MM-DD HH:mm:ss") })
            }
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: team_logs
            }
        } catch (e) {
            throw new Error(e)
        }
    }
}