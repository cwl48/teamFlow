import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const VisitedModel = sequelize.define('visit', {
    id: {                       //邀请表id
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    visit_user_id: {                         //邀请人的id
        type: Sequelize.STRING,
        allowNull: false
    },
    team_id: {
        type: Sequelize.STRING,              //邀请进入的团队
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,             // 被邀请人user_id
        allowNull: false
    },
    visit_status: {                         //邀请状态   0.未处理 1.同意 2.拒绝
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
    }

});

// VisitedModel.sync()           //写入
export default VisitedModel;
