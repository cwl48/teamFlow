import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const TaskActiveModel = sequelize.define("t_task_active", {
     id: {                                 //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    task_id: {                       
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id:{
         type: Sequelize.STRING,
         allowNull: false
    },
    target:{
        type: Sequelize.STRING,
        defaultValue:''
    },
    source:{
        type: Sequelize.STRING,
        defaultValue:''
    }

});

// TaskActiveModel.sync()           //写入
export default TaskActiveModel;
