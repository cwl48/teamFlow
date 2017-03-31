import { insertEmoji } from './config/emoji';
import * as Koa from 'koa';
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import router from "./router/router"
import * as path from 'path'
import MySocket from './socket/socket'
import * as socket from "socket.io"
const serve = require("koa-static")
const convert = require("koa-convert");
const cors = require("koa-cors");
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = socket(server)
//日志中间件
app.use(logger());
//跨域中间件
app.use(convert(cors({ credentials: true })));
// 静态文件
app.use(serve(path.join(__dirname, "..", "public")))
//body解析
app.use(bodyParser({
    formLimit: '1m'
}));
//路由中间件
app.use(router.routes())
    .use(router.allowedMethods());

//socket连接
io.of('/socket').on("connect", (socket: any) => {
    console.log("连接成功")
    MySocket.handle(io,socket)
})

// insertEmoji()    //插入emoji数据库

server.listen(3000, () => {
    console.log("服务器启动");
});

 
