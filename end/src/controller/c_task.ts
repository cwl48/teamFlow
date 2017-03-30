const uuidV1 = require('uuid/v1')
import * as Koa from 'koa'
import TaskModel from '../model/m_task';
import UserTaskModel from '../model/m_user_task';
import UserModel from '../model/m_user';
import User from './c_user';
import ProjectModel from '../model/m_project';
import TeamUserModel from '../model/m_team_user';
export default class Task {
    //创建任务
    static createTask = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let handle_user_id = ctx.request.body.handle_user_id || ""
        let task_content = ctx.request.body.task_content
        let project_id = ctx.request.body.project_id
        let type = ctx.request.body.type || ""
        let type_project = ctx.request.body.type_project || ""
        let lastOrder: number = ctx.request.body.lastOrder
        //当type为不为" "时，说明是个人中创建的任务
        if (type !== "") {
            //判断用户该type下是否已经有任务
            let user: any = await UserModel.findOne({
                include: [
                    {
                        model: TaskModel,
                        where: {
                            type: type
                        },

                    }
                ],
                where: {
                    user_id: user_id,
                }
            })
            let task: any
            // 没有任务的话，直接添加
            if (user === null) {
                task = await TaskModel.create({
                    task_id: uuidV1(),
                    user_id: user_id,
                    task_content: task_content,
                    project_id: project_id,
                    type: type,
                })
            } else {
                //给前端发来的order+3000赋值给此任务
                task = await TaskModel.create({
                    task_id: uuidV1(),
                    user_id: user_id,
                    task_content: task_content,
                    project_id: project_id,
                    type: type,
                    order: lastOrder + 65536
                })
            }

            //然后把该任务加入task_user表
            await UserTaskModel.create({
                user_id: handle_user_id,
                task_id: task.task_id
            })

            ctx.body = {
                success: true,
                msg: '创建成功',
                datas: task
            }

        } else {
            ctx.body = {
                success: false,
                msg: '错误'
            }
        }
    }

    //获取所有的一个用户所有的任务卡
    static getTaskByUser = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id

        try {
            let user: any = await UserModel.findOne({
                include: [{
                    model: TaskModel,
                    include: [{
                        model: ProjectModel
                    }],
                    where: {
                        status: 0
                    }
                }],
                where: {
                    user_id: user_id
                }
            })

            let obj: any = {
                tasks1: [],
                tasks2: [],
                tasks3: [],
                tasks4: []
            }
            user.t_tasks.forEach((task: any) => {
                switch (task.type) {
                    case "收件箱":
                        obj.tasks1.push(task)
                        break
                    case "今天":
                        obj.tasks2.push(task)
                        break
                    case "下一步":
                        obj.tasks3.push(task)
                        break
                    case "以后":
                        obj.tasks4.push(task)
                        break
                }
            })
            ctx.body = {
                success: true,
                msg: "查询成功",
                datas: obj
            }
        } catch (e) {
            throw new Error(e)
        }
    }
    //更新task排序(个人区域)
    static updateTaskOrder = async (ctx: Koa.Context, next: Function) => {
        let task_id = ctx.params.task_id
        let newOrder = ctx.request.body.newOrder
        let type = ctx.request.body.type || ""

        if (type === "") {
            //只更新排序
            let updateTask = await TaskModel.update({
                order: newOrder,
            },
                {
                    where: {
                        task_id: task_id
                    }
                })
            if (Array.isArray(updateTask)) {
                ctx.body = {
                    success: true,
                    msg: '更新成功',
                }
            }


        } else {
            let updateTask = await TaskModel.update({
                order: newOrder,
                type: type
            },
                {
                    where: {
                        task_id: task_id
                    }
                })
            if (Array.isArray(updateTask)) {
                ctx.body = {
                    success: true,
                    msg: '更新成功',
                }
            }
        }
    }

    //根据任务区域块获取任务
    static getTaskByType = async (ctx: Koa.Context, next: Function) => {
        let type = ctx.query.type
        let user_id = ctx.query.user_id

        let user: any = await UserModel.findOne({
            include: [{
                model: TaskModel,
                where: {
                    type: type,
                    status: 0
                },
                include: [{
                    model: ProjectModel
                }]
            }],
            where: {
                user_id: user_id
            }
        })
        let res: any[]
        if (user === null) {
            res = []
        } else {
            res = user.t_tasks
        }

        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: res
        }
    }

    //更新任务信息
    static updateTaskInfo = async (ctx: Koa.Context, next: Function) => {
        let task_id = ctx.request.body.task_id || ""
        let desc = ctx.request.body.desc || ''
        let task_content = ctx.request.body.task_content || ''
        let handle_user_id = ctx.request.body.handle_user_id || ""
        let user_id = ctx.request.body.user_id || ""
        let team_id = ctx.request.body.team_id || ""
        if (handle_user_id !== "") {
              //判断该用户是否是管理员以上权限
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
            } else {
            //更新handle_user_id
            await UserTaskModel.update({
                user_id: handle_user_id
            }, {
                    where: {
                        task_id: task_id
                    }
                })
            ctx.body = {
                success: true,
                msg: '更新成功'
            }}
        } else {
                await TaskModel.update({
                    desc: desc,
                    task_content: task_content
                }, {
                        where: {
                            task_id: task_id
                        }
                    })
                ctx.body = {
                    success: true,
                    msg: '更新成功'
                }
            }
        
    }
    //对一个任务的完成情况进行更新
    static updateTaskStatus = async (ctx: Koa.Context, next: Function) => {
        let task_id = ctx.params.task_id
        let status = ctx.request.body.status

        try {
            let update = await TaskModel.update({
                status: status
            }, {
                    where: {
                        task_id: task_id
                    }
                })
            ctx.body = {
                success: true,
                msg: "更新成功",
                datas: update
            }
        } catch (e) {
            throw new Error(e)
        }
    }
}