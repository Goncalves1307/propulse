const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createClient = async (req, res) => {
  const { name, phone, taxId, email, legalName } = req.body;
  const companyId = req.params.companyId;

  try {
    const existing = await prisma.client.findFirst({
      where: {
        companyId,
        OR: [
          { name },
          { email },
          { taxId }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        code: "CONFLICT",
        message: "Client with same name, email, or taxId already exists in this company."
      });
    }

    await prisma.client.create({
      data: {
        name,
        phone,
        taxId,
        email,
        legalName,
        companyId
      }
    });

    return res.status(201).json({ message: "Client created successfully." });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while creating client."
    });
  }
};

const getClients = async (req, res) => {
  try {
    const companyId = req.params.id;

    const clients = await prisma.client.findMany({
      where: { companyId: companyId },
      select: {
        id: true,
        name: true,
        legalName: true,
        companyId: true,
        email: true,
        taxId: true,
        phone: true
      }
    });

    if (!clients) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Clients not found."
      });
    }

    return res.status(200).json(clients);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while fetching client."
    });
  }
};


const getClientsId = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const clientId = req.params.clientId


    const client = await prisma.client.findFirst({
      where: { companyId, id: clientId },
      select: {
        id: true,
        name: true,
        legalName: true,
        companyId: true,
        email: true,
        taxId: true,
        phone: true
      }
    });

    if (!client) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Clients not found."
      });
    }

    return res.status(200).json(client);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while fetching client."
    });
  }
};

const updateClient = async (req, res) => {
  const { name, legalName, email, taxId, phone } = req.body;

  try {
    const companyId = req.params.companyId;
    const clientId = req.params.clientId;


    const exists = await prisma.client.findFirst({
      where: { id: clientId, companyId }
    });

    if (!exists) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Client not found."
      });
    }

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        name,
        legalName,
        email,
        taxId,
        phone
      }
    });

    return res.status(200).json(updated);

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while updating client."
    });
  }
};

module.exports = { createClient, getClients , getClientsId,updateClient};