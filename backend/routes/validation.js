import { check } from "express-validator";



export const getValidator = [
    
check('name').notEmpty().withMessage("gaboleh kosong goblok"),
check('email')
] 