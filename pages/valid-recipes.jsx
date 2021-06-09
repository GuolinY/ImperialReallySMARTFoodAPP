import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { useRouter } from "next/router";
import {
  Grid,
  Typography,
  Container,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Masonry from "react-masonry-css";
import axios from "axios";
import { useIngredients } from "../contexts/ingredients";
import Skeleton from "@material-ui/lab/Skeleton";
import Tile from "../components/Tile";
import RecipeFilter from "../components/RecipeFilter";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
    [theme.breakpoints.down("xs")]: {
      fontSize: 72,
    },
  },
  recipeTileContainer: {
    margin: 0,
    width: "90%",
    maxWidth: theme.spacing(180),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  filter: {
    width: "80%",
    maxWidth: theme.spacing(64),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  filterDialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    padding: theme.spacing(2, 3),
  },
}));

export default function ValidRecipes() {
  const classes = useStyles();
  const router = useRouter();

  const ingredients = useIngredients();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState({ id: -1 });
  const [openFilter, setOpenFilter] = useState(true);

  const breakpoints = {
    default: 4,
    1100: 3,
    900: 2,
  };

  useEffect(async () => {
    if (ingredients?.length > 0) {
      const newRecipes = await axios
        .get(
          `http://smart-food-app-backend.herokuapp.com/recipes/${ingredients.join(
            "_"
          )}`
        )
        .then((res) => {
          setLoading(false);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      setRecipes(newRecipes);
    }
    setLoading(false);
  }, []);

  const hasValidRecipes = Array.isArray(recipes);

  const LoadingRecipe = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
      </Grid>
    );
  };

  const closeFilter = () => setOpenFilter(false);

  return (
    <Layout title="Recipes you can make..." validRecipes>
      <Typography className={classes.title} variant="h1" gutterBottom>
        {loading
          ? "Loading..."
          : hasValidRecipes
          ? `Recipes you can make...`
          : `No recipes found :(`}
      </Typography>
      <Dialog
        open={openFilter}
        onClose={closeFilter}
        aria-labelledby="filter-modal"
      >
        <div id="form-dialog-title" className={classes.filterDialogTitle}>
          <Typography variant="h6">Filter recipes</Typography>
          <Button onClick={closeFilter} color="primary">
            Cancel
          </Button>
        </div>
        <DialogContent
          style={{
            justifyContent: "center",
            textAlign: "center",
            display: "flex",
          }}
        >
          <RecipeFilter />
        </DialogContent>
      </Dialog>
      <Container style={{ marginTop: 20 }}>
        {loading ? (
          <LoadingRecipe />
        ) : hasValidRecipes ? (
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {recipes.map((recipe, i) => (
              <div key={recipe.id}>
                <Tile
                  recipe={recipe}
                  ingredientList={router.query.ingredientList}
                  key={i}
                />
              </div>
            ))}
          </Masonry>
        ) : (
          `Unfortunately, we weren't able to find recipes for all your ingredients this time. Please try again with other ingredients.`
        )}
      </Container>
    </Layout>
  );
}
