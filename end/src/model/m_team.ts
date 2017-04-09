import sequelize from '../config/db';
import * as Sequelize from 'sequelize';
import TeamUserModel from './m_team_user';
import UserModel from './m_user';
import EmailModel from './m_email';
import TeamLogModel from './m_team_log';
import ProjectModel from './m_project';
import ProjectUserModel from './m_project_user';
import TaskModel from './m_task';
import UserTaskModel from './m_user_task';
import TaskMsgsModel from './m_task_msg';
import GroupChatsModel from './m_group_chat';
import Task from '../controller/c_task';
import PersonChatsModel from './m_person_chat';
const TeamModel = sequelize.define('team', {
    team_id: {                       //主键团队id
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    teamName: {                          //团队名
        type: Sequelize.STRING,
        allowNull: false
    },
    belongs_phone: {                           //从属人电话
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,       //创建人
        allowNull: false
    },
    bussiness: {
        type: Sequelize.STRING,       //   行业名
        allowNull: false
    },
    imgurl: {
        type: Sequelize.STRING,       //   团队图标
        allowNull: false
    },
    desc:{
        type: Sequelize.STRING,       //   团队描述
        defaultValue:''
    },
    status: {                         //团队状态  1.正常  0.解散
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }

 }
);
UserModel.belongsTo(EmailModel, {foreignKey: 'email_id' })
TeamUserModel.belongsTo(UserModel,{foreignKey:'user_id'})
TeamUserModel.belongsTo(TeamModel,{foreignKey:'team_id'})
TeamModel.belongsToMany(UserModel,{through:TeamUserModel,foreignKey:"team_id",otherKey:"user_id"})
UserModel.belongsToMany(TeamModel,{through:TeamUserModel,foreignKey:"user_id",otherKey:"team_id"})

TeamLogModel.belongsTo(UserModel,{foreignKey:'user_id'})

//项目跟团队关联
ProjectModel.belongsTo(TeamModel,{foreignKey:"team_id"})

//项目跟用户关联
ProjectModel.belongsToMany(UserModel,{through:ProjectUserModel,foreignKey:'project_id',otherKey:'user_id'})
UserModel.belongsToMany(ProjectModel,{through:ProjectUserModel,foreignKey:'user_id',otherKey:'project_id'})

//项目跟任务关联
TaskModel.belongsTo(ProjectModel,{foreignKey:"project_id"})

//任务关联
UserModel.belongsToMany(TaskModel,{through:UserTaskModel,foreignKey:"user_id",otherKey:"task_id"})
TaskModel.belongsToMany(UserModel,{through:UserTaskModel,foreignKey:"task_id",otherKey:"user_id"})

//任务跟用户关联
// TaskModel.belongsTo(UserModel,{foreignKey:"user_id"})

//任务跟任务所属人员表关联
TaskModel.belongsTo(UserTaskModel,{foreignKey:"task_id"})

//任务跟项目关联
TaskModel.belongsTo(ProjectModel,{foreignKey:'project_id'})
ProjectModel.hasOne(TaskModel,{foreignKey:'project_id'})


//任务动态和任务关联
TaskMsgsModel.belongsTo(TaskModel,{foreignKey:"task_id"})
//任务动态和用户关联
TaskMsgsModel.belongsTo(UserModel,{foreignKey:"user_id"})

//群聊和用户关联
GroupChatsModel.belongsTo(UserModel,{foreignKey:'source_user_id',targetKey:'user_id'})

//私聊和用户关联
PersonChatsModel.belongsTo(UserModel,{foreignKey:'source_user_id',targetKey:"user_id"})
// TeamModel.sync()           //写入
export default TeamModel;
