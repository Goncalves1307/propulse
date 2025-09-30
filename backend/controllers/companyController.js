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

// controllers/companyController.js
const getCompanies = async (req, res) => {
  // paginação básica por querystring ?page=1&limit=20
  const page  = Math.max(parseInt(req.query.page ?? "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? "20", 10), 1), 100);
  const skip  = (page - 1) * limit;

  try {
    // 1) buscar memberships do user + dados essenciais da company
    const memberships = await prisma.companyUser.findMany({
      where: {
        userId: req.user.id,
        company: { deletedAt: null }, // soft delete filter
      },
      include: {
        company: {
          select: { id: true, name: true, slug: true, createdAt: true },
        },
      },
      orderBy: { company: { createdAt: "desc" } },
      skip,
      take: limit,
    });

    // 2) mapear para o shape que o frontend quer (company + role do user)
    const items = memberships.map((m) => ({
      id: m.company.id,
      name: m.company.name,
      slug: m.company.slug,
      createdAt: m.company.createdAt,
      role: m.role,
    }));

    // 3) total para paginação (opcional, útil para UI)
    const total = await prisma.companyUser.count({
      where: {
        userId: req.user.id,
        company: { deletedAt: null },
      },
    });

    return res.status(200).json({
      page,
      limit,
      total,
      items,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Error while listing companies" });
  }
};


module.exports = { createCompany, getCompanies };
