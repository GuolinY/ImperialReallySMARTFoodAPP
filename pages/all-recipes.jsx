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
  IconButton,
} from "@material-ui/core";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import { makeStyles } from "@material-ui/core/styles";
import Masonry from "react-masonry-css";
import axios from "axios";
import {
  useIngredients,
  useValidRecipeFilters,
  useValidRecipeFiltersUpdate,
  DEFAULT_FILTERS,
} from "../contexts/ingredients";
import Skeleton from "@material-ui/lab/Skeleton";
import Link from "next/link";
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
  const filters = useValidRecipeFilters();
  const setFilters = useValidRecipeFiltersUpdate();
  const [sortBy, setSortBy] = useState("rating");

  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

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

  const sortFunctions = {
    rating: (first, second) => second.rating - first.rating,
    time_asc: (first, second) => first.cooking_time - second.cooking_time,
    time_desc: (first, second) => second.cooking_time - first.cooking_time,
    kcal_asc: (first, second) =>
      first.nutrition.calories - second.nutrition.calories,
    kcal_desc: (first, second) =>
      second.nutrition.calories - first.nutrition.calories,
  };

  const sortRecipes = (recipes, sortBy) => {
    if (sortBy) {
      return [...recipes].sort(sortFunctions[sortBy]);
    }
    return recipes;
  };

  const filterRecipes = (recipes, filters) => {
    const inRange = (value, [l, u], max = 500) => {
      if (l === 0 && u === max) {
        return true;
      }
      if (u === max) {
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
        inRange(recipe.nutrition.calories, filters.calories, 5000) &&
        inRange(recipe.nutrition.carbohydrates, filters.carbs) &&
        inRange(recipe.nutrition.protein, filters.protein) &&
        inRange(recipe.nutrition.fats, filters.fats) &&
        inRange(recipe.cooking_time, filters.cooking_time, 14400) &&
        (!filters.vegan || recipe.vegan) &&
        (!filters.vegetarian || recipe.vegetarian) &&
        recipe.rating >= filters.min_rating &&
        ((filters.difficulty.easy &&
          filters.difficulty.medium &&
          filters.difficulty.hard) ||
          filters.difficulty[difficultyRating[recipe.difficulty]])
      );
    });
    if (sortBy) {
      newRecipes.sort(sortFunctions[sortBy]);
    }
    return newRecipes.length == 0 ? { id: -1 } : newRecipes;
  };

  useEffect(async () => {
    let newRecipes = await axios
      .post(
        `https://smart-food-app-backend.herokuapp.com/recipes/everyrecipe`,
        {
          page_no: 0,
          page_size: 50,
        }
      )
      .then((res) => {
        setLoading(false);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    if (Array.isArray(newRecipes)) {
      setRecipes(newRecipes);
      setFilteredRecipes(newRecipes);
      setFilteredRecipes(
        sortRecipes(filterRecipes(newRecipes, filters), sortBy)
      );
    }
    setLoading(false);
  }, []);

  const hasValidRecipes = Array.isArray(recipes);
  const hasFilteredRecipes = Array.isArray(filteredRecipes);

  const closeFilter = () => setOpenFilter(false);

  const resetRecipeFilter = () => {
    setFilteredRecipes(
      sortRecipes(filterRecipes(recipes, DEFAULT_FILTERS), sortBy)
    );
    setFilters(DEFAULT_FILTERS);
  };

  const onFilterSubmit = (filters) => {
    setFilteredRecipes(filterRecipes(recipes, filters));
    setFilters(filters);
    setOpenFilter(false);
  };

  const handleSelectSort = (event) => {
    setFilteredRecipes(sortRecipes(filteredRecipes, event.target.value));
    setSortBy(event.target.value);
  };

  return (
    <Layout title="All Recipes" validRecipes>
      <Typography className={classes.title} variant="h1" gutterBottom>
        {loading
          ? "Finding our delicious recipes for you..."
          : hasValidRecipes
          ? hasFilteredRecipes
            ? `Our recipe collection`
            : "No recipes"
          : `No recipes found :(`}
      </Typography>
      {!loading && hasValidRecipes && (
        <Grid container className={classes.filterSelect} spacing={2}>
          <Grid item xs={6}>
            <Button
              onClick={() => setOpenFilter(true)}
              style={{ marginTop: 16 }}
            >
              Filter
            </Button>
            <IconButton onClick={resetRecipeFilter} style={{ marginTop: 12 }}>
              <RestorePageIcon />
            </IconButton>
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
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="time_asc">Time ascending</MenuItem>
                <MenuItem value="time_desc">Time descending</MenuItem>
                <MenuItem value="kcal_asc">KCal ascending</MenuItem>
                <MenuItem value="kcal_desc">KCal descending</MenuItem>
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
          <RecipeFilter onSubmit={onFilterSubmit} initialValues={filters} />
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
              <Tile recipe={recipe} key={i} />
            ))}
          </Masonry>
        ) : hasValidRecipes ? (
          `No recipes found matching filter you selected`
        ) : (
          <Typography>
            Unfortunately, there seems to be an issue with fetching our recipes
            right now. Please try again later.
          </Typography>
        )}
      </Container>
    </Layout>
  );
}
