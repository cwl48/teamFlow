import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const ProjectUserModel = sequelize.define("project_users", {
    id: {                       //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    user_id: {                          //消息通知谁
        type: Sequelize.STRING,
        allowNull: false
    },
     project_id: {                          //项目id
        type: Sequelize.STRING,
        allowNull: false
    }
});

// ProjectUserModel.sync()           //写入
export default ProjectUserModel;
