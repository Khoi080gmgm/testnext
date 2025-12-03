import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// ✅ Cách khuyên dùng: cấu hình API key trên Vercel (Project Settings → Environment Variables)
//   Tên biến: NEXT_PUBLIC_GENAI_API_KEY
const apiKey =
  process.env.NEXT_PUBLIC_GENAI_API_KEY || ""; 

// ❌ Cách KHÔNG khuyến khích: ghi thẳng API key vào code
// const apiKey = "YOUR_GOOGLE_GENAI_API_KEY_HERE";

const ai = new GoogleGenAI({ apiKey });

export const generateEssay = async (
  topic: string,
  outline: string,
  wordCount: number,
  language: string
): Promise<string> => {
  if (!apiKey) {
    return "Lỗi: Chưa cấu hình API Key. Vui lòng kiểm tra cài đặt trên Vercel (Environment Variables).";
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
    Hãy đóng vai một nhà văn chuyên nghiệp, viết một bài văn hoàn chỉnh bằng ${langText} về chủ đề: "${topic}".
    
    Yêu cầu cụ thể:
    - Độ dài khoảng ${wordCount} từ (hoặc ký tự đối với tiếng Trung/Nhật).
    - ${
      outline
        ? `Dựa trên dàn ý chi tiết sau: ${outline}`
        : "Hãy tự xây dựng dàn ý mạch lạc, sáng tạo và có chiều sâu."
    }
    - Trình bày rõ ràng, chia đoạn hợp lý.
    - Văn phong sang trọng, trôi chảy, giàu hình ảnh và cảm xúc.
    - Không cần tiêu đề ở đầu, chỉ trả về nội dung chính của bài văn.
  `;

  try {
    // Dùng gemini-2.5-flash để sinh văn bản nhanh
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Tuỳ SDK, có thể là response.text hoặc response.candidates[0].content...
    // Ở đây giữ nguyên như bạn đang dùng
    // @ts-ignore (nếu TypeScript kêu ca)
    return response.text || "Không thể tạo nội dung. Vui lòng thử lại.";
  } catch (error) {
    console.error("Error generating essay:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};

export const chatWithLiteraryExpert = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  if (!apiKey) {
    return "Lỗi: Chưa cấu hình API Key. Vui lòng kiểm tra cài đặt trên Vercel (Environment Variables).";
  }

  try {
    // Dùng gemini-3-pro-preview cho các câu hỏi phân tích văn học phức tạp
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
        systemInstruction:
          "Bạn là một chuyên gia văn học uyên bác, am hiểu các tác phẩm văn học trong và ngoài nước. Hãy trả lời người dùng một cách tinh tế, sâu sắc nhưng vẫn thân thiện. Sử dụng tiếng Việt.",
      },
    });

    const result = await chat.sendMessage({ message });

    // @ts-ignore (nếu TypeScript báo không có text)
    return result.text || "Tôi không hiểu ý bạn, hãy nói rõ hơn nhé.";
  } catch (error) {
    console.error("Error in chat:", error);
    return "Xin lỗi, tôi đang gặp chút sự cố. Vui lòng thử lại sau.";
  }
};
