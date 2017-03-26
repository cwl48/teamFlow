import ProjectModel from '../model/m_project';
import * as Koa from 'koa';
import TeamUserModel from '../model/m_team_user';
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
        console.log(JSON.parse(JSON.stringify(userAuth)))

        if (userAuth === null) {
            ctx.body = {
                success: false,
                msg: '您没有权限'
            }
        }
        else {
            try {
                let create = await ProjectModel.create({
                    user_id: user_id,
                    team_id: team_id,
                    projectName: projectName,
                    projectInfo: projectInfo,
                    project_id: uuidV1()
                })

                //然后进入日志

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
}