const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const saltRounds = 13;

// Importar schemas
const {
  companyCreateSchema,
  companyUpdateSchema,
  memberCreateSchema,
  memberRoleUpdateSchema,
} = require("../validators/company");

// --------------------
// Utils
// --------------------
const generateSlug = async (name) => {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  let slug = base;
  let count = 1;

  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${base}-${count}`;
    count++;
  }

  return slug;
};

// Formata erros do Zod para resposta amigável
const formatZodErrors = (zodError) => {
  const errors = {};
  zodError.errors.forEach((err) => {
    const field = err.path.join('.');
    errors[field] = err.message;
  });
  return errors;
};

// --------------------
// Auth helpers
// --------------------
const assertCompanyAdmin = async (companyId, userId) => {
  const company = await prisma.company.findFirst({
    where: { id: companyId, deletedAt: null },
    select: { ownerId: true },
  });

  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  // owner é sempre admin
  if (company.ownerId === userId) {
    return;
  }

  const membership = await prisma.companyUser.findFirst({
    where: {
      companyId,
      userId,
      role: "ADMIN",
    },
  });

  if (!membership) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
};

// --------------------
// CREATE COMPANY
// --------------------
const createCompany = async (req, res) => {
  try {
    // Validação com Zod
    const parsed = companyCreateSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodErrors(parsed.error),
      });
    }

    const validData = parsed.data;
    const user_id = req.user.id;
    const slug = await generateSlug(validData.name);

    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          ...validData,
          ownerId: user_id,
          slug,
        }
      });

      await tx.companyUser.create({
        data: {
          companyId: company.id,
          userId: user_id,
          role: "ADMIN"
        }
      });

      return company;
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while creating company" });
  }
};

// --------------------
// LIST COMPANIES
// --------------------
const getCompanies = async (req, res) => {
  const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? "20", 10), 1), 100);
  const skip = (page - 1) * limit;

  try {
    const memberships = await prisma.companyUser.findMany({
      where: {
        userId: req.user.id,
        company: { deletedAt: null },
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

    const items = memberships.map((m) => ({
      id: m.company.id,
      name: m.company.name,
      slug: m.company.slug,
      createdAt: m.company.createdAt,
      role: m.role,
    }));

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

// --------------------
// GET BY ID
// --------------------
const getCompaniesById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await prisma.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        taxId: true,
        createdAt: true,
        ownerId: true,
      },
    });

    if (!company) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return res.status(200).json(company);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while fetching company",
    });
  }
};

// --------------------
// DELETE COMPANY
// --------------------
const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const quotes = await tx.quote.findMany({
        where: { companyId },
        select: { id: true },
      });

      const quoteIds = quotes.map((q) => q.id);

      if (quoteIds.length) {
        await tx.quoteItem.deleteMany({
          where: { quoteId: { in: quoteIds } },
        });
      }

      await tx.quote.deleteMany({ where: { companyId } });
      await tx.client.deleteMany({ where: { companyId } });
      await tx.companyUser.deleteMany({ where: { companyId } });

      return await tx.company.delete({ where: { id: companyId } });
    });

    return res.status(200).json({
      message: "Company deleted successfully.",
      company: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while deleting company" });
  }
};

// --------------------
// UPDATE COMPANY
// --------------------
const updateCompany = async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user.id;

  try {
    // Validação com Zod
    const parsed = companyUpdateSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodErrors(parsed.error),
      });
    }

    const validData = parsed.data;

    const company = await prisma.company.findFirst({
      where: { id: companyId, deletedAt: null }
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let slug = company.slug;
    if (validData.name && validData.name !== company.name) {
      slug = await generateSlug(validData.name);
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        ...validData,
        slug
      }
    });

    return res.status(200).json(updatedCompany);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while updating company"
    });
  }
};

// --------------------
// MEMBERS: LIST
// --------------------
const getCompanyMembers = async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user.id;

  try {
    await assertCompanyAdmin(companyId, userId);

    const memberships = await prisma.companyUser.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const items = memberships.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      phone: m.user.phone,
      role: m.role,
      createdAt: m.createdAt,
    }));

    return res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Error while fetching company members" });
  }
};

// --------------------
// MEMBERS: CREATE
// --------------------
const addCompanyMember = async (req, res) => {
  const { companyId } = req.params;
  const currentUserId = req.user.id;

  try {
    await assertCompanyAdmin(companyId, currentUserId);

    const parsed = memberCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { email, role } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    const existing = await prisma.companyUser.findFirst({
      where: {
        companyId,
        userId: user.id,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "User is already a member of this company",
      });
    }

    const membership = await prisma.companyUser.create({
      data: {
        companyId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.status(201).json({
      userId: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      phone: membership.user.phone,
      role: membership.role,
      createdAt: membership.createdAt,
    });
  } catch (err) {
    console.error(err);
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Error while adding company member" });
  }
};

// --------------------
// MEMBERS: UPDATE ROLE
// --------------------
const updateCompanyMemberRole = async (req, res) => {
  const { companyId, userId } = req.params;
  const currentUserId = req.user.id;

  try {
    await assertCompanyAdmin(companyId, currentUserId);

    const parsed = memberRoleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { role } = parsed.data;

    const company = await prisma.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: { ownerId: true },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.ownerId === userId) {
      return res.status(400).json({
        message: "Cannot change role of company owner",
      });
    }

    const membership = await prisma.companyUser.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    // impedir remover o último ADMIN
    if (membership.role === "ADMIN" && role === "USER") {
      const adminCount = await prisma.companyUser.count({
        where: {
          companyId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return res.status(409).json({
          message: "Cannot downgrade the last admin of the company",
        });
      }
    }

    const updated = await prisma.companyUser.update({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
      data: {
        role,
      },
    });

    return res.status(200).json({
      userId,
      role: updated.role,
    });
  } catch (err) {
    console.error(err);
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Error while updating member role" });
  }
};

// --------------------
// MEMBERS: DELETE
// --------------------
const removeCompanyMember = async (req, res) => {
  const { companyId, userId } = req.params;
  const currentUserId = req.user.id;

  try {
    await assertCompanyAdmin(companyId, currentUserId);

    const company = await prisma.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: { ownerId: true },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.ownerId === userId) {
      return res.status(400).json({
        message: "Cannot remove the company owner",
      });
    }

    const membership = await prisma.companyUser.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    // impedir remover o último ADMIN
    if (membership.role === "ADMIN") {
      const adminCount = await prisma.companyUser.count({
        where: {
          companyId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return res.status(409).json({
          message: "Cannot remove the last admin of the company",
        });
      }
    }

    await prisma.companyUser.delete({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
    });

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    console.error(err);
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Error while removing company member" });
  }
};

// --------------------
module.exports = {
  createCompany,
  getCompanies,
  getCompaniesById,
  deleteCompany,
  updateCompany,
  getCompanyMembers,
  addCompanyMember,
  updateCompanyMemberRole,
  removeCompanyMember,
};