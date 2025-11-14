// controllers/aiController.js
const { PrismaClient } = require("@prisma/client");
const { generateWithGemini } = require("../middleware/aiService");
const prisma = new PrismaClient();

function clean(str = "") {
  return String(str).replace(/\s+/g, " ").trim();
}

const MAX_ORIGINAL_CHARS = 12000; // safety cap for prompt size

async function generateQuoteText(req, res) {
  const { companyId, clientId, quoteId } = req.params;

  try {
    const [company, client, quote, items] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.client.findUnique({ where: { id: clientId } }),
      prisma.quote.findUnique({ where: { id: quoteId } }),
      prisma.quoteItem.findMany({ where: { quoteId } })
    ]);

    if (!company || !client || !quote) {
      return res.status(404).json({ error: "Company, client ou quote não encontrados." });
    }

    if (!items.length) {
      return res.status(400).json({ error: "O orçamento deve ter pelo menos 1 item." });
    }

    const prompt = `
Gera um texto profissional de orçamento em PT-PT.

Empresa: ${clean(company.name)}
Cliente: ${clean(client.name)}

Orçamento Nº: ${quote.quoteNumber || ""}
Data: ${quote.issueDate || ""}
Total: ${quote.total || ""} ${quote.currency || ""}

Itens:
${items.map(i => `- ${clean(i.title)}: ${i.quantity || 1} x ${i.unitPrice || 0} = ${i.lineTotal || 0}`).join("\n")}

Inclui:
1. Uma introdução curta.
2. Lista dos itens.
3. Condições de pagamento (30 dias).
4. Call to action.
    `;

    const aiResult = await generateWithGemini(prompt);

    if (!aiResult.success) {
      return res.status(502).json({ error: aiResult.error });
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: { generatedText: aiResult.text }
    });

    res.status(200).json({
      text: aiResult.text,
      saved: true
    });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Erro interno." });
  }
}

const updateGeneratedQuote = async (req, res) => {
  const { quoteId, companyId } = req.params;
  const updatedPrompt = req.body.text;

  if (!updatedPrompt || !updatedPrompt.trim()) {
    return res.status(400).json({ error: "O campo 'text' é obrigatório." });
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        companyId: companyId
      },
      select: {
        generatedText: true
      }
    });

    if (!quote) {
      return res.status(404).json({ error: "Quote não encontrado ou não pertence à empresa." });
    }

    if (!quote.generatedText) {
      return res.status(400).json({ error: "Este orçamento ainda não tem texto gerado." });
    }
    let originalText = clean(quote.generatedText || "");
    let truncatedNote = "";
    if (originalText.length > MAX_ORIGINAL_CHARS) {
      originalText = originalText.slice(0, MAX_ORIGINAL_CHARS);
      truncatedNote = "\n\n(Nota: o texto original foi truncado por tamanho.)";
    }

    const changes = clean(updatedPrompt || "");

    const prompt = `
A seguir está o texto original do orçamento, delimitado entre ===ORIGINAL=== e ===END===:

===ORIGINAL===
${originalText}
===END===

Pedido de alteração:
${changes}

Instruções:
- Aplica as alterações ao texto ORIGINAL e devolve apenas o texto final actualizado.
- Mantém PT-PT e um tom profissional.
- Não expliques as alterações, não devolvas JSON, não peças mais informações.
${truncatedNote}
`;

    const aiResult = await generateWithGemini(prompt);

    if (!aiResult.success) {
      return res.status(502).json({ error: aiResult.error });
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: { generatedText: aiResult.text }
    });

    res.status(200).json({
      text: aiResult.text,
      saved: true
    });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Erro interno." });
  }
};

module.exports = { generateQuoteText, updateGeneratedQuote };