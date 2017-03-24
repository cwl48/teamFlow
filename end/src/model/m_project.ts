import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const  ProjectModel = sequelize.define('t_project', {
     project_id: {                       //主键项目id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    projectName: {                          //项目名
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {                           //从属人
        type: Sequelize.STRING,
        allowNull: false
    },
    projectInfo: {
        type: Sequelize.STRING,       // 项目信息
        defaultValue:""
    },
    status: {                         //项目状态  1.正在进行  0.完结
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
    }
});

ProjectModel.sync()           //写入
export default ProjectModel;
