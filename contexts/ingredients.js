import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const IngredientsContext = createContext();
const IngredientsUpdateContext = createContext();

const SubstitutionsContext = createContext();

const ValidRecipeFiltersContext = createContext();
const ValidRecipeFiltersUpdateContext = createContext();

const LoadingIngredientsContext = createContext();

export function useIngredients() {
  return useContext(IngredientsContext);
}

export function useIngredientsUpdate() {
  return useContext(IngredientsUpdateContext);
}

export function useSubstitutions() {
  return useContext(SubstitutionsContext);
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
  "flour",
  "sugar",
  "yeast",
  "baking soda",
  "baking powder",
  "salt",
  "pepper",
  "garlic",
  "water",
];

class TwoWayMap {
  constructor(map) {
    this.map = map;
    this.reverseMap = {};
    for (const key in map) {
      const value = map[key];
      this.reverseMap[value] = key;
    }
  }
  allSubs() {
    return [
      "soy sauce",
      "vinegar",
      "milk",
      "cream",
      "mayonnaise",
      "sour cream",
      "onion",
      "leek",
      "sugar",
      "honey",
      "coriander",
      "parsley",
      "raisin",
      "plum",
      "starch",
      "flour",
      "agar",
      "gelatin",
      "quinoa",
      "rice",
      "cauliflower",
      "potato",
      "nutmeg",
      "cinnamon",
      "kale",
      "spinach",
    ];
  }
  get(key) {
    return this.map[key];
  }
  revGet(key) {
    return this.reverseMap[key];
  }
  getSub(key) {
    const keyIngredient = key
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(" ")
      .filter((s) => s.length > 0);
    const keyLength = keyIngredient.length;
    const matchedSub = this.allSubs()
      .map((sub) => {
        const subIngredient = sub
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .split(" ")
          .filter((s) => s.length > 0);
        const subLength = subIngredient.length;
        const keyWindow = keyIngredient.slice(0, subLength);
        for (let i = 0; i < keyLength - subLength + 1; i++) {
          if (
            keyWindow.join("_") === subIngredient.join("_") ||
            keyWindow.join("_") === subIngredient.join("_").concat("s") ||
            keyWindow.join("_").concat("s") === subIngredient.join("_")
          ) {
            return sub in this.map ? this.map[sub] : this.reverseMap[sub];
          }
          keyWindow.shift();
          keyWindow.push(subIngredient[subLength + i]);
        }
        return null;
      })
      .filter((v) => v);
    return matchedSub[0];
  }
  isSub(key) {
    const keyIngredient = key
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(" ");
    const keyLength = keyIngredient.length;
    const containsSub = this.allSubs().some((sub) => {
      const subIngredient = sub
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(" ");
      const subLength = subIngredient.length;
      const keyWindow = keyIngredient.slice(0, subLength);
      for (let i = 0; i < keyLength - subLength + 1; i++) {
        if (
          keyWindow.join("_") === subIngredient.join("_") ||
          keyWindow.join("_") === subIngredient.join("_").concat("s") ||
          keyWindow.join("_").concat("s") === subIngredient.join("_")
        ) {
          return true;
        }
        keyWindow.shift();
        keyWindow.push(subIngredient[subLength + i]);
      }
      return false;
    });
    return containsSub;
  }
}

export const SUBSTITUTIONS = new TwoWayMap({
  "soy sauce": "vinegar",
  milk: "cream",
  mayonnaise: "sour cream",
  onion: "leek",
  sugar: "honey",
  coriander: "parsley",
  raisin: "plum",
  starch: "flour",
  agar: "gelatin",
  quinoa: "rice",
  cauliflower: "potato",
  nutmeg: "cinnamon",
  kale: "spinach",
});

export default function IngredientsProvider({ children }) {
  const [ingredientList, setIngredientList] = useState([]);
  const [substitutionsList, setSubstitutionsList] = useState([]);
  const [validRecipeFilters, setValidRecipeFilters] = useState(DEFAULT_FILTERS);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const updateIngredientList = (value) => {
    setIngredientList(value);
    sessionStorage.setItem("ingredientList", JSON.stringify(value));
    if (value?.length > 0) {
      setSubstitutionsList(
        value
          .filter((v) => SUBSTITUTIONS.isSub(v))
          .map((v) => SUBSTITUTIONS.getSub(v))
      );
    } else {
      setSubstitutionsList([]);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("ingredientList")) {
      console.log(sessionStorage.getItem("ingredientList"));
      updateIngredientList(
        JSON.parse(sessionStorage.getItem("ingredientList"))
      );
    } else {
      console.log("no ingredient list");
      updateIngredientList([]);
    }
    setLoadingIngredients(false);
  }, []);

  return (
    <IngredientsContext.Provider value={ingredientList}>
      <IngredientsUpdateContext.Provider value={updateIngredientList}>
        <SubstitutionsContext.Provider value={substitutionsList}>
          <ValidRecipeFiltersContext.Provider value={validRecipeFilters}>
            <ValidRecipeFiltersUpdateContext.Provider
              value={setValidRecipeFilters}
            >
              <LoadingIngredientsContext.Provider value={loadingIngredients}>
                {children}
              </LoadingIngredientsContext.Provider>
            </ValidRecipeFiltersUpdateContext.Provider>
          </ValidRecipeFiltersContext.Provider>
        </SubstitutionsContext.Provider>
      </IngredientsUpdateContext.Provider>
    </IngredientsContext.Provider>
  );
}

IngredientsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
