
import OnlineUserModel from '../model/m_online'
export default class OnlineUser {

    //创建一条登录信息，存在则或者更新
    static updateOrCreate = async (user: any) => {
        await OnlineUserModel.upsert({
            user_id: user.user_id,
            socket_id: user.socket_id
        })
    }
    //删除一个用户的登录信息
    static deleteOneOnlineUser = async (socket_id: string) => {
        await OnlineUserModel.destroy({
            where: {
                socket_id: socket_id
            }
        })
    }
    //判断用户是否在线
    static userIsOnline = async (user_id: string) => {
        let isOnline = await OnlineUserModel.findOne({
            where: {
                user_id: user_id
            }
        })
        if (isOnline !== null) {
            return true
        } else {
            return false
        }
    }

    //查看某个登录用户的socket_id
    static getUserSocketId=async(user_id:string)=>{
       let user:any=  await OnlineUserModel.findOne({
            where:{
                user_id:user_id
            }
        })
         return user.socket_id
    }
}