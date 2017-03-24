import * as Koa from 'koa'
import EmailModel from "../model/m_email"
import UserModel from "../model/m_user"
import TeamUserModel from "../model/m_team_user"
import * as path from 'path'
import { config } from "../config/common";
import OnlineUser from "../controller/c_online"
const uuidV1 = require('uuid/v1')
const fsp = require('fs-promise');
const host = config.host
//用户操作类
export default class User {

    //注册账号
    static register = async (ctx: Koa.Context, next: Function) => {

        let email = ctx.request.body.email;
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        let code = ctx.request.body.code;
        let team_id = ctx.request.body.team_id || ""


        let findEmail: any = await EmailModel.findOne({
            where: {
                email: email,
                code: code,
                isActive: 0
            }
        })
        if (findEmail !== null) {
            //验证成功，注册用户信息
            try {
                let create: any = await UserModel.create({
                    user_id: uuidV1(),
                    username: username,
                    password: password,
                    code: code,
                    email_id: findEmail.email_id,
                    imgurl: `${host}/head_pic/header.jpg`
                })
                console.log(create)
                //更新email注册状态 为激活状态 禁止以后再次用此号注册
                try {
                    let update = await EmailModel.update({
                        isActive: 1
                    }, {
                            where: {
                                email_id: findEmail.email_id
                            }
                        })

                    //判断team_id是否为空，不为空则为用户邀请而进的,把用户加入该团队
                    if (team_id !== '') {
                        await TeamUserModel.create({
                            user_id: create.user_id,
                            team_id: team_id
                        })
                    }
                    ctx.body = {                //响应注册成功
                        success: true,
                        msg: "注册成功",
                        datas: create
                    }
                } catch (e) {
                    throw (e + "注册失败")
                }
            } catch (e) {
                throw (e + "注册失败")
            }

        } else {
            //验证错误
            ctx.body = {
                success: false,
                msg: "邮箱验证码错误或邮箱已被注册"
            }
        }
    }

    //登录
    static login = async (ctx: Koa.Context, next: Function) => {
        let email = ctx.request.body.email;
        let password = ctx.request.body.password;

        let findOne: any = await UserModel.findOne({
            include: [{
                model: EmailModel,
                attributes: ["email"],
                where: {
                    email: email,
                    isActive: 1
                }
            }],
            where: {
                password: password
            },
            attributes: ["username", "user_id", "imgurl", "job", "section", "phone"]
        })
        if (findOne !== null) {
            //判断是否在线
            // 已在线不允许再次进入
            if (await OnlineUser.userIsOnline(findOne.user_id)) {
                ctx.body = {
                    success: false,
                    msg: "该用户已在线"
                }
            } else {
                ctx.body = {
                    success: true,
                    msg: '登陆成功',
                    datas: findOne
                }
            }

        } else {
            ctx.body = {
                success: false,
                msg: '用户名密码错误或账号不存在'
            }
        }
    }

    //上传头像
    static uploadHeaderImg = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id;
        let imgData = ctx.request.body.imgData;

        //先判断文件夹是否存在
        console.log(path.join(__dirname, "..", "public/head_pic"))
        let exe = await fsp.exists(path.join(__dirname, "..", "..", "public/head_pic"))
        console.log(exe)
        if (exe) {
            await makeFile()
        }
        else {
            let err = await fsp.mkdir(path.join(__dirname, "..", "..", "public/head_pic"))
            if (!err) {
                await makeFile()
            }
        }

        //创建文件
        async function makeFile() {
            let date = new Date().getTime()
            let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');
            let filename = `${path.join(__dirname, "..", "..", "public/head_pic")}/${date}.png`;

            let err = await fsp.writeFile(filename, dataBuffer)
            if (!err) {
                //更新用户表的头像url
                let url = `${host}/head_pic/${date}.png`

                let update = await UserModel.update({
                    imgurl: url
                }, {
                        where: {
                            user_id: user_id
                        }
                    })
                if (update.length > 0) {
                    ctx.body = {
                        success: true,
                        msg: '上传头像成功',
                        datas: {
                            imgurl: url
                        }
                    }
                }
            }
        }
    }

    //修改信息 参数不定
    static updateUserInfo = async (ctx: Koa.Context, next: Function) => {

        let user_id = ctx.request.body.user_id
        let username = ctx.request.body.username || ""
        let job = ctx.request.body.job || ""
        let section = ctx.request.body.section || ""
        let phone = ctx.request.body.phone || ""
        console.log(phone)
        let updateObj = {}
        if (username !== "") {
            Object.assign(updateObj, { username: username })
        }

        if (job !== "" || section !== "" || phone !== "") {
            Object.assign(updateObj, { job: job, section: section, phone: phone })
        }

        let update = await UserModel.update(updateObj,
            {
                where: {
                    user_id: user_id
                }
            })
        if (update.length > 0) {
            ctx.body = {
                success: true,
                msg: '修改信息成功',
                datas: updateObj
            }
        } else {
            ctx.body = {
                success: false,
                msg: '修改信息失败',
            }
        }
    }

    //修改密码
    static modifyPass = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.request.body.user_id
        let oldPass = ctx.request.body.oldPass
        let newPass = ctx.request.body.newPass

        //判断原密码是否正确
        let passIsTrue = await UserModel.findOne({
            where: {
                user_id: user_id,
                password: oldPass
            }
        })
        if (passIsTrue !== null) {
            //更新密码
            let update = await UserModel.update({
                password: newPass
            }, {
                    where: {
                        user_id: user_id
                    }
                })
            if (update.length > 0) {
                ctx.body = {
                    success: true,
                    msg: '更新密码成功'
                }
            } else {
                ctx.body = {
                    success: false,
                    msg: "修改失败"
                }
            }
        } else {
            ctx.body = {
                success: false,
                msg: "原密码不正确"
            }
        }
    }

    //一次性查看多个用户信息
    static getSomeUsersInfo = async (ctx: Koa.Context, next: Function) => {
        let user_ids: string[] = ctx.request.body.user_ids
        try {
            let users: any[] = []
            user_ids.forEach(async (user_id) => {

                let user = UserModel.findOne({
                    where: {
                        user_id: user_id
                    }
                })
                users.push(user)
            })
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: users
            }
        } catch (e) {
            ctx.body = {
                success: false,
                msg: "服务器出错"
            }
            throw new Error(e)
        }
    }

    //查询个人信息
    static getUserInfo = async (ctx: Koa.Context, next: Function) => {
        let user_id = ctx.query.user_id

        try {
            let user = await UserModel.findOne({
                include: [
                    {
                        model: EmailModel,
                        attributes: ["email"]
                    }
                ],
                where: {
                    user_id: user_id
                }, attributes: ["job", "section", "phone", "imgurl", "username", "user_id"]
            })
            ctx.body = {
                success: true,
                msg: '查询成功',
                datas: user
            }
        } catch (e) {
            ctx.body = {
                success: false,
                mgs: '数据库查询异常'
            }
            throw new Error(e)
        }
    }

    //根据email获取个人信息
    static getUserInfoByEmail = async (email: string) => {
        return await UserModel.findOne({
            include: [
                {
                    model: EmailModel,
                    where: {
                        email: email
                    }
                }
            ]
        })
    }
}