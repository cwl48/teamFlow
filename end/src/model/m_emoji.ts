import sequelize from '../config/db';
import * as Sequelize from 'Sequelize';

const EmojiModel = sequelize.define("t_emojis", {
    id: {                       //主键
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

EmojiModel.sync()           //写入
export default EmojiModel;
