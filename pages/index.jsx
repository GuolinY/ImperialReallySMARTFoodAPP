import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
  },
  root: {
    width: "100%",
  },
  textField: {
    width: "60%",
    maxWidth: theme.spacing(64),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    marginBottom: "1rem",
  },
  ingredientInput: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    width: "100%",
    margin: theme.spacing(2),
  },
  enteredIngredient: {
    margin: theme.spacing(0, 4),
    //width: theme.spacing(16),
    //maxWidth: theme.spacing(16),
  },
  removeEnteredIngredientButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  enteredIngredients: {
    display: "flex",
    flexFlow: "row wrap",
    width: "60%",
    maxWidth: theme.spacing(120),
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

  const handleRemoveIngredient = (e, index) => {
    const newIngredientList = ingredientList;
    newIngredientList.splice(index, 1);
    setIngredientList([...newIngredientList]);
  };

  return (
    <Layout title="A Really Smart Food App" home>
      <Typography variant="h1" className={classes.title}>
        A Really Smart Food App
      </Typography>
      <p>Here to suggest you recipes for the food in your kitchen!</p>
      <div className={classes.ingredientInput}>
        <TextField
          variant="outlined"
          color="secondary"
          id="ingredient-input"
          label="What ingredients do you have?"
          value={ingredientInput}
          onChange={handleIngredientInput}
          onKeyDown={handleIngredientInputEntry}
          className={classes.textField}
        />
        {ingredientList.length > 0 && (
          <Link
            href={{
              pathname: "/valid-recipes",
              query: { ingredientLisst: ingredientList.join("-") },
            }}
          >
            <Button variant="outlined">Show me recipes!</Button>
          </Link>
        )}
      </div>
      {ingredientList.length > 0 && (
        <>
          <Typography variant="body1" gutterBottom>
            You have entered:
          </Typography>
          <Grid
            container
            className={classes.enteredIngredients}
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {ingredientList.map((ingredient, i) => (
              <Grid item>
                <Typography key={i} className={classes.enteredIngredient}>
                  <IconButton
                    aria-label="delete ingredient"
                    onClick={(e) => handleRemoveIngredient(e, i)}
                    className={classes.removeEnteredIngredientButton}
                  >
                    <ClearIcon />
                  </IconButton>
                  {ingredient}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Layout>
  );
}
