const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const membershipGuard = async (req, res, next) => {
  const userId = req.user?.id;
  const companyId = req.params.companyId; 

  if (!userId) {
    return res.status(401).json({ error: "Invalid User ID" });
  }

  if (!companyId) {
    return res.status(400).json({ error: "Invalid Company ID" });
  }

  try {
    const membership = await prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
        company: { deletedAt: null } 
      }
    });

    if (!membership) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "You are not a member of this company"
      });
    }

    req.membership = {
      role: membership.role,
      companyId
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Failed to check membership"
    });
  }
};

module.exports = membershipGuard;