const { PrismaClient } = require("@prisma/client");
const { generateWithGemini } = require("../middleware/aiService");
const prisma = new PrismaClient();

// A função clean limpa espaços extras mas AGORA não destrói as quebras de linha (\n)
function clean(str = "") {
  return String(str).replace(/[ \t]+/g, " ").trim();
}

const MAX_ORIGINAL_CHARS = 12000;

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
Gera um texto profissional de apresentação de orçamento em PT-PT.

Empresa: ${clean(company.name)}
Cliente: ${clean(client.name)}
Orçamento Nº: ${quote.quoteNumber || ""}
Data: ${quote.issueDate || ""}
Total: ${quote.total || ""} ${quote.currency || ""}

Itens:
${items.map(i => `- ${clean(i.title || i.description)}: ${i.quantity || 1} x ${i.unitPrice || 0} = ${i.lineTotal || 0}`).join("\n")}

Inclui:
1. Uma introdução curta.
2. Lista dos itens.
3. Condições de pagamento (30 dias).
4. Call to action.

REGRAS MUITO IMPORTANTES:
- NÃO USES formatação Markdown (não uses **, *, ou #).
- Usa apenas texto simples (plain text).
- Dá espaçamento real (duplo Enter) entre os parágrafos para ser fácil de ler.
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
  const updatedPrompt = req.body.text; // Isto deve ser um COMANDO (ex: "torna mais curto"), não o texto todo

  if (!updatedPrompt || !updatedPrompt.trim()) {
    return res.status(400).json({ error: "O campo 'text' é obrigatório." });
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, companyId: companyId },
      select: { generatedText: true }
    });

    if (!quote || !quote.generatedText) {
      return res.status(400).json({ error: "Orçamento não encontrado ou sem texto gerado." });
    }

    let originalText = quote.generatedText || ""; // Já NÃO usamos o clean() aqui para não destruir os Enters!
    let truncatedNote = "";
    
    if (originalText.length > MAX_ORIGINAL_CHARS) {
      originalText = originalText.slice(0, MAX_ORIGINAL_CHARS);
      truncatedNote = "\n\n(Nota: o texto original foi truncado por tamanho.)";
    }

    const prompt = `
A seguir está o texto original do orçamento, delimitado entre ===ORIGINAL=== e ===END===:

===ORIGINAL===
${originalText}
===END===

O utilizador pediu a seguinte alteração a este texto:
"${updatedPrompt}"

Instruções:
- Aplica a alteração pedida ao texto ORIGINAL e devolve APENAS o texto final actualizado.
- NÃO USES formatação Markdown (não uses **, *, ou #). Usa apenas texto simples.
- Mantém PT-PT e um tom profissional.
- Mantém as quebras de linha normais.
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