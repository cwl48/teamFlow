import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';
import TeamUserModel from './m_team_user';
import UserModel from './m_user';
import EmailModel from './m_email';
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
    imgurl: {
        type: Sequelize.STRING,       //   团队图标
        allowNull: false
    },
    desc:{
        type: Sequelize.STRING,       //   团队描述
        defaultValue:''
    },
    status: {                         //团队状态  1.正常  0.解散
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }

 }
);
UserModel.belongsTo(EmailModel, {foreignKey: 'email_id' })
TeamUserModel.belongsTo(UserModel,{foreignKey:'user_id'})
TeamUserModel.belongsTo(TeamModel,{foreignKey:'team_id'})
TeamModel.belongsToMany(UserModel,{through:TeamUserModel,foreignKey:"team_id",otherKey:"user_id"})
UserModel.belongsToMany(TeamModel,{through:TeamUserModel,foreignKey:"user_id",otherKey:"team_id"})
// TeamModel.sync()           //写入
export default TeamModel;
