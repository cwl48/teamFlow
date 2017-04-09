
const uuidV1 = require('uuid/v1')
import * as Koa from 'koa'
import TaskModel from '../model/m_task';
import UserTaskModel from '../model/m_user_task';
import UserModel from '../model/m_user';
import User from './c_user';
import ProjectModel from '../model/m_project';
import TeamUserModel from '../model/m_team_user';
import TaskMsgsModel from '../model/m_task_msg';
import * as moment from 'moment';
import TeamModel from '../model/m_team';
import EmailModel from '../model/m_email';
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
                    type_project: "收件箱"
                })
            } else {
                //给前端发来的order+65536赋值给此任务
                task = await TaskModel.create({
                    task_id: uuidV1(),
                    user_id: user_id,
                    task_content: task_content,
                    project_id: project_id,
                    type: type,
                    order: lastOrder + 65536,
                    type_project: "收件箱"
                })
            }

            //创建任务进入动态
            await TaskMsgsModel.create({
                user_id: user_id,
                task_id: task.task_id,
                message: "创建了任务"
            })

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

        }
        //给项目创建任务
        if (type_project !== "") {
            //查找该类型下是否有任务
            let isHasTask = await TaskModel.findOne({
                where: {
                    type_project: type_project,
                    project_id: project_id
                }
            })
            let task: any
            // 没有任务的话，直接添加
            if (isHasTask === null) {
                task = await TaskModel.create({
                    task_id: uuidV1(),
                    user_id: user_id,
                    task_content: task_content,
                    project_id: project_id,
                    type_project: type_project,
                    type: "收件箱"
                })
            } else {
                //给前端发来的order+65536赋值给此任务
                task = await TaskModel.create({
                    task_id: uuidV1(),
                    user_id: user_id,
                    task_content: task_content,
                    project_id: project_id,
                    order: lastOrder + 65536,
                    type_project: type_project,
                    type: "收件箱"
                })
            }

            //创建任务进入动态
            await TaskMsgsModel.create({
                user_id: user_id,
                task_id: task.task_id,
                message: "创建了任务"
            })
            //然后把该任务加入task_user表
            await UserTaskModel.create({
                user_id: handle_user_id,
                task_id: task.task_id
            })

            ctx.body = {
                success: true,
                msg: "创建成功",
                datas: task
            }
        }
    }

    //获取用户所有的任务卡
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

            if (user === null) {
                ctx.body = {
                    success: true,
                    msg: "查询成功",
                    datas: obj
                }
            }
            else {
                for (let task of user.t_tasks) {
                    let user: any = await UserModel.findOne({
                        where: {
                            user_id: task.user_id
                        }, attributes: ["username"]
                    })
                    task = JSON.parse(JSON.stringify(task))
                    Object.assign(task, {
                        username: user.username,
                        created_at: moment(task.createdAt).format("MM-DD HH:mm")
                    })
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
                }
                ctx.body = {
                    success: true,
                    msg: "查询成功",
                    datas: obj
                }
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
        let type = ctx.query.type || ""
        let user_id = ctx.query.user_id || ""
        let project_id = ctx.query.project_id || ""
        let type_project = ctx.query.type_project || ""

        if (type !== "") {
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
            let res: any[] = []
            if (user === null) {
                res = []
            } else {
                for (let task of user.t_tasks) {
                    let user: any = await UserModel.findOne({
                        where: {
                            user_id: task.user_id
                        }, attributes: ["username"]
                    })
                    task = JSON.parse(JSON.stringify(task))
                    Object.assign(task, {
                        username: user.username,
                        created_at: moment(task.createdAt).format("MM-DD HH:mm")
                    })
                    res.push(task)
                }
            }
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: res
            }
        }
        if (type_project !== "") {
            try {
                let tasks: any[] = await TaskModel.findAll({
                    where: {
                        project_id: project_id,
                        type_project: type_project
                    },
                    include: [
                        {
                            model: UserModel
                        },
                        {
                            model: ProjectModel
                        },
                    ]
                })
                let res: any[] = []
                if (tasks.length === 0) {
                    ctx.body = {
                        success: true,
                        msg: "查询成功",
                        datas: res
                    }
                }
                else {
                    for (let task of tasks) {
                        let user: any = await UserModel.findOne({
                            where: {
                                user_id: task.user_id
                            }, attributes: ["username"]
                        })
                        Object.assign(task, {
                            username: user.username,
                            created_at: moment(task.createdAt).format("MM-DD HH:mm")
                        })
                        task = JSON.parse(JSON.stringify(task))
                        res.push(task)
                    }
                    ctx.body = {
                        success: true,
                        msg: "查询成功",
                        datas: res
                    }
                }

            } catch (e) {
                throw new Error(e)
            }
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
            let auth: any = await TeamUserModel.findOne({
                include: [
                    {
                        model: UserModel
                    }
                ],
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

                //进入动态
                TaskMsgsModel.create({
                    user_id: handle_user_id,
                    task_id: task_id,
                    message: `${auth.user.username}分配给你了任务`
                })
                ctx.body = {
                    success: true,
                    msg: '更新成功'
                }
            }
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
        let user_id = ctx.request.body.user_id

        try {
            let update = await TaskModel.update({
                status: status
            }, {
                    where: {
                        task_id: task_id
                    }
                })
            if (status == 1) {
                //进入动态
                await TaskMsgsModel.create({
                    user_id: user_id,
                    task_id: task_id,
                    message: "完成了任务"
                })
            } else {
                //创建任务进入动态
                await TaskMsgsModel.create({
                    user_id: user_id,
                    task_id: task_id,
                    message: "撤销完成任务，任务继续"
                })
            }
            ctx.body = {
                success: true,
                msg: "更新成功"
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    //查看一个成员的任务动态 分页获取
    static getMsgOfTaskByUser = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id
        let offset = ctx.query.offset
        try {
            let count = await TaskMsgsModel.count({
                where: {
                    user_id: user_id
                }
            })
            let tasks: any[] = await TaskMsgsModel.findAll({
                include: [
                    {
                        model: TaskModel,
                        include: [{
                            model: ProjectModel
                        }]
                    }, {
                        model: UserModel,
                        attributes: ["username"]
                    }
                ],
                where: {
                    user_id: user_id
                },
                limit: 10,
                offset: (offset - 1) * 10,
                order: "createdAt DESC"
            })
            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = JSON.parse(JSON.stringify(tasks[i]))
                Object.assign(tasks[i], { created_at: moment(tasks[i].createdAt).format("MM-DD HH:mm") })
            }
            ctx.body = {
                success: true,
                msg: "查询成功",
                datas: tasks,
                count: count
            }

        } catch (e) {
            throw new Error(e)
        }
    }
    //获取一个项目中所有的任务
    static getAllTaskByProject = async (ctx: Koa.Context, next: Function) => {
        let project_id = ctx.query.project_id

        try {
            let tasks: any[] = await TaskModel.findAll({
                where: {
                    project_id: project_id
                },
                include: [
                    {
                        model: UserModel
                    },
                    {
                        model: ProjectModel
                    },
                ]
            })
            let obj: any = {
                tasks1: [],
                tasks2: [],
                tasks3: [],
                tasks4: [],
                tasks5: []
            }

            if (tasks.length === 0) {
                ctx.body = {
                    success: true,
                    msg: "查询成功",
                    datas: obj
                }
            }
            else {
                for (let task of tasks) {

                    let user: any = await UserModel.findOne({
                        where: {
                            user_id: task.user_id
                        }, attributes: ["username"]
                    })
                    Object.assign(task, {
                        username: user.username,
                        created_at: moment(task.createdAt).format("MM-DD HH:mm")
                    })


                    task = JSON.parse(JSON.stringify(task))

                    switch (task.type_project) {
                        case "收件箱":
                            obj.tasks1.push(task)
                            break
                        case "开发中":
                            obj.tasks2.push(task)
                            break
                        case "待测试":
                            obj.tasks3.push(task)
                            break
                        case "待发布":
                            obj.tasks4.push(task)
                            break
                        case "已发布":
                            obj.tasks5.push(task)
                            break
                    }
                }
                ctx.body = {
                    success: true,
                    msg: "查询成功",
                    datas: obj
                }
            }

        } catch (e) {
            throw new Error(e)
        }

    }

    // 从项目中更新任务的的排序
    static updateProjectOrder = async (ctx: Koa.Context, next: Function) => {
        let task_id = ctx.params.task_id
        let newOrder = ctx.request.body.newOrder
        let type = ctx.request.body.type_project || ""

        if (type === "") {
            //只更新排序
            let updateTask = await TaskModel.update({
                order_project: newOrder,
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
                order_project: newOrder,
                type_project: type
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

    //获取项目中未完成和完成的数量
    static getDoneOrNoDoneNum = async (ctx: Koa.Context, next: Function) => {
        let project_id = ctx.request.body.project_id
        //完成了的
        let doneNums = await TaskModel.count({
            where: {
                project_id: project_id,
                status: 1
            }
        })
        //未完成
        let noDoneNums = await TaskModel.count({
            where: {
                project_id: project_id,
                status: 0
            }
        })
        ctx.body = {
            success: true,
            msg: "查询成功",
            datas: {
                doneNums: doneNums,
                noDoneNums: noDoneNums
            }
        }
    }

    //获取项目中每一栏的详情
    static getTypesState = async (ctx: Koa.Context, next: Function) => {
        let project_id = ctx.request.body.project_id
        let types = ["收件箱", "开发中", "待测试", "待发布", "已发布"]

        let first = []
        let second = []
        let num
        for (let i = 0; i < types.length; i++) {
            num = await TaskModel.count({
                where: {
                    project_id: project_id,
                    type_project: types[i],
                    status: 0
                }
            })
            first.push(num)
        }
        for (let i = 0; i < types.length; i++) {
            num = await TaskModel.count({
                where: {
                    project_id: project_id,
                    type_project: types[i],
                    status: 1
                }
            })
            second.push(num)
        }
        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: {
                first: first,
                second: second
            }
        }

    }

    //获取项目中每个成员的任务完成信息
    static getMembersInfo = async (ctx: Koa.Context, next: Function) => {
        let project_id = ctx.request.body.project_id

        //获取该项目所在的团队
        let project: any = await ProjectModel.findOne({
            where: {
                project_id: project_id
            }, attributes: ["team_id"]
        })

        //查找团队中的所有成员
        let team: any = await TeamUserModel.findAll({
            where: {
                team_id: project.team_id
            }
        })
        let users = []
        for (let t of team) {
            users.push(t.user_id)
        }

        //然后查找各个成员的任务完成情况
        let arr = []
        for (let i of users) {
            let obj
            let noDonetasks: any = await TaskModel.count({
                where: {
                    status: 0
                },
                include: [{
                    model: UserModel,
                    where: {
                        user_id: i
                    }
                }]
            })

            let donetasks: any = await TaskModel.count({
                where: {
                    status: 1
                },
                include: [{
                    model: UserModel,
                    where: {
                        user_id: i
                    }
                }]
            })
            //查看成员的名字
            let user: any = await UserModel.findOne({
                where: {
                    user_id: i
                }
            })
            obj = {
                noDonetasksNum: noDonetasks,
                donetasksNum: donetasks,
                username: user.username
            }
            arr.push(obj)
        }
        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: arr
        }
    }

    //获取团队所有的项目的完成情况
    static getAllTeamProjectOfTask = async (ctx: Koa.Context, next: Function) => {
        let team_id = ctx.query.team_id

        //先获取团队中的项目
        let projects: any = await ProjectModel.findAll({
            where: {
                team_id: team_id
            }
        })
        let arr = []
        //对每个项目的任务进行统计
        for (let item of projects) {
            let doneNums = await TaskModel.count({
                where: {
                    status: 1,
                    project_id: item.project_id
                }
            })
            let noDoneNums = await TaskModel.count({
                where: {
                    status: 0,
                    project_id: item.project_id
                }
            })
            let obj = {
                projectName: item.projectName,
                doneNums: doneNums,
                noDoneNums: noDoneNums,
                project_id: item.project_id
            }
            arr.push(obj)
        }
        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: arr
        }
    }

    //获取团队中的成员的任务数统计
    static getAllMember = async (ctx: Koa.Context, next: Function) => {

        let team_id = ctx.query.team_id
        //查找团队中的所有成员
        let team: any = await TeamUserModel.findAll({
            where: {
                team_id: team_id
            }
        })
        let users = []
        for (let t of team) {
            users.push(t.user_id)
        }

        //然后查找各个成员的任务完成情况
        let arr = []
        for (let i of users) {
            let obj
            let noDonetasks: any = await TaskModel.count({
                where: {
                    status: 0
                },
                include: [{
                    model: UserModel,
                    where: {
                        user_id: i
                    }
                }]
            })

            let donetasks: any = await TaskModel.count({
                where: {
                    status: 1
                },
                include: [{
                    model: UserModel,
                    where: {
                        user_id: i
                    }
                }]
            })
            //查看成员的名字
            let user: any = await UserModel.findOne({
                include: [{
                    model: EmailModel
                }],
                where: {
                    user_id: i
                }
            })
            obj = {
                noDonetasksNum: noDonetasks,
                donetasksNum: donetasks,
                username: user.username,
            }
            arr.push(obj)
        }
        ctx.body = {
            success: true,
            msg: '查询成功',
            datas: arr
        }

    }

}