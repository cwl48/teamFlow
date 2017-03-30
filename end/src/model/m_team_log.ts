import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';
import Team from '../controller/c_team';

const TeamLogModel = sequelize.define("team_log", {
    id: {                       //团队操作id
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    team_id: {                         //所属的团队
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {                          //操作人
        type: Sequelize.STRING,
        allowNull: false
    },
    project_id: {                      //被操作的项目
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {                           //日志文本
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,       // 日志类型
        allowNull: false
    },
    handled_user_id: {                   //被操作的用户
        type: Sequelize.STRING,
        defaultValue: ""
    },
    ip: {
        type: Sequelize.STRING,       // ip地址
        allowNull: false
    }
});

// TeamLogModel.sync()           //写入

export default TeamLogModel;
