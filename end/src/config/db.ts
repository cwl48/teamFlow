import * as Sequelize from "sequelize";

const dburl = "127.0.0.1"
    //mysql连接设置
const sequelize = new Sequelize("teamFlow","root","199548lwc",{
        host:dburl,
        dialect:"mysql",
        pool:{
            max:5,
            min:0,
            idle:10000
        },
        port:3306,
        timezone:"+08:00"
});

export default sequelize;
