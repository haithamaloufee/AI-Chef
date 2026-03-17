export default function RecipeSkeleton() {
  return (
    <section
      className="suggested-recipe-container recipe-skeleton"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="skeleton-block skeleton-title"></div>
      <div className="skeleton-block skeleton-line"></div>
      <div className="skeleton-block skeleton-line"></div>
      <div className="skeleton-block skeleton-line skeleton-line--short"></div>
      <div className="skeleton-block skeleton-card"></div>
    </section>
  )
}
