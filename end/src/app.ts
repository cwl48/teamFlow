import * as Koa from 'koa';
import * as bodyParser from  "koa-bodyparser";
import * as logger from "koa-logger";
import router from "./router/router"
const convert = require("koa-convert");
const cors = require("koa-cors");

const app = new Koa();

//日志中间件
app.use(logger());
//跨域中间件
app.use(convert(cors()));
//body解析
app.use(bodyParser());
//路由中间件
app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000,()=>{
    console.log("服务器启动");    
});
