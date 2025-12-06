const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const saltRounds = 13;


const signUp = async (req,res) =>{
    //atribui os valores recebidos do request
    const { name, email, password, phone } = req.body;

    //Encripta a password
    const password_hash = await bcrypt.hash(password,saltRounds);

    try{
        await prisma.user.create({
            data:{
                name: name,
                email: email,
                passwordHash: password_hash,
                phone: phone,
            }
        })
        res.status(201).json({ message: "User created with success!" });
    }catch(err){
        if (err.code === 'P2002') {
            const target = err.meta?.target || [];

            if (target.includes('email')) {
                return res.status(409).json({ message: 'Email already exists' })
            }
            if (target.includes('name')) {
                return res.status(409).json({ message: 'Name already exists' })
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
        res.status(200).json({name: user.name, token})
    }catch(err){
        res.status(500).json({ message: 'Unexpected error during login' });
        console.log(err)
    }

}
const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Error fetching current user" });
  }
};

module.exports = {signUp,login,me};