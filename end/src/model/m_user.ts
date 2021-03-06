import sequelize from '../config/db';
import * as Sequelize from 'sequelize';
import EmailModel from "./../model/m_email"
const UserModel = sequelize.define('user', {

    user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    email_id: {
        type: Sequelize.STRING,
        allowNull: false
    },

    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone:{
        type:Sequelize.STRING,
        defaultValue:""
    },
    imgurl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    job: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    section: {
        type: Sequelize.STRING,
        defaultValue: ""
    }
});
//UserModule.sync()           //写入
export default UserModel;
