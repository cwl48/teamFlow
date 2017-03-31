import { config } from './common';
import EmojiModel from '../model/m_emoji';
import * as Koa from 'koa';
//写入emoji地址进入数据库
export const insertEmoji =async function () {
    for (let i = 1; i < 95; i++) {
       await EmojiModel.create({
            url: `${config.host}/emoji/${i}.png`
        })
    }
}
export const getEmoji = async function (ctx:Koa.Context,next:Function) {
    let emojis = await EmojiModel.findAll({})
    ctx.body = {
        success:true,
        msg:'获取emoji成功',
        datas:emojis
    }
}
