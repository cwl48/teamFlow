
/*
  路由 接口地址
*/
import * as Router from "koa-router";
import User from "../controller/c_user";
import Email from "../controller/c_email"
import Team from '../controller/c_team';
import Project from '../controller/c_project';
import Task from '../controller/c_task';
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

router.get("/api/team",Team.getTeamInfoByTeamIdApi)   //获取团队信息                              //获取单个团队的信息

router.put("/api/team/:teamId",Team.modifyTeamInfo)           //更新团队信息

router.put("/api/ateam/userAuth",Team.modifyUserAuth)           //修改团队中人员的权限

router.get("/api/team/log",Team.getTeamLog)                   //获取团队日志

router.delete("/api/team",Team.destroyTeam)                  //解散团队

router.get("/api/team/byuser",Team.getTeamByUser)                    //获取用户所在团队

router.post("/api/project",Project.createProject)             //创建项目

router.get("/api/user/allProject",Project.getUserAllProjectInfo)  //获取用户所有的项目信息

router.get("/api/project",Project.getProjectInfo)                  //获取项目信息

router.post("/api/task",Task.createTask)                          //创建任务

router.get("/api/task",Task.getTaskByUser)                        //根据用户获取任务

router.put("/api/task/:task_id",Task.updateTaskOrder)             //更新任务排序

router.get("/api/task/bytype",Task.getTaskByType)                 //根据任务类型获取

router.post("/api/task/update",Task.updateTaskInfo)               //更新任务信息

router.put("/api/task/status/update/:task_id",Task.updateTaskStatus)                     //更新任务的状态
export default router;