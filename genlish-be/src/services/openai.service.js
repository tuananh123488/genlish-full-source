'use strict'

const { default: OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAIKEY });

class OpenAIService {

    ask = async (ask) => {
        // const completion = await openai.chat.completions.create({
        //     messages: [{
        //         role: "system", content: "'Hello:Xin chào', 'Hi:Chào', 'Good morning:Chào buổi sáng', 'Good afternoon:Chào buổi chiều', 'Good evening:Chào buổi tối', 'Goodbye:Tạm biệt', 'Bye:Tạm biệt', 'How are you?:Bạn có khỏe không?', 'I’m fine, thank you:Tôi khỏe, cảm ơn', 'What’s your name?:Bạn tên là gì?', 'My name is Emma:Tên tôi là Emma'"
        //             + 'chỉ được tạo 1 câu hỏi Tiếng Anh dựa vào từ vựng trên và trả lời tiếng việt'
        //             + 'dạng bài tập `điền từ vào chỗ trống` tạo 1 câu tiếng anh có khuyết 1 từ , trả về chuỗi JSON ví dụ {question : `i am ___, thank you`, vietnamese : `Tôi khỏe, cảm ơn`} và đừng nói thêm gì'
        //     }],
        //     model: "gpt-3.5-turbo",
        // });
        const completion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: ask
            }],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content
    }

}

module.exports = new OpenAIService()