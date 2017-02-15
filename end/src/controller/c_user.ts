

export default class User{

    //注册账号
    public singin=(req:any,res:any)=>{
        
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let code = req.body.code;
    }

    public getCode=(req:any,res:any)=>{

        let email = req.body.email;
        

        
    }
}