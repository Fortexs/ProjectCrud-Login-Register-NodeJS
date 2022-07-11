import {Sequelize} from "sequelize";

const db = new Sequelize('belajarnodejs','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;