import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const EmailModel = sequelize.define('email', {
    email_id: {                       //主键邮箱id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: {                          //邮箱号
        type: Sequelize.STRING,
        allowNull: false
    },
    code: {                           //验证码
        type: Sequelize.STRING,
        defaultValue: ""
    },
    isActive: {
        type: Sequelize.INTEGER,       //是否激活,是否已注册
        defaultValue: 0
    },
    modifiFlag: {
        type: Sequelize.STRING,       //修改邮箱验证
        defaultValue: ""
    }

});

//EmailModel.sync()           //写入
export default EmailModel;
