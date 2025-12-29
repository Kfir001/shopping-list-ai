import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ShoppingList = z.object({
  stops: z.array(
    z.object({
      store: z.string(),
      branch: z.string().nullable().optional(),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.number().optional().nullable(),
          unit: z.string().optional().nullable(),
          notes: z.string().optional().nullable(),
          category: z.string().optional().nullable(),
          confidence: z.number().optional().nullable()
        })
      )
    })
  )
});

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    data = {};
  }
  const { text } = data;
  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "Missing text" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "אתה ממיר הודעת וואטסאפ בעברית לרשימת קניות מובנית. החזר JSON בלבד בהתאם לסכימה של ShoppingList. אל תמציא כמויות או יחידות אם לא קיימות, אחד כפילויות וכתוב העצירות בפורמט המתאים."
      },
      { role: "user", content: text }
    ],
    text: { format: zodTextFormat(ShoppingList, "shopping_list") }
  });

  return new Response(JSON.stringify(response.output_parsed), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
