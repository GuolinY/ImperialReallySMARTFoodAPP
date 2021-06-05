import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const IngredientsContext = createContext();
const IngredientsUpdateContext = createContext();

export function useIngredients() {
  return useContext(IngredientsContext);
}

export function useIngredientsUpdate() {
  return useContext(IngredientsUpdateContext);
}

export default function IngredientsProvider({ children }) {
  const [ingredientList, setIngredientList] = useState([]);

  return (
    <IngredientsContext.Provider value={ingredientList}>
      <IngredientsUpdateContext.Provider value={setIngredientList}>
        {children}
      </IngredientsUpdateContext.Provider>
    </IngredientsContext.Provider>
  );
}

IngredientsProvider.propTypes = {
  children: PropTypes.elementType.isRequired,
};
