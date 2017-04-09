import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const GroupChatsModel = sequelize.define("t_group_chats", {
    chat_id: {                             //主键消息id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    source_user_id: {                            //发送人的id
        type: Sequelize.STRING,
        allowNull: false
    },
    chat_content: {                           //聊天内容
        type: Sequelize.TEXT,
        allowNull: false
    },
    team_id: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// GroupChatsModel.sync()           //写入
export default GroupChatsModel;
