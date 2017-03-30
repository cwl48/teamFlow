import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const TaskModel = sequelize.define("t_tasks", {
    task_id: {                             //主键消息id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    user_id: {                            //创建人的id
        type: Sequelize.STRING,
        allowNull: false
    },
    task_content: {                           //任务文本
        type: Sequelize.TEXT,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    project_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {                               //从属于什么阶段 (对用户来说)
        type: Sequelize.STRING,
        allowNull: false
    },
    type_project: {                      //从属于什么阶段(对项目来说)
        type: Sequelize.STRING
    },
    order: {                            //任务在用户的任务列表里的排序
        type: Sequelize.FLOAT,
        defaultValue: 65536
    },
    order_project: {                    //任务在项目的任务列表里的排序
        type: Sequelize.FLOAT,
        defaultValue: 65536
    },
    status: {
        type: Sequelize.INTEGER,       //   是否完成  0.未完成 1.完成
        defaultValue: 0
    }
});

// TaskModel.sync()           //写入
export default TaskModel;
