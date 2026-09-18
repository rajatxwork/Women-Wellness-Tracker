import { LibrarySection } from "@/components/library/library-section";
import { RecipeCards } from "@/components/library/recipe-cards";

export function RecipesChapter() {
  return (
    <LibrarySection
      id="recipes-all"
      title="25 recipes"
      subtitle="Filter by meal type, check off ingredients as you shop, and tap Method to cook."
    >
      <RecipeCards />
    </LibrarySection>
  );
}
