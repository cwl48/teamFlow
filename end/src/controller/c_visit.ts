import { config } from './../config/common';
import * as Koa from 'koa';
import VisitedModel from '../model/m_visited';
import TeamModel from '../model/m_team';
import EmailModel from '../model/m_email';
import TeamUserModel from '../model/m_team_user';
import Email from './c_email';
import UserModel from '../model/m_user';


export default class Visit {

    static visiteOne = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let email = ctx.request.body.email
        let team_id = ctx.request.body.team_id

        //查询创建人信息
        let userInfo: any = await UserModel.findOne({
            where: {
                user_id: user_id
            }
        })
        let team: any = await TeamModel.findOne({
            where: {
                team_id: team_id
            }
        })
        //是否注册
        // 没注册则发送邮件去邮箱邀请注册
        if (!Email.checkEmailIsNotActive(email)) {
            // 发送邮件邀请
            let content: string = `
                    <center style="color:#B0E2FF;font-size:18px">团队邀请信</center>
                    <center><span style="color:#fb9fad;margin-right:3px">${userInfo.username}</span>邀请您加入他的团队<span style="color:#fb9fad;margin-right:3px">${team.teamName}</span>,请点击下列的链接</center>
                    <center>${config.fronthost}/register?team_id=${team_id}</center>
                    `
            Email.sendEmail(email, content)
        } else {
            //先判断团队中是否有这个email

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
            let user = await TeamUserModel.findOne({
                where: {
                    team_id: team_id,
                    user_id: userInfo.user_id
                }
            })


            if (user === null) {
                let visit = await VisitedModel.create({
                    team_id: team_id,
                    visit_user_id: userInfo.user_id,
                    user_id: user_id
                })
                ctx.body = {
                    success: true,
                    msg: '邀请信息已发出',
                    datas: visit
                }
            } else {
                ctx.body = {
                    success: false,
                    msg: '该邮箱对应的账号已经是团队中的成员'
                }
            }
        }
    }
}