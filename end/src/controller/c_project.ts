import ProjectModel from '../model/m_project';
import * as Koa from 'koa';
const uuidV1 = require('uuid/v1')
export default class Project {

    //创建项目
    static createProject = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let team_id = ctx.request.body.team_id
        let projectName = ctx.request.body.projectName
        let projectInfo = ctx.request.body.projectInfo || ""

        try {
            let create = await ProjectModel.create({
                user_id: user_id,
                team_id: team_id,
                projectName: projectName,
                projectInfo: projectInfo,
                project_id: uuidV1()
            })
            ctx.body = {
                success:true,
                msg:'创建成功',
                datas:create
            }
        }catch(e){
            ctx.body = {
                success:false,
                msg:'服务器异常'
            }
            throw new Error(e)
        }
    }
}