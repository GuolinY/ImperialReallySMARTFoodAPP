import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const IngredientsContext = createContext();
const IngredientsUpdateContext = createContext();

const ValidRecipeFiltersContext = createContext();
const ValidRecipeFiltersUpdateContext = createContext();

export function useIngredients() {
  return useContext(IngredientsContext);
}

export function useIngredientsUpdate() {
  return useContext(IngredientsUpdateContext);
}

export function useValidRecipeFilters() {
  return useContext(ValidRecipeFiltersContext);
}

export function useValidRecipeFiltersUpdate() {
  return useContext(ValidRecipeFiltersUpdateContext);
}

export const DEFAULT_FILTERS = {
  calories: [0, 5000],
  carbs: [0, 500],
  protein: [0, 500],
  fats: [0, 500],
  cooking_time: [0, 9000],
  halal: false,
  vegan: false,
  vegetarian: false,
  gluten_free: false,
  min_rating: 0,
  difficulty: {
    easy: true,
    medium: true,
    hard: true,
  },
};

export default function IngredientsProvider({ children }) {
  const [ingredientList, setIngredientList] = useState([]);
  const [validRecipeFilters, setValidRecipeFilters] = useState(DEFAULT_FILTERS);

  return (
    <IngredientsContext.Provider value={ingredientList}>
      <IngredientsUpdateContext.Provider value={setIngredientList}>
        <ValidRecipeFiltersContext.Provider value={validRecipeFilters}>
          <ValidRecipeFiltersUpdateContext.Provider
            value={setValidRecipeFilters}
          >
            {children}
          </ValidRecipeFiltersUpdateContext.Provider>
        </ValidRecipeFiltersContext.Provider>
      </IngredientsUpdateContext.Provider>
    </IngredientsContext.Provider>
  );
}

IngredientsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
