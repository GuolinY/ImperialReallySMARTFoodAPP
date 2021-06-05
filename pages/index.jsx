import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { DeleteOutlined } from "@material-ui/icons";
import { useIngredients, useIngredientsUpdate } from "../contexts/ingredients";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
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
  cardHeaderAction: {
    marginTop: "0",
  },
}));

export default function Home() {

  const classes = useStyles();
  const router = useRouter();

  const KEYCODE_ENTER = 13;

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientList, setIngredientList] = useState(
    router?.query?.ingredientList
      ? router?.query?.ingredientList.split("_")
      : []
  );

  const ingredients = useIngredients();
  const ingredientsUpdate = useIngredientsUpdate();

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
          {ingredientList.length > 0 && (
            <Grid className={classes.showRecipeButton} item>
              <Link
                href={{
                  pathname: "/valid-recipes",
                  query: { ingredientList: ingredientList.join("_") },
                }}
                passHref
              >
                <Button variant="outlined">Show me recipes!</Button>
              </Link>
            </Grid>
          )}
        </Grid>
        {ingredientList.length > 0 && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            style={{ maxWidth: "60%" }}
            spacing={3}
          >
            <Grid item className={classes.youHaveEntered}>
              <Typography gutterBottom>You have entered:</Typography>
            </Grid>
            {ingredientList.map((ingredient, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card variant="outlined">
                  <CardHeader
                    title={ingredient}
                    titleTypographyProps={{ variant: "h6", noWrap: true }}
                    action={
                      <IconButton
                        aria-label="delete ingredient"
                        onClick={(e) => handleRemoveIngredient(e, i)}
                        className={classes.removeEnteredIngredientButton}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    }
                    classes={{
                      action: classes.cardHeaderAction,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}
