import {Sequelize} from "sequelize";

const db = new Sequelize('learn_nodejs2','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;