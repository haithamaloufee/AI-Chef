import React from "react"
import Recipe from "./main_components/Recipe.jsx"
import RecipeSkeleton from "./main_components/RecipeSkeleton.jsx"
import IngredientsList from "./main_components/IngredientsList.jsx"
import { getRecipeFromGemini } from "../geminiApi.js"
import { normalizeIngredient } from "../utils/ingredients.js"

export default function Main() {
  const [ingredients, setIngredients] = React.useState([])
  const [recipe, setRecipe] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const resultRef = React.useRef(null)

  React.useEffect(() => {
    if ((isLoading || recipe !== "" || errorMessage !== "") && resultRef.current !== null) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [isLoading, recipe, errorMessage])

  function addIngredient(rawIngredient) {
    const nextIngredient = normalizeIngredient(rawIngredient)

    if (!nextIngredient) {
      return { error: "Please enter an ingredient first." }
    }

    const ingredientAlreadyExists = ingredients.some(
      (ingredient) => ingredient.toLowerCase() === nextIngredient.toLowerCase()
    )

    if (ingredientAlreadyExists) {
      return { error: `"${nextIngredient}" is already in your list.` }
    }

    setIngredients((prevIngredients) => [...prevIngredients, nextIngredient])
    setRecipe("")
    setErrorMessage("")

    return { ok: true }
  }

  function removeIngredient(ingredientToRemove) {
    if (isLoading) {
      return
    }

    setIngredients((prevIngredients) =>
      prevIngredients.filter(
        (ingredient) => ingredient.toLowerCase() !== ingredientToRemove.toLowerCase()
      )
    )
    setRecipe("")
    setErrorMessage("")
  }

  function clearIngredients() {
    if (isLoading) {
      return
    }

    setIngredients([])
    setRecipe("")
    setErrorMessage("")
  }

  async function getRecipe() {
    if (ingredients.length < 3 || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setRecipe("")

    try {
      const recipeMarkdown = await getRecipeFromGemini(ingredients)
      setRecipe(recipeMarkdown)
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate a recipe right now."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <IngredientsList
        ingredients={ingredients}
        addIngredient={addIngredient}
        removeIngredient={removeIngredient}
        clearIngredients={clearIngredients}
        getRecipe={getRecipe}
        isLoading={isLoading}
      />

      <div ref={resultRef}>
        {isLoading ? <RecipeSkeleton /> : null}
        {!isLoading && recipe ? <Recipe recipe={recipe} /> : null}
        {!isLoading && errorMessage ? (
          <p className="recipe-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </main>
  )
}
