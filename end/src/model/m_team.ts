import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const TeamModel = sequelize.define('team', {
    team_id: {                       //主键团队id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    teamName: {                          //团队名
        type: Sequelize.STRING,
        allowNull: false
    },
    belongs_phone: {                           //从属人电话
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,       //创建人
        allowNull: false
    },
    bussiness: {
        type: Sequelize.STRING,       //   行业名
        allowNull: false
    },
    status: {                         //团队状态  1.正常  0.解散
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
    }

});

// TeamModel.sync()           //写入
export default TeamModel;
