import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const PersonChatsModel = sequelize.define("t_person_chats", {
    chat_id: {                             //主键消息id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    source_user_id: {                            //发送人的id
        type: Sequelize.STRING,
        allowNull: false
    },
    target_user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    chat_content: {                           //聊天内容
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// PersonChatsModel.sync()           //写入
export default PersonChatsModel;
