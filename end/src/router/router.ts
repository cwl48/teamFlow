import * as Router from "koa-router";
import User from "../model/m_user";

const router = new Router();

router.get("/opp",async (ctx,next)=>{
    const user = await User.findAll();
    ctx.body = user;
})

export default router;