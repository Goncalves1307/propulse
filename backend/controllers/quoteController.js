const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const parseIssueDate = (value) => {
  if (!value) return new Date();
  const date = new Date(value);
  if (isNaN(date.getTime())) throw new Error("INVALID_ISSUE_DATE");
  return date;
};

const createQuote = async (req, res) => {
  const { companyId, clientId } = req.params;
  const userId = req.user.id;

  const {
    quoteNumber,
    currency,
    items = [],
    description,
    discountAmount = 0,
    taxAmount = 0,
    issueDate, // <-- novo
  } = req.body;

  try {
    const parsedIssueDate = parseIssueDate(issueDate);

    const subtotal = items.reduce(
      (acc, it) => acc + it.unitPrice * it.quantity,
      0
    );
    const total = subtotal - discountAmount + taxAmount;

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
          issueDate: parsedIssueDate, // <-- guardar
        },
      });

      if (items.length) {
        const itemsData = items.map((item, i) => ({
          quoteId: quote.id,
          position: i + 1,
          title: item.title,
          description: item.description || "",
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          discountPct: item.discountPct || 0,
          taxRate: item.taxRate || 0,
          lineTotal:
            item.quantity *
            item.unitPrice *
            (1 - (item.discountPct || 0) / 100) *
            (1 + (item.taxRate || 0) / 100),
        }));
        await tx.quoteItem.createMany({ data: itemsData });
      }

      return quote;
    });

    return res.status(201).json(result);
  } catch (err) {
    if (err.message === "INVALID_ISSUE_DATE") {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid Data",
        fields: { issueDate: "Invalid ISO date" },
      });
    }
    if (err.code === 'P2002') {
      const target = err.meta?.target || [];
      if (target.includes('quoteNumber')) {
        return res.status(409).json({ code: "DUPLICATE", message: 'Quote Number already exists!', fields: { quoteNumber: "Already exists" } })
      }
    }
    console.error(err);
    return res.status(500).json({ message: "Error while creating quote" });
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