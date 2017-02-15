import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const User = sequelize.define('user',{
    email:Sequelize.STRING,
    username:Sequelize.STRING,
    password:Sequelize.STRING,
    img:Sequelize.STRING,
});


export default User;
