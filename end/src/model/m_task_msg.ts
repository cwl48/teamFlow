import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const TaskMsgsModel = sequelize.define("t_task_msgs", {
      id: {                       //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    task_id: {                             //任务id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    user_id: {                            //创建人的id
        type: Sequelize.STRING,
        allowNull: false
    },
    message:{
         type: Sequelize.STRING,           //动态详情
        allowNull: false
    }
});

// TaskMsgsModel.sync()           //写入
export default TaskMsgsModel;
