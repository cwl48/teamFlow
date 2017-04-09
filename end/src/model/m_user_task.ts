import sequelize from '../config/db';
import * as Sequelize from 'sequelize';

const UserTaskModel = sequelize.define("t_user_task", {
    id: {                       //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    task_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// UserTaskModel.sync()           //写入
export default UserTaskModel;
