import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const MessageModel = sequelize.define("message", {
    message_id: {                       //主键消息id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    user_id: {                          //消息通知谁
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {                           //消息文本
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,       //   消息类型
        allowNull: false
    },
    status: {                         //消息状态  1.已查看  0.未查看
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
    }

});

// MessageModel.sync()           //写入
export default MessageModel;
