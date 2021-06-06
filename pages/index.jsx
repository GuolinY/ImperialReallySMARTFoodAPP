import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Card,
  CardHeader,
} from "@material-ui/core";
import Link from "next/link";
import { DeleteOutlined } from "@material-ui/icons";
import { useIngredients, useIngredientsUpdate } from "../contexts/ingredients";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
    [theme.breakpoints.down("xs")]: {
      fontSize: 64,
    },
  },
  root: {
    width: "100%",
  },
  textField: {
    width: "60%",
    maxWidth: theme.spacing(120),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    marginTop: "1rem",
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
  youHaveEntered: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  showRecipeButton: {
    marginBottom: "1rem",
  },
}));

export default function Home() {
  const classes = useStyles();

  const KEYCODE_ENTER = 13;

  const [ingredientInput, setIngredientInput] = useState("");

  const ingredients = useIngredients();
  const setIngredients = useIngredientsUpdate();

  const handleIngredientInput = (e) => {
    setIngredientInput(e.target.value);
  };

  const handleIngredientInputEntry = (e) => {
    if (e.keyCode == KEYCODE_ENTER) {
      if (ingredientInput) {
        setIngredients([...ingredients, ingredientInput]);
        setIngredientInput("");
      }
    }
  };

  const handleRemoveIngredient = (e, index) => {
    const newIngredients = ingredients;
    newIngredients.splice(index, 1);
    setIngredients([...newIngredients]);
  };

  return (
    <Layout title="A Really Smart Food App" flex>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.title} gutterBottom>
            A Really Smart Food App
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Here to suggest you recipes for the food in your kitchen!
          </Typography>
        </Grid>
        <Grid item container direction="column" justify="center">
          <Grid item xs={12}>
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
          </Grid>
          {ingredients?.length > 0 && (
            <Grid className={classes.showRecipeButton} item>
              <Link href="/valid-recipes" passHref>
                <Button variant="outlined">Show me recipes!</Button>
              </Link>
            </Grid>
          )}
        </Grid>
        {ingredients?.length > 0 && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            style={{ maxWidth: "60%" }}
            spacing={3}
          >
            <Grid item className={classes.youHaveEntered} xs={12}>
              <Typography gutterBottom>You have entered:</Typography>
            </Grid>
            {ingredients.map((ingredient, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      <IconButton
                        aria-label="delete ingredient"
                        onClick={(e) => handleRemoveIngredient(e, i)}
                        className={classes.removeEnteredIngredientButton}
                      >
                        <DeleteOutlined />
                      </IconButton>
                      {ingredient}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}
