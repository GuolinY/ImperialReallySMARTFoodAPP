import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Home.module.css";
import Layout from "../components/_Layout";
import { TextField, Button, Typography, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  textField: {
    width: "60%",
    maxWidth: theme.spacing(64),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  ingredientInput: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    width: "100%",
    margin: theme.spacing(2),
  },
  enteredIngredient: {
    margin: theme.spacing(0, 3),
  },
  removeEnteredIngredientButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  enteredIngredients: {
    display: "flex",
    flexFlow: "row wrap",
    width: "60%",
    maxWidth: theme.spacing(64),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  const KEYCODE_ENTER = 13;

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientList, setIngredientList] = useState([]);

  const handleIngredientInput = (e) => {
    setIngredientInput(e.target.value);
  };

  const handleIngredientInputEntry = (e) => {
    if (e.keyCode == KEYCODE_ENTER) {
      if (ingredientInput) {
        setIngredientList([...ingredientList, ingredientInput]);
        setIngredientInput("");
      }
    }
  };

  const handleShowMeRecipes = () => {
    console.log("Show me recipes pressed");
  };

  const handleRemoveIngredient = (e, index) => {
    const newIngredientList = ingredientList;
    newIngredientList.splice(index, 1);
    setIngredientList([...newIngredientList]);
  };

  return (
    <Layout>
      <h2 className={styles.title}>A Really Smart Food App</h2>
      <p>Here to suggest you recipes for the food in your kitchen!</p>
      <div className={classes.ingredientInput}>
        <TextField
          id="ingredient-input"
          label="What ingredients do you have?"
          value={ingredientInput}
          onChange={handleIngredientInput}
          onKeyDown={handleIngredientInputEntry}
          className={classes.textField}
        />
        {ingredientList.length > 0 && (
          <Button onClick={handleShowMeRecipes}>Show me recipes!</Button>
        )}
      </div>
      {ingredientList.length > 0 && (
        <>
          <Typography variant="subtitle1">You have entered:</Typography>
          <div className={classes.enteredIngredients}>
            {ingredientList.map((ingredient, i) => (
              <div key={i} className={classes.enteredIngredient}>
                {ingredient}
                <IconButton
                  aria-label="delete ingredient"
                  onClick={(e) => handleRemoveIngredient(e, i)}
                  className={classes.removeEnteredIngredientButton}
                >
                  <ClearIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
