import ProjectModel from '../model/m_project';
import * as Koa from 'koa';
import TeamUserModel from '../model/m_team_user';
import TeamLogModel from '../model/m_team_log';
import Team from './c_team';
import ProjectUserModel from '../model/m_project_user';
import UserModel from '../model/m_user';
import TeamModel from '../model/m_team';
import TaskModel from '../model/m_task';
const uuidV1 = require('uuid/v1')
export default class Project {

    //创建项目
    static createProject = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let team_id = ctx.request.body.team_id
        let projectName = ctx.request.body.projectName
        let projectInfo = ctx.request.body.projectInfo || ""

        //判断用户的权限
        let userAuth = await TeamUserModel.findOne({
            where: {
                user_id: user_id,
                team_id: team_id,
                auth: {
                    $gte: 1
                }
            }
        })


        if (userAuth === null) {
            ctx.body = {
                success: false,
                msg: '您没有权限'
            }
        }
        else {
            try {
                let create: any = await ProjectModel.create({
                    user_id: user_id,
                    team_id: team_id,
                    projectName: projectName,
                    projectInfo: projectInfo,
                    project_id: uuidV1()
                })

                //把该创建者加入项目-用户表
                await ProjectUserModel.create({
                    user_id: user_id,
                    project_id: create.project_id
                })

                //然后写入日志
                await TeamLogModel.create({
                    team_id: team_id,
                    user_id: user_id,
                    project_id: create.project_id,
                    message: `创建了一个项目 (${projectName})`,
                    type: '创建项目',
                    ip: await Team.getClientIp(ctx.req)
                })
                ctx.body = {
                    success: true,
                    msg: '创建成功',
                    datas: create
                }
            } catch (e) {
                ctx.body = {
                    success: false,
                    msg: '服务器异常'
                }
                throw new Error(e)
            }
        }

    }
    //获取一个用户所有的项目信息
    static getUserAllProjectInfo = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id


        try {
            //先查找该用户所在的团队
            let teams:any = await TeamUserModel.findAll({
                where: {
                    user_id: user_id
                }
            })
            let pros:any[] = []
            //查找团队里的所有项目
            for (let team of teams) {
                let projects: any = await ProjectModel.findAll({
                    include: [
                        {
                                model: TeamModel
                        }
                    ],
                    where: {
                        team_id:team.team_id
                    }
                })
                for(let i of projects){
                    pros.push(i)
                }
            }
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: pros
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    //获取一个项目信息
    static getProjectInfo = async (ctx: Koa.Context, next: Function) => {
        let project_id = ctx.query.project_id
        let project = await ProjectModel.findOne({
            where: {
                project_id: project_id
            }
        })
        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: project
        }
    }
}