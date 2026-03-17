export function normalizeIngredient(value) {
  if (typeof value !== "string") {
    return ""
  }

  return value.trim().replace(/\s+/g, " ")
}

export function normalizeIngredients(values) {
  const uniqueIngredients = []
  const seen = new Set()

  for (const value of values) {
    const normalizedValue = normalizeIngredient(value)
    const normalizedKey = normalizedValue.toLowerCase()

    if (!normalizedValue || seen.has(normalizedKey)) {
      continue
    }

    seen.add(normalizedKey)
    uniqueIngredients.push(normalizedValue)
  }

  return uniqueIngredients
}
