import React from "react"

export default function IngredientsList({
  ingredients,
  addIngredient,
  removeIngredient,
  clearIngredients,
  getRecipe,
  isLoading,
}) {
  const [ingredientInput, setIngredientInput] = React.useState("")
  const [inputError, setInputError] = React.useState("")

  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient.toLowerCase()} className="ingredient-list-item">
      <span>{ingredient}</span>
      <button
        type="button"
        className="ingredient-remove-button"
        onClick={() => removeIngredient(ingredient)}
        disabled={isLoading}
        aria-label={`Remove ${ingredient}`}
      >
        Remove
      </button>
    </li>
  ))

  function handleSubmit(event) {
    event.preventDefault()

    const result = addIngredient(ingredientInput)

    if (result?.error) {
      setInputError(result.error)
      return
    }

    setIngredientInput("")
    setInputError("")
  }

  function handleInputChange(event) {
    setIngredientInput(event.target.value)

    if (inputError) {
      setInputError("")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. potato"
          aria-label="Add ingredient"
          name="ingredient"
          value={ingredientInput}
          onChange={handleInputChange}
          disabled={isLoading}
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading || ingredientInput.trim() === ""}>
          + Add ingredient
        </button>
      </form>
      {inputError ? (
        <p className="ingredient-error" role="alert">
          {inputError}
        </p>
      ) : null}

      <section>
        {ingredients.length > 0 ? (
          <div className="ingredients-header">
            <h2>ingredients on hand :</h2>
            <button
              type="button"
              className="clear-ingredients-button"
              onClick={clearIngredients}
              disabled={isLoading}
            >
              Clear all
            </button>
          </div>
        ) : null}
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
            <button type="button" onClick={getRecipe} disabled={isLoading}>
              {isLoading ? "Generating..." : "Get a recipe"}
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}
