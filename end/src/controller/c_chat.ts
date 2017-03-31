import GroupChatsModel from "../model/m_group_chat"
export default class Chat{
    
    //保存发送到团队里的消息
    static sendChatToTeam=async(chat:any)=>{
         await GroupChatsModel.create({
             source_user_id:chat.source_user_id,
             team_id:chat.team_id,
             chat_content:chat.chat_content
         })
    }
}