const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  clientCreateSchema,
  clientUpdateSchema,
} = require("../validators/client");

const formatZodErrors = (zodError) => {
  const errors = {};
  zodError.errors.forEach((err) => {
    const field = err.path.join('.');
    errors[field] = err.message;
  });
  return errors;
};



const createClient = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const parsed = clientCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { name, phone, taxId, email, legalName } = parsed.data;

    const existing = await prisma.client.findFirst({
      where: {
        companyId,
        OR: [
          { name },
          { email },
          { taxId },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({
        code: "CONFLICT",
        message:
          "Client with same name, email, or taxId already exists in this company.",
      });
    }

    await prisma.client.create({
      data: {
        name,
        phone,
        taxId,
        email,
        legalName,
        companyId,
      },
    });

    return res.status(201).json({ message: "Client created successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while creating client.",
    });
  }
};

const getClients = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const clients = await prisma.client.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        legalName: true,
        companyId: true,
        email: true,
        taxId: true,
        phone: true,
      },
    });

    // findMany always returns an array; empty array is fine
    return res.status(200).json(clients);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while fetching client.",
    });
  }
};

const getClientsId = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const clientId = req.params.clientId;

    const client = await prisma.client.findFirst({
      where: { companyId, id: clientId },
      select: {
        id: true,
        name: true,
        legalName: true,
        companyId: true,
        email: true,
        taxId: true,
        phone: true,
      },
    });

    if (!client) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Client not found.",
      });
    }

    return res.status(200).json(client);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while fetching client.",
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const clientId = req.params.clientId;

    // Validate body for update (all fields optional)
    const parsed = clientUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid Data",
      fields: formatZodErrors(parsed.error),
  });
}

    const { name, legalName, email, taxId, phone } = parsed.data;

    const exists = await prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!exists) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Client not found.",
      });
    }

    // Optional: check for uniqueness conflicts on update
    if (name || email || taxId) {
      const conflict = await prisma.client.findFirst({
        where: {
          companyId,
          id: { not: clientId },
          OR: [
            name ? { name } : undefined,
            email ? { email } : undefined,
            taxId ? { taxId } : undefined,
          ].filter(Boolean),
        },
      });

      if (conflict) {
        return res.status(409).json({
          code: "CONFLICT",
          message:
            "Another client with same name, email, or taxId already exists in this company.",
        });
      }
    }

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        name,
        legalName,
        email,
        taxId,
        phone,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while updating client.",
    });
  }
};

const deleteClient = async (req, res) => {
  const { companyId, clientId } = req.params;

  try {
    const existing = await prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!existing) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Client not found.",
      });
    }

    const removedClient = await prisma.client.delete({
      where: { id: clientId },
    });

    return res
      .status(200)
      .json({ message: "Client removed with success", removedClient });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while deleting client.",
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientsId,
  updateClient,
  deleteClient,
};