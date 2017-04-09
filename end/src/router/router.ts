
/*
  路由 接口地址
*/
import * as Router from "koa-router";
import User from "../controller/c_user";
import Email from "../controller/c_email"
import Team from '../controller/c_team';
import Project from '../controller/c_project';
import Task from '../controller/c_task';
import { getEmoji } from '../config/emoji';
import Chat from '../controller/c_chat';
import Visit from '../controller/c_visit';
const router = new Router();
router.get("/api/email", Email.getEamilCode)     //发送验证码

router.post("/api/user/register", User.register)    //注册

router.post("/api/user/login", User.login)      //登录

router.get("/api/user", User.getUserInfo)      //获取单个用户的信息

router.post("/api/user", User.getSomeUsersInfo)     //获取多个用户信息

router.put("/api/user/uploadImg", User.uploadHeaderImg)        //修改头像

router.put("/api/user/updateInfo", User.updateUserInfo)          //更新用户信息

router.put("/api/user/modifyPass", User.modifyPass)           //更新密码

router.get("/api/team/member", Team.getAllTeamMember)          //获取团队的成员

router.post("/api/team", Team.createTeam)                      //创建团队

router.get("/api/team", Team.getTeamInfoByTeamIdApi)   //获取团队信息                              //获取单个团队的信息

router.put("/api/team/:teamId", Team.modifyTeamInfo)           //更新团队信息

router.put("/api/ateam/userAuth", Team.modifyUserAuth)           //修改团队中人员的权限

router.get("/api/team/log", Team.getTeamLog)                   //获取团队日志

router.delete("/api/team", Team.destroyTeam)                  //解散团队

router.get("/api/team/byuser", Team.getTeamByUser)                    //获取用户所在团队

router.post("/api/project", Project.createProject)             //创建项目

router.get("/api/user/allProject", Project.getUserAllProjectInfo)  //获取用户所有的项目信息

router.get("/api/project", Project.getProjectInfo)                  //获取项目信息

router.post("/api/task", Task.createTask)                          //创建任务

router.get("/api/task", Task.getTaskByUser)                        //根据用户获取任务

router.get("/api/task/byproject", Task.getAllTaskByProject)          //根据项目获取项目

router.put("/api/task/:task_id", Task.updateTaskOrder)             //更新任务排序(个人)

router.put("/api/task/byProject/:task_id",Task.updateProjectOrder)       //更新任务排序(项目)

router.get("/api/task/bytype", Task.getTaskByType)                 //根据任务类型获取

router.post("/api/task/update", Task.updateTaskInfo)               //更新任务信息

router.put("/api/task/status/update/:task_id", Task.updateTaskStatus)     //更新任务的状态

router.get("/api/task/msg/byuser", Task.getMsgOfTaskByUser)          //获取一个用户的全部任务动态

router.post("/api/task/state/tubiao1",Task.getDoneOrNoDoneNum)         //获取未完成和完成的的数量

router.post("/api/task/state/tubiao2",Task.getTypesState)          //获取类型相关的任务完成情况

router.get("/api/task/team/state",Task.getAllMember)               //获取团队所有的成员任务完成情况，通过团队

router.post("/api/task/state/tubiao3",Task.getMembersInfo)          //获取团队成员的完成情况图表形式，通过项目

router.get("/api/task/byTeam",Task.getAllTeamProjectOfTask)       //获取团队中所有项目中的信息

router.get("/api/emoji", getEmoji)                                //获取所有的emoji表情

router.get("/api/chats/group", Chat.getMessageByTeam)              //获取团队中的聊天消息

router.get("/api/chats/person", Chat.getChatsByTwoUsers)         //获取用户间的聊天信息

router.post("/api/visite",Visit.visiteOne)
export default router;