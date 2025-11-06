const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createQuote = async (req, res) => {
  const companyId = req.params.companyId;
  const clientId = req.params.clientId;
  const userId = req.user.id; // assuming auth middleware sets req.user

  const {
    quoteNumber,
    status,
    issueDate,
    validUntil,
    sentAt,
    acceptedAt,
    rejectedAt,
    currency,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    description
  } = req.body;

  try {
    const client = await prisma.client.findFirst({
      where: { id: clientId, companyId }
    });

    if (!client) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Client does not belong to this company."
      });
    }

    const exists = await prisma.quote.findFirst({
      where: { quoteNumber, companyId }
    });

    if (exists) {
      return res.status(409).json({
        code: "CONFLICT",
        message: "Quote number already exists for this company."
      });
    }

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        status,
        issueDate,
        validUntil,
        sentAt,
        acceptedAt,
        rejectedAt,
        currency,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        description,
        companyId,
        clientId,
        createdById: userId
      }
    });

    return res.status(201).json({ message: "Quote created successfully.", quote });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error while creating the quote."
    });
  }
};

module.exports = { createQuote };