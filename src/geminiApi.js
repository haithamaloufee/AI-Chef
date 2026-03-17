import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  GoogleGenerativeAIResponseError,
} from "@google/generative-ai"
import { normalizeIngredients } from "./utils/ingredients.js"

const apiKey = import.meta.env.VITE_GEMINI_KEY?.trim()
const modelName = "gemini-2.5-flash-lite"

export async function getRecipeFromGemini(ingredientsArr) {
  if (!apiKey) {
    throw new Error(getMissingApiKeyMessage())
  }

  const ingredients = normalizeIngredients(ingredientsArr)

  if (ingredients.length < 3) {
    throw new Error("Add at least 3 valid ingredients before generating a recipe.")
  }

  const ingredientsString = ingredients.join(", ")
  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
    })

    const result = await model.generateContent(`
You are a helpful chef.
I have these ingredients: ${ingredientsString}.

Create one practical recipe in Markdown with:
- A title
- A short intro
- An ingredients list
- Numbered cooking steps
- Optional quick tips
`)

    const response = await result.response
    const recipeText = response.text().trim()

    if (!recipeText) {
      throw new Error("Gemini returned an empty recipe. Try changing the ingredient list and try again.")
    }

    return recipeText
  } catch (error) {
    console.error("Gemini recipe generation failed:", error)
    throw new Error(getGeminiErrorMessage(error))
  }
}

function getGeminiErrorMessage(error) {
  if (error instanceof GoogleGenerativeAIFetchError) {
    switch (error.status) {
      case 400:
        return "Gemini rejected the request. Check the selected model and request format."
      case 403:
        return "Gemini denied access. Verify that your API key is valid and allowed for this browser origin."
      case 404:
        return `The Gemini model "${modelName}" is unavailable for this key.`
      case 429:
        return "Gemini rate limit reached. Wait a moment and try again."
      case 500:
      case 503:
        return "Gemini is temporarily unavailable. Try again in a moment."
      default:
        return cleanGeminiMessage(error.message) || "The Gemini request failed."
    }
  }

  if (error instanceof GoogleGenerativeAIResponseError) {
    return (
      cleanGeminiMessage(error.message) ||
      "Gemini could not return recipe text for this request."
    )
  }

  if (error instanceof Error) {
    if (error.message.includes("fetch failed")) {
      return "The network request to Gemini failed. Check your internet connection and API key restrictions."
    }

    return cleanGeminiMessage(error.message) || "Unable to generate a recipe right now."
  }

  return "Unable to generate a recipe right now."
}

function cleanGeminiMessage(message) {
  if (!message) {
    return ""
  }

  return message
    .replace(/^\[GoogleGenerativeAI Error\]:\s*/i, "")
    .replace(/^Error fetching from .*?: \[[^\]]+\]\s*/i, "")
    .trim()
}

function getMissingApiKeyMessage() {
  if (import.meta.env.PROD) {
    return (
      "Missing Gemini API key in this deployed build. Add VITE_GEMINI_KEY in your hosting environment settings " +
      "(for Vercel: Project Settings -> Environment Variables), then redeploy."
    )
  }

  return "Missing Gemini API key. Add VITE_GEMINI_KEY to .env and restart Vite."
}
