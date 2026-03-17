import React from "react"

export default function IngredientsList({
  ingredients,
  setIngredients,
  getRecipe,
  isLoading,
}) {
  const ingredientsListItems = ingredients.map((ingredient, index) => (
    <li key={index}>{ingredient}</li>
  ))

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient")
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient])
  }

  return (
    <>
      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. potato"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>+ Add ingredient</button>
      </form>

      <section>
        {ingredients.length > 0 ? <h2>ingredients on hand :</h2> : null}
        <ul className="ingredients-list">{ingredientsListItems}</ul>

        {ingredients.length > 2 ? (
          <div className="get-recipe-container" aria-busy={isLoading}>
            <div>
              <h3>Ready for a recipe?</h3>
              <p>
                {isLoading
                  ? "Chef Haitham is preparing your recipe..."
                  : "Generate a recipe from your list of ingredients."}
              </p>
            </div>
            <button onClick={getRecipe} disabled={isLoading}>
              {isLoading ? "Generating..." : "Get a recipe"}
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}
