import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Home.module.css";
import Layout from "../components/_Layout";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  textField: {
    width: "60%",
    maxWidth: theme.spacing(60),
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
  enteredIngredients: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
  },
}));

export default function Home() {
  const classes = useStyles();

  const KEYCODE_ENTER = 13;

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientList, setIngredientList] = useState([]);

  const handleIngredientInput = (event) => {
    setIngredientInput(event.target.value);
  };

  const handleIngredientInputEntry = (event) => {
    if (event.keyCode == KEYCODE_ENTER) {
      if (ingredientInput) {
        setIngredientList([...ingredientList, ingredientInput]);
        setIngredientInput("");
      }
    }
  };

  const handleShowMeRecipes = (event) => {
    console.log("Show me recipes pressed");
  };

  const EnteredIngredients = () => {
    return (
      <>
        <Typography variant="subtitle1">You have entered:</Typography>
        <div className={classes.enteredIngredients}>
          {ingredientList.map((ingredient, i) => (
            <RemovableIngredient key={i} ingredient={ingredient} index={i} />
          ))}
        </div>
      </>
    );
  };

  const RemovableIngredient = (props) => {
    const { index, ingredient } = props;
    return (
      <div style={{ margin: 3 }}>
        {ingredient}
        <IconButton
          aria-label="delete"
          value={index}
          onClick={handleRemoveIngredient}
        >
          <ClearIcon />
        </IconButton>
      </div>
    );
  };

  RemovableIngredient.propTypes = {
    ingredient: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
  };

  const handleRemoveIngredient = (e) => {
    // e.preventDefault();
    console.log(e.target.value);
  };

  return (
    <Layout>
      <h2 className={styles.title}>A Really Smart Food App</h2>
      <div className={classes.ingredientInput}>
        <TextField
          id="ingredient-input"
          label="What ingredients do you have?"
          value={ingredientInput}
          onChange={handleIngredientInput}
          onKeyDown={handleIngredientInputEntry}
          className={classes.textField}
        />
        <Button onClick={handleShowMeRecipes}>Show me recipes!</Button>
      </div>
      {ingredientList.length > 0 && <EnteredIngredients />}
    </Layout>
  );
}
