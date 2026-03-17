import React from "react"
import Resipe from "./main_components/Recipe.jsx"
import RecipeSkeleton from "./main_components/RecipeSkeleton.jsx"
import IngredientsList from "./main_components/IngredientsList.jsx"
import { getRecipeFromGemini } from "../geminiApi.js"

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
      setErrorMessage("Error generating recipe. Please check your key and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <IngredientsList
        ingredients={ingredients}
        setIngredients={setIngredients}
        getRecipe={getRecipe}
        isLoading={isLoading}
      />

      <div ref={resultRef}>
        {isLoading ? <RecipeSkeleton /> : null}
        {!isLoading && recipe ? <Resipe recipe={recipe} /> : null}
        {!isLoading && errorMessage ? (
          <p className="recipe-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </main>
  )
}
