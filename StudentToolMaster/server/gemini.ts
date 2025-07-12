import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeArticle(text: string): Promise<string> {
    const prompt = `You are an AI academic assistant helping students with their studies. Please provide a helpful, accurate, and educational response to the following question or request:

${text}

If this is about:
- Math/Science: Provide step-by-step explanations
- Programming: Include code examples and explanations
- Writing: Offer structure and improvement suggestions
- Study advice: Give practical, actionable tips
- General questions: Provide clear, informative answers

Keep responses concise but thorough, and always encourage learning.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "I'm here to help! Could you please rephrase your question?";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "I'm having trouble connecting right now. Please try again in a moment, or rephrase your question.";
    }
}

export interface Sentiment {
    rating: number;
    confidence: number;
}

export async function analyzeSentiment(text: string): Promise<Sentiment> {
    try {
        const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating
from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: 
{'rating': number, 'confidence': number}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        rating: { type: "number" },
                        confidence: { type: "number" },
                    },
                    required: ["rating", "confidence"],
                },
            },
            contents: text,
        });

        const rawJson = response.text;

        console.log(`Raw JSON: ${rawJson}`);

        if (rawJson) {
            const data: Sentiment = JSON.parse(rawJson);
            return data;
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        throw new Error(`Failed to analyze sentiment: ${error}`);
    }
}

export async function analyzeImage(jpegImagePath: string): Promise<string> {
    const imageBytes = fs.readFileSync(jpegImagePath);

    const contents = [
        {
            inlineData: {
                data: imageBytes.toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        `Analyze this image in detail and describe its key elements, context,
and any notable aspects.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "";
}

export async function analyzeVideo(mp4VideoPath: string): Promise<string> {
    const videoBytes = fs.readFileSync(mp4VideoPath);

    const contents = [
        {
            inlineData: {
                data: videoBytes.toString("base64"),
                mimeType: "video/mp4",
            },
        },
        `Analyze this video in detail and describe its key elements, context,
    and any notable aspects.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "";
}

export async function generateImage(
    prompt: string,
    imagePath: string,
): Promise<void> {
    try {
        // IMPORTANT: only this gemini model supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            return;
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            return;
        }

        for (const part of content.parts) {
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(imagePath, imageData);
                console.log(`Image saved as ${imagePath}`);
            }
        }
    } catch (error) {
        throw new Error(`Failed to generate image: ${error}`);
    }
}

// Additional academic helper functions
export async function explainConcept(concept: string, subject: string): Promise<string> {
    const prompt = `As an educational AI assistant, please explain the concept of "${concept}" in ${subject}. 
    
Please provide:
1. A clear, simple definition
2. Key points or components
3. A practical example or analogy
4. How it relates to other concepts in ${subject}

Make it understandable for students while being accurate and comprehensive.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "I couldn't generate an explanation. Please try rephrasing your question.";
    } catch (error) {
        console.error("Concept explanation error:", error);
        return "I'm having trouble explaining this concept right now. Please try again.";
    }
}

export async function generateQuizQuestions(topic: string, difficulty: string, count: number = 5): Promise<string> {
    const prompt = `Generate ${count} ${difficulty} level quiz questions about "${topic}". 
    
Format each question as:
Q: [Question]
A: [Answer]
Explanation: [Brief explanation]

Make sure questions are educational, clear, and appropriate for the ${difficulty} difficulty level.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "I couldn't generate quiz questions. Please try again with a different topic.";
    } catch (error) {
        console.error("Quiz generation error:", error);
        return "I'm having trouble generating quiz questions right now. Please try again.";
    }
}

export async function provideFeedback(studentWork: string, subject: string): Promise<string> {
    const prompt = `As an educational AI assistant, please review this student work in ${subject} and provide constructive feedback:

"${studentWork}"

Please provide:
1. What the student did well
2. Areas for improvement
3. Specific suggestions for enhancement
4. Encouragement and next steps

Be supportive, specific, and educational in your feedback.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "I couldn't provide feedback right now. Please try again.";
    } catch (error) {
        console.error("Feedback generation error:", error);
        return "I'm having trouble providing feedback right now. Please try again.";
    }
}
