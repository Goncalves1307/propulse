const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createQuote = async (req, res) => {
  const { companyId, clientId } = req.params;
  const userId = req.user.id;

  const {
    quoteNumber,
    currency,
    items,
    description,
    discountAmount,
    taxAmount,
  } = req.body;

  try {
    const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const total = subtotal - (discountAmount || 0) + (taxAmount || 0);

    const result = await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.create({
        data: {
          companyId,
          clientId,
          createdById: userId,
          quoteNumber,
          status: "DRAFT",
          currency,
          subtotal,
          discountAmount,
          taxAmount,
          total,
          description,
        },
      });

      const itemsData = items.map((item, index) => ({
        quoteId: quote.id,
        position: index + 1,
        title: item.title,
        description: item.description || "",
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discountPct: item.discountPct || 0,
        taxRate: item.taxRate || 0,
        lineTotal:
          item.quantity * item.unitPrice *
          (1 - (item.discountPct || 0) / 100) *
          (1 + (item.taxRate || 0) / 100),
      }));

      await tx.quoteItem.createMany({ data: itemsData });

      return { quote, items: itemsData };
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while creating quote" });
  }
};

const getQuotesByCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const quotes = await prisma.quote.findMany({
      where: { companyId },
      select: {
        id: true,
        quoteNumber: true,
        description: true,
      },
    });
    return res.status(200).json({ quotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while getting quotes" });
  }
};

const getQuotesByID = async (req, res) => {
  const { quoteId } = req.params;

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true },
    });

    return res.status(200).json({ quote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while getting quote" });
  }
};

const updateQuote = async (req, res) => {
  const { currency, items, description, discountAmount, taxAmount, status } = req.body;
  const { quoteId } = req.params;

  try {
    const exists = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!exists) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Quote not found.",
      });
    }

    const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const total = subtotal - (discountAmount || 0) + (taxAmount || 0);

    const updated = await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.update({
        where: { id: quoteId },
        data: {
          currency,
          description,
          discountAmount,
          taxAmount,
          subtotal,
          total,
          status,
        },
      });

      await tx.quoteItem.deleteMany({ where: { quoteId } });

      const itemsData = items.map((item, index) => ({
        quoteId,
        position: index + 1,
        title: item.title,
        description: item.description || "",
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discountPct: item.discountPct || 0,
        taxRate: item.taxRate || 0,
        lineTotal:
          item.quantity * item.unitPrice *
          (1 - (item.discountPct || 0) / 100) *
          (1 + (item.taxRate || 0) / 100),
      }));

      await tx.quoteItem.createMany({ data: itemsData });

      return { quote, items: itemsData };
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while updating quote" });
  }
};

const deleteQuote = async (req, res) => {
  const { quoteId } = req.params;

  try {
    const exists = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!exists) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Quote not found.",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.quoteItem.deleteMany({ where: { quoteId } });
      const quote = await tx.quote.delete({ where: { id: quoteId } });
      return quote;
    });

    return res.status(200).json({
      message: "Quote and items deleted successfully.",
      quote: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while deleting quote" });
  }
};

module.exports = { createQuote, getQuotesByCompany, getQuotesByID, updateQuote, deleteQuote };