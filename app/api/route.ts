const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const PROMPT = require("./config.ts");

type InlineData = {
  data: string;
  mimeType: string;
};
type ImagePart = {
  inlineData: InlineData;
};

function extractText(jsonData: string): string {
  try {
    const startIndex = jsonData.indexOf("```JSON") + "```JSON".length;
    const endIndex = jsonData.indexOf("```", startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      const extractedText = jsonData.substring(startIndex, endIndex).trim();
      return extractedText;
    } else {
      throw new Error(
        "Unable to find ```JSON delimiters in the provided text."
      );
    }
  } catch (error) {
    return "";
  }
}

function fileToGenerativePart(buff: ArrayBuffer, mimeType: string): ImagePart {
  return {
    inlineData: {
      data: Buffer.from(buff).toString("base64"),
      mimeType,
    },
  };
}

async function generateVision(imageParts: ImagePart[]) {
  const result = await model.generateContent([PROMPT, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function POST(req: Request) {
  const formdata = await req.formData();
  const file = formdata.get("file") as File;
  if (!file) {
    return Response.json({ error: "No files received." }, { status: 400 });
  }
  const buff = await file.arrayBuffer();
  const imagePart = fileToGenerativePart(buff, file.type);
  const text = await generateVision([imagePart]);
  const parsedText = extractText(text);
  const jsonObject = JSON.parse(parsedText);

  return Response.json({ products: jsonObject.data });
}
