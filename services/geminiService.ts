import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEssay = async (
  topic: string,
  outline: string,
  wordCount: number,
  language: string
): Promise<string> => {
  if (!apiKey) {
    return "Lỗi: Chưa cấu hình API Key. Vui lòng kiểm tra cài đặt.";
  }

  const langMap: Record<string, string> = {
    'vi': 'Tiếng Việt',
    'en': 'Tiếng Anh',
    'zh': 'Tiếng Trung (Giản thể)',
    'ru': 'Tiếng Nga',
    'ja': 'Tiếng Nhật',
    'fr': 'Tiếng Pháp'
  };

  const langText = langMap[language] || 'Tiếng Việt';
  
  const prompt = `
    Hãy đóng vai một nhà văn chuyên nghiệp, viết một bài văn hoàn chỉnh bằng ${langText} về chủ đề: "${topic}".
    
    Yêu cầu cụ thể:
    - Độ dài khoảng ${wordCount} từ (hoặc ký tự đối với tiếng Trung/Nhật).
    - ${outline ? `Dựa trên dàn ý chi tiết sau: ${outline}` : 'Hãy tự xây dựng dàn ý mạch lạc, sáng tạo và có chiều sâu.'}
    - Trình bày rõ ràng, chia đoạn hợp lý.
    - Văn phong sang trọng, trôi chảy, giàu hình ảnh và cảm xúc.
    - Không cần tiêu đề ở đầu, chỉ trả về nội dung chính của bài văn.
  `;

  try {
    // Using gemini-2.5-flash for fast text generation
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
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
    return "Lỗi: Chưa cấu hình API Key.";
  }

  try {
    // Using gemini-3-pro-preview for complex reasoning in literature
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "Bạn là một chuyên gia văn học uyên bác, am hiểu các tác phẩm văn học trong và ngoài nước. Hãy trả lời người dùng một cách tinh tế, sâu sắc nhưng vẫn thân thiện. Sử dụng tiếng Việt.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Tôi không hiểu ý bạn, hãy nói rõ hơn nhé.";
  } catch (error) {
    console.error("Error in chat:", error);
    return "Xin lỗi, tôi đang gặp chút sự cố. Bạn chờ lát nhé!";
  }
};