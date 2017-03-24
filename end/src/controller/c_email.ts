import * as nodemailer from "nodemailer"
import * as Koa from 'koa';
import EmailModel from "./../model/m_email"
const uuidV1 = require('uuid/v1')
export default class Email {

    //获取邮箱验证码
    static getEamilCode = async (ctx: Koa.Context, next: Function) => {
        let email = ctx.query.email

        /*  
            判断邮箱是否已注册
            邮箱新注册 发送验证码 
        */
        if (await Email.checkEmailIsNotActive(email)) {

            //判断邮箱是否存在数据库中，但未激活
            let _email = await EmailModel.findAll({
                where: {
                    email: email,
                    isActive:0
                }
            })
            //五位随机数字
            let code: string = ''
            for (let i = 0; i < 5; i++) {
                code += Math.floor(Math.random() * 10).toString()
            }

            let content: string = `
            <center style="color:#B0E2FF;font-size:18px">欢迎来到teamFlow</center>
            <center>您的验证码为${code}</center>
            `
            if (_email.length > 0) {
                //邮箱已存在，更新验证码
                let updateCode = await EmailModel.update({
                    code: code
                }, {
                        where: {
                            email: email
                        }
                    })
                if (updateCode !== null) {
                    ctx.body = {
                        success: true,
                        msg: '发送验证码成功'
                    }
                }
            } else {
                //code验证码跟随邮箱存入数据库
                let createCode = await EmailModel.create({
                    email_id: uuidV1(),
                    email: email,
                    code: code
                })
                if (createCode !== null) {
                    ctx.body = {
                        success: true,
                        msg: '发送验证码成功'
                    }
                }
            }
            Email.sendEmail(email, content)
        } else {
            //已注册，换邮箱
            ctx.body = {
                success: false,
                msg: '邮箱已注册'
            }
        }
    }
    //发送邮件
    static sendEmail = (emailTo: string, content: string) => {

        // 开启一个 SMTP 连接池
        let smtpTransport = nodemailer.createTransport({
            service: "qq",
            secureConnection: true, // 使用 SSL
            auth: {
                user: "1159849884@qq.com", // 账号
                pass: "fsltagpedjchbabc" // 密码
            }
        });
        // 设置邮件内容
        let mailOptions = {
            from: "teamFlow 邮件👻<1159849884@qq.com>", // 发件地址
            to: emailTo, // 收件列表
            subject: "teamFlow邮件", // 标题
            html: content // html 内容
        }
        // 发送邮件
        smtpTransport.sendMail(mailOptions, function (error: any, response: any) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
            smtpTransport.close(); // 如果没用，关闭连接池
        });

    }

    //判断邮箱是否已注册
    static checkEmailIsNotActive = async (email: string) => {
        let emailIsActive = await EmailModel.findOne({
            where: {
                email: email,
                isActive: 1
            }
        })
        if (emailIsActive !== null) {
            return false
        } else {
            return true
        }
    }

}