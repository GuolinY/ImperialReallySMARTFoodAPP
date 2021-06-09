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
  InputLabel,
  Select,
  FormControl,
  MenuItem,
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
  filterSelect: {
    justifyContent: "center",
    maxWidth: theme.spacing(120),
  },
  formControl: {
    minWidth: 120,
  },
}));

export default function ValidRecipes() {
  const classes = useStyles();
  const router = useRouter();

  const ingredients = useIngredients();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState({ id: -1 });
  const [filteredRecipes, setFilteredRecipes] = useState({ id: -1 });
  const [openFilter, setOpenFilter] = useState(false);

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
      setFilteredRecipes(newRecipes);
    }
    setLoading(false);
  }, []);

  const hasValidRecipes = Array.isArray(recipes);
  const hasFilteredRecipes = Array.isArray(filteredRecipes);

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

  const [sortBy, setSortBy] = React.useState("");

  const sortFunctions = {
    time_asc: (first, second) => first.cooking_time - second.cooking_time,
    time_desc: (first, second) => second.cooking_time - first.cooking_time,
    rating: (first, second) => second.rating - first.rating,
  };

  const handleSelectSort = (event) => {
    const sorted = [...filteredRecipes].sort(sortFunctions[event.target.value]);
    setSortBy(event.target.value);
    setFilteredRecipes(sorted);
  };

  const onFilterSubmit = (filters) => {
    const inRange = (value, [l, u], max = 500) => {
      if (u == max) {
        return l <= value;
      }
      return l <= value && value <= u;
    };

    const difficultyRating = {
      1: "easy",
      2: "medium",
      3: "hard",
    };

    const newRecipes = recipes.filter((recipe) => {
      return (
        (inRange(recipe.nutrition.calories, filters.calories, 5000) &&
          inRange(recipe.nutrition.carbohydrates, filters.carbs) &&
          inRange(recipe.nutrition.protein, filters.protein) &&
          inRange(recipe.nutrition.fats, filters.fats) &&
          inRange(recipe.cooking_time, filters.cooking_time, 14400) &&
          (!filters.halal || recipe.halal) &&
          (!filters.kosher || recipe.kosher) &&
          (!filters.gluten_free || recipe.gluten_free) &&
          (!filters.vegan || recipe.vegan) &&
          (!filters.vegetarian || recipe.vegetarian) &&
          recipe.rating >= filters.min_rating &&
          filters.difficulty.easy &&
          filters.difficulty.medium &&
          filters.difficulty.hard) ||
        filters.difficulty[difficultyRating[recipe.difficulty]]
      );
    });

    setFilteredRecipes(newRecipes.length == 0 ? { id: -1 } : newRecipes);
    setOpenFilter(false);
  };

  return (
    <Layout title="Recipes you can make..." validRecipes>
      <Typography className={classes.title} variant="h1" gutterBottom>
        {loading
          ? "Loading..."
          : hasValidRecipes
          ? hasFilteredRecipes
            ? `Recipes you can make...`
            : "No recipes"
          : `No recipes found :(`}
      </Typography>
      {!loading && hasValidRecipes && (
        <Grid container className={classes.filterSelect} spacing={2}>
          <Grid item xs={6}>
            <Button
              onClick={() => setOpenFilter(true)}
              style={{ paddingTop: 22 }}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="sort-by-selector-input-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-selector-label"
                id="sort-by-selector"
                value={sortBy}
                onChange={handleSelectSort}
              >
                <MenuItem value="time_asc">Time ascending</MenuItem>
                <MenuItem value="time_desc">Time descending</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
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
            padding: "24px",
          }}
        >
          <RecipeFilter onSubmit={onFilterSubmit} />
        </DialogContent>
      </Dialog>
      <Container style={{ marginTop: 20 }}>
        {loading ? (
          <LoadingRecipe />
        ) : hasFilteredRecipes ? (
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredRecipes.map((recipe, i) => (
              <Tile
                recipe={recipe}
                ingredientList={router.query.ingredientList}
                key={i}
              />
            ))}
          </Masonry>
        ) : hasValidRecipes ? (
          `No recipes found matching filter you selected`
        ) : (
          `Unfortunately, we weren't able to find recipes for all your ingredients this time. Please try again with other ingredients.`
        )}
      </Container>
    </Layout>
  );
}
