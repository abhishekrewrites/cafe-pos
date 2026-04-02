import { IngredientForm } from "./IngredientForm"

export default function NewIngredientPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Ingredient</h1>
        <p className="text-muted-foreground mt-1">Register a new raw material to track its stock levels.</p>
      </div>
      
      <IngredientForm />
    </div>
  )
}
