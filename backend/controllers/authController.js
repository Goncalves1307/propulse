const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const saltRounds = 13;


const signUp = async (req,res) =>{
    //atribui os valores recebidos do request
    const { username, email, password, role } = req.body;

    //Encripta a password
    const password_hash = await bcrypt.hash(password,saltRounds);

    try{
        await prisma.user.create({
            data:{
                username: username,
                email: email,
                passwordHash: password_hash,
                role: role,
            }
        })
        res.status(201).json({ message: "User created with success!" });
    }catch(err){
        if (err.code === 'P2002') {
            const target = err.meta?.target || [];

            if (target.includes('email')) {
                return res.status(409).json({ message: 'Email already exists' })
            }
            if (target.includes('username')) {
                return res.status(409).json({ message: 'Username already exists' })
            }

                return res.status(409).json({ message: 'Duplicated Data' })
        }
        res.status(500).json({message:'Error while creating user'})

        console.log(err)
}
}



const login = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await prisma.user.findUnique({ where: { email } });
        
        if(!user){
            return res.status(401).json({error:"Invalid credentials"})
        }
        
        const isPasswordValid= await bcrypt.compare(password,user.passwordHash);

        if(!isPasswordValid){
            return res.status(401).json({error:"Invalid credentials"})
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({token})
    }catch(err){
        res.status(500).json({ message: 'Unexpected error during login' });
        console.log(err)
    }

}
module.exports = {signUp,login,};