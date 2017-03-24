import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';
import UserModel from "./m_user";
const TeamUserModel = sequelize.define('team_user', {
    id: {                       //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    team_id: {                          //团队id
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {                           //用户id
        type: Sequelize.STRING,
        allowNull: false
    },
    auth:{
        type: Sequelize.INTEGER,            //用户权限       0.普通员工权限 1.经理权限 100.创建人权限
        defaultValue: 0
    }
});

// TeamUserModel.sync()           //写入
TeamUserModel.belongsTo(UserModel,{foreignKey:'user_id'})
export default TeamUserModel;
