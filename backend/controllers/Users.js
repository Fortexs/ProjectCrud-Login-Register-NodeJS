import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Op } from "sequelize";


export const getUsers = async(req, res) => {
    try {
      const users = await Users.findAll({
          attributes:['id','name','email']
      });
      res.json(users);
        
    } catch (error) {
        console.log(error);
        
    }
}

export const Register = async(req, res) => {
    const {name, email, password, confPassword} = req.body;
    if(password != confPassword) return res.status(400).json({msg: "password tidak sama"});

    // Validasi
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });

    }





    

    const Email = await Users.findOne({ where: {email} });
    const Name = await Users.findOne({ where: {name} });

    // Validasi

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
        });
        res.json({msg: "Daftar Berhasil"});
    } catch (error) {
        console.log(error);
    }
           
        
}

export const Login = async(req, res) => {
    try {
        const users = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, users[0].password);
        if(!match) return res.status(400).json({msg: "wrong password"});
        const userId = users[0].id;
        const name = users[0].name;
        const email = users[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true
        });
        res.json({accessToken});
    } catch (error) {
        res.status(400).json({msg: "Email tak ditemukan"});
        
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await Users.update({refresh_token: null},{
            where:{
                id: userId
            }
        });

        res.clearCookie('refreshToken');
        return res.sendStatus(200);
}



export const searchUsers = async(req, res) => {

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Users.count({
        where:{
            [Op.or]: [{name:{
                [Op.like]: '%'+search+'%'
            }}, {email:{
                [Op.like]: '%'+search+'%'
            }}]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Users.findAll ({
        where:{
            [Op.or]: [{name:{
                [Op.like]: '%'+search+'%'
            }}, {email:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        offset: offset,
        limit: limit,
        order:[
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });

    
}