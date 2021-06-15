import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const IngredientsContext = createContext();
const IngredientsUpdateContext = createContext();

const ValidRecipeFiltersContext = createContext();
const ValidRecipeFiltersUpdateContext = createContext();

const LoadingIngredientsContext = createContext();

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

export function useLoadingIngredients() {
  return useContext(LoadingIngredientsContext);
}

export const DEFAULT_FILTERS = {
  calories: [0, 5000],
  carbs: [0, 500],
  protein: [0, 500],
  fats: [0, 500],
  cooking_time: [0, 9000],
  vegan: false,
  vegetarian: false,
  min_rating: 0,
  difficulty: {
    easy: true,
    medium: true,
    hard: true,
  },
};

export const PANTRY_INGREDIENTS = [
  "oil",
  "vinegar",
  "flour",
  "sugar",
  "yeast",
  "baking soda",
  "baking powder",
  "salt",
  "pepper",
  "water",
];

export default function IngredientsProvider({ children }) {
  const [ingredientList, setIngredientList] = useState([]);
  const [validRecipeFilters, setValidRecipeFilters] = useState(DEFAULT_FILTERS);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const updateIngredientList = (value) => {
    setIngredientList(value);
    sessionStorage.setItem("ingredientList", JSON.stringify(value));
  };

  useEffect(() => {
    if (sessionStorage.getItem("ingredientList")) {
      console.log(sessionStorage.getItem("ingredientList"));
      setIngredientList(JSON.parse(sessionStorage.getItem("ingredientList")));
    } else {
      console.log("no ingredient list");
      setIngredientList([]);
    }
    setLoadingIngredients(false);
  }, []);

  return (
    <IngredientsContext.Provider value={ingredientList}>
      <IngredientsUpdateContext.Provider value={updateIngredientList}>
        <ValidRecipeFiltersContext.Provider value={validRecipeFilters}>
          <ValidRecipeFiltersUpdateContext.Provider
            value={setValidRecipeFilters}
          >
            <LoadingIngredientsContext.Provider value={loadingIngredients}>
              {children}
            </LoadingIngredientsContext.Provider>
          </ValidRecipeFiltersUpdateContext.Provider>
        </ValidRecipeFiltersContext.Provider>
      </IngredientsUpdateContext.Provider>
    </IngredientsContext.Provider>
  );
}

IngredientsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
