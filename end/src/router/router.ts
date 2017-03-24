
/*
  路由 接口地址
*/
import * as Router from "koa-router";
import User from "../controller/c_user";
import Email from "../controller/c_email"
import Team from "../controller/c_team"
import Project from '../controller/c_project';
const router = new Router();
router.get("/api/email",Email.getEamilCode)     //发送验证码

router.post("/api/user/register",User.register)    //注册

router.post("/api/user/login",User.login)      //登录

router.get("/api/user",User.getUserInfo)      //获取单个用户的信息

router.post("/api/user",User.getSomeUsersInfo)     //获取多个用户信息

router.put("/api/user/uploadImg",User.uploadHeaderImg)        //修改头像

router.put("/api/user/updateInfo",User.updateUserInfo)          //更新用户信息

router.put("/api/user/modifyPass",User.modifyPass)           //更新密码

router.get("/api/team/member",Team.getAllTeamMember)          //获取团队的成员

router.post("/api/team",Team.createTeam)                      //创建团队

router.get("/api/team",Team.getTeamByUser)                    //获取用户所在团队

router.post("/api/project",Project.createProject)             //创建项目
export default router;