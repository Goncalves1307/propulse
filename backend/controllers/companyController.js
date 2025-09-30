const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const saltRounds = 13;


const generateSlug = async (name) => {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-") // espaços por hífens
    .replace(/[^a-z0-9-]/g, ""); // remove símbolos

  let slug = base;
  let count = 1;

  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${base}-${count}`;
    count++;
  }

  return slug;
};


const createCompany = async (req,res)=>{
    const {name,description,location,phone} = req.body;
    const user_id = req.user.id
    const slug = await generateSlug(name);


try{
    const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
            data: {
                name,
                ownerId: user_id,
                slug,
                description,
                location,
                phone
            }
            
        })
        await tx.companyUser.create({
            data: {
                companyId: company.id,
                userId: user_id,
                role: "ADMIN"
            }
        })
        return company
    })
        return res.status(201).json({
            id: result.id,
            name: result.name,
            slug: result.slug,
            createdAt: result.createdAt,
            ownerId: result.ownerId,
})
}catch(err){
            if (err.code === 'P2002') {
            const target = err.meta?.target || [];

            if (target.includes('name')) {
                return res.status(409).json({ code: "DUPLICATE", message: 'Name already exists!', fields: { name: "Already exists" } })
            }
            if (target.includes('slug')) {
                return res.status(409).json({ code: "DUPLICATE", message: 'Slug already exists!', fields: { slug: "Already exists" } })
            }
                return res.status(409).json({code: "DUPLICATE",message: "Duplicated data",fields: { _general: "Duplicated value" }})
        }
    res.status(500).json({ message: 'Error while creating company' })
    console.log(err)
}
}


module.exports = createCompany