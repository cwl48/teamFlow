/*
  socket处理类
*/
import OnlineUser from "../controller/c_online";
import Email from "../controller/c_email"
import User from "../controller/c_user"
import * as socket from 'socket.io';
import TeamModel from '../model/m_team';
import Team from '../controller/c_team';
import UserModel from '../model/m_user';
import GroupChatsModel from '../model/m_group_chat';
import Chat from '../controller/c_chat';
export default class MySocket {

    //处理socket
    static handle = (io: any, socket: any) => {
        socket.on("login", async (data: any) => {    //登录消息

            //记录登录人的信息
            let obj: any = {
                user_id: data.user_id,
                socket_id: socket.id
            }
            try {
                await OnlineUser.updateOrCreate(obj)
                //进入团队聊天room 获取自己所有的team 并加入
                let teams:any[] = await Team.getAllTeam(obj.user_id)
                teams.forEach(team=>{
                    socket.join(team.team_id)
                })
                
                // console.log("---------------------",socket.rooms)
            } catch (e) {
                throw new Error(e)
            }
        })

        /*
              断开监听
              置空当前的socket
          */
        socket.on("disconnect", async () => {
            console.log("断开")
            await OnlineUser.deleteOneOnlineUser(socket.id)
        })

        /*
            监听客户端通知(一些组件状态相关)

        */
        socket.on("notify_msg", async (data: any) => {
            switch (data.msg) {
                case "modify_user_imgurl":
                    socket.emit("notify_msg", "change user_img")
                    break;
                case "invite_into_team":
                    // 两种情况 1.根据member_ids 2.根据email
                    for (let id of data.member_ids) {
                        if (await OnlineUser.userIsOnline(id)) {
                            let socket_id = await OnlineUser.getUserSocketId(id)
                            socket.to(socket_id).emit("notify_msg", "has notify")
                        }
                    }
                    for (let email of data.inviteEmails) {
                        //查找email所对应的user_id
                        // 先判断用户是否注册
                        if (await !Email.checkEmailIsNotActive(email)) {
                            let user: any = await User.getUserInfoByEmail(email)
                            if (await OnlineUser.userIsOnline(user.user_id)) {
                                let socket_id = await OnlineUser.getUserSocketId(user.user_id)
                                socket.to(socket_id).emit("notify_msg", "has notify")
                            }
                        }
                    }
                    break;
                default:
                    socket.emit("msg_error", "unexpected msg")
            }
        })

        //更新任务所属人员
        socket.on("update_task_user",async (task:any)=>{
             let socket_id = await OnlineUser.getUserSocketId(task.user_id)
             socket.to(socket_id).emit("update_task_user",task)
        })


        /*
             团队邀请
             @ member_id  要通知的用户 
         */
        socket.on("client_notify_member_ids", (member_ids: Array<string>) => {
            member_ids.forEach(async (user_id) => {
                //判断用户是否在线
                //在线
                if (await OnlineUser.userIsOnline(user_id)) {
                    let socket_id = await OnlineUser.getUserSocketId(user_id)
            socket.to(socket_id).emit("server_notify_message", "has one notify")   //通知客户端有一条信息
                }
            })
        })

        //团队房间内接发消息
        socket.on("send_in_room",async(obj:any)=>{
            socket.emit("send_success","success")
            
            //消息存入数据库
            await Chat.sendChatToTeam(obj)
            let user:any = await UserModel.findOne({
                where:{
                    user_id:obj.user_id
                },attributes:["imgurl","username","user_id"]
            })
            let send = {
                 imgurl:user.imgurl,
                 username:user.username,
                 user_id:user.user_id
            }
            Object.assign(send,obj)
            socket.to(obj.team_id).emit("send_in_room",send)
        })
        //用户间接发消息
        socket.on("send_in_person",async(obj:any)=>{
            console.log(obj)
            socket.emit("send_success","success")   //通知前端消息发送成功
            await Chat.sendChatToPerson(obj)

            let user:any = await UserModel.findOne({
                where:{
                    user_id:obj.user_id
                },attributes:["imgurl","username","user_id"]
            })
            let send = {
                 imgurl:user.imgurl,
                 username:user.username,
                 user_id:user.user_id
            }
            Object.assign(send,obj)
            //获取target_user_id所对应的socket_id
            //先判断对方是否在线
            if(await OnlineUser.userIsOnline(obj.target_user_id)){
                let socket_id = await OnlineUser.getUserSocketId(obj.target_user_id)
                socket.to(socket_id).emit("send_in_person",send)
            }
        })
    }
}

