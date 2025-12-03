import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// LẤY API KEY TỪ VERCEL (KHÔNG CẦN .env.local)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  console.error("❌ Thiếu VITE_GEMINI_API_KEY. Hãy thêm API Key vào Environment Variables của Vercel!");
}

// Tạo client Gemini
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
});

// ======================= ESSAY GENERATION =======================

export const generateEssay = async (
  topic: string,
  outline: string,
  wordCount: number,
  language: string
): Promise<string> => {
  if (!apiKey) {
    return "Lỗi: Chưa cấu hình API Key. Hãy thêm vào Vercel → Environment Variables.";
  }

  const langMap: Record<string, string> = {
    vi: "Tiếng Việt",
    en: "Tiếng Anh",
    zh: "Tiếng Trung (Giản thể)",
    ru: "Tiếng Nga",
    ja: "Tiếng Nhật",
    fr: "Tiếng Pháp",
  };

  const langText = langMap[language] || "Tiếng Việt";

  const prompt = `
    Hãy đóng vai một nhà văn chuyên nghiệp, viết bài văn bằng ${langText} về chủ đề: "${topic}".

    - Độ dài: khoảng ${wordCount} từ.
    - ${
      outline
        ? `Dựa trên dàn ý sau: ${outline}`
        : "Nếu không có dàn ý, hãy tự xây dựng bố cục logic."
    }
    - Văn phong đẹp, mượt mà, sâu sắc.
    - Chỉ trả về nội dung bài văn, không thêm mô tả thừa.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Không thể tạo nội dung, vui lòng thử lại.";
  } catch (error) {
    console.error("❌ Lỗi Gemini:", error);
    return "Lỗi kết nối AI. Vui lòng thử lại sau.";
  }
};

// ======================= CHAT WITH AI =======================

export const chatWithLiteraryExpert = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  if (!apiKey) {
    return "Lỗi: Thiếu API Key trên Vercel.";
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction:
          "Bạn là một chuyên gia văn học uyên bác. Hãy trả lời tinh tế, sâu sắc, dễ hiểu. Ngôn ngữ: Tiếng Việt.",
      },
    });

    const result = await chat.sendMessage({ message });

    return result.text || "Tôi chưa hiểu ý bạn, hãy nói rõ hơn nhé!";
  } catch (error) {
    console.error("❌ Lỗi chat Gemini:", error);
    return "Xin lỗi, tôi đang gặp sự cố. Bạn thử lại sau nhé!";
  }
};
