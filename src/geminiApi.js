import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = import.meta.env.VITE_GEMINI_KEY?.trim()

export async function getRecipeFromGemini(ingredientsArr) {
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Set VITE_GEMINI_KEY before generating recipes.")
  }

  const ingredientsString = ingredientsArr.join(", ")
  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    })

    const result = await model.generateContent(
      `I have ${ingredientsString}. Give me a recipe and be helpfull in Markdown format.`
    )

    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini recipe generation failed:", error)
    throw error
  }
}
