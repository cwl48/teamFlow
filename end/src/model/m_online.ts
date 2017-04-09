import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const OnlineUserModel = sequelize.define('online_user', {
    user_id: {                         //在线人的id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    socket_id: {
        type: Sequelize.STRING,              //当前登录人的socket_id
        allowNull: false
    }
});

// OnlineUserModel.sync()           //写入
export default OnlineUserModel;
