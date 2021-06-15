import React, { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import Link from "next/link";
import { DeleteOutlined } from "@material-ui/icons";
import {
  useIngredients,
  useIngredientsUpdate,
  PANTRY_INGREDIENTS,
} from "../contexts/ingredients";
import AddIcon from "@material-ui/icons/Add";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import InfoIcon from "@material-ui/icons/Info";

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
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

export default function Home() {
  const classes = useStyles();

  const KEYCODE_ENTER = 13;

  const [ingredientInput, setIngredientInput] = useState("");

  const ingredients = useIngredients();
  const setIngredients = useIngredientsUpdate();

  const [session, loading] = useSession();

  const handleIngredientInput = (e) => {
    setIngredientInput(e.target.value);
  };

  const addIngredient = () => {
    if (ingredientInput) {
      const ingredientToAdd = ingredientInput.trim().toLowerCase();
      if (!ingredients.includes(ingredientToAdd)) {
        setIngredients([...ingredients, ingredientToAdd]);
      }
      setIngredientInput("");
    }
  };

  const handleIngredientInputEntry = (e) => {
    if (e.keyCode == KEYCODE_ENTER) {
      addIngredient();
    }
  };

  const handleRemoveIngredient = (e, index) => {
    const newIngredients = ingredients;
    newIngredients.splice(index, 1);
    setIngredients([...newIngredients]);
  };

  const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };

    return [htmlElRef, setFocus];
  };

  const [inputRef, setInputFocus] = useFocus();

  useEffect(() => {
    if (!loading) {
      console.log(session);
    }
  }, [loading]);

  return (
    <Layout title="A Really Smart Food App" home>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.title} gutterBottom>
            A Really Smart Food App
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h6" gutterBottom>
              Here to suggest you recipes for the food in your kitchen!
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip
              placement="top"
              title={`You should have these basic things in your kitchen: ${PANTRY_INGREDIENTS.join(
                ", "
              )}`}
              interactive
            >
              <InfoIcon />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item container direction="column" justify="center">
          <Grid item xs={12}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              color="secondary"
              id="ingredient-input"
              label="What ingredients do you have?"
              value={ingredientInput}
              onChange={handleIngredientInput}
              onKeyDown={handleIngredientInputEntry}
              className={classes.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="add ingredient"
                      onClick={() => {
                        addIngredient();
                        setInputFocus();
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {ingredients?.length > 0 && (
            <Grid
              className={classes.showRecipeButton}
              item
              container
              spacing={2}
              justify="center"
              alignItems="center"
              direction="row"
            >
              <Grid item>
                <Link href="/valid-recipes" passHref>
                  <Button variant="outlined">Show me recipes!</Button>
                </Link>
              </Grid>
              <Grid item>
                <Tooltip title="Clear ingredients" placement="top">
                  <IconButton onClick={() => setIngredients([])}>
                    <RotateLeftIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
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
              <Grid item key={i}>
                <Paper style={{ padding: "10px" }}>
                  <Typography
                    variant="h6"
                    noWrap
                    style={{ textAlign: "left" }}
                    className={classes.iconsAndText}
                  >
                    <IconButton
                      aria-label="delete ingredient"
                      onClick={(e) => handleRemoveIngredient(e, i)}
                      className={classes.removeEnteredIngredientButton}
                    >
                      <DeleteOutlined />
                    </IconButton>
                    {ingredient}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}
