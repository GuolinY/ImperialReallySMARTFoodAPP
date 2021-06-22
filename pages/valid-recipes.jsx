import React, { useState, useEffect } from "react";
import Layout from "../components/_Layout";
import {
  Grid,
  Typography,
  Container,
  Dialog,
  DialogContent,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import { makeStyles } from "@material-ui/core/styles";
import Masonry from "react-masonry-css";
import axios from "axios";
import {
  useIngredients,
  useValidRecipeFilters,
  useValidRecipeFiltersUpdate,
  useLoadingIngredients,
  useSubstitutions,
  DEFAULT_FILTERS,
  SUBSTITUTIONS,
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

  const ingredients = useIngredients();
  const [loading, setLoading] = useState(true);
  const loadingIngredients = useLoadingIngredients();
  const [recipes, setRecipes] = useState({ id: -1 });
  const [filteredRecipes, setFilteredRecipes] = useState({ id: -1 });
  const [openFilter, setOpenFilter] = useState(false);
  const filters = useValidRecipeFilters();
  const setFilters = useValidRecipeFiltersUpdate();
  const [sortBy, setSortBy] = useState("most_using");
  const substitutions = useSubstitutions();

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
    most_using: (first, second) => first.notUsed.length - second.notUsed.length,
    least_missing: (first, second) =>
      first.missing.length - second.missing.length,
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

  const containsIngredient = (ingredients, thatIngredient) => {
    return ingredients.some((thisIngredient) => {
      const theseIngredients = thisIngredient
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(" ")
        .filter((s) => s.length > 0);
      const thoseIngredients = thatIngredient
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(" ")
        .filter((s) => s.length > 0);
      const thisLength = theseIngredients.length;
      const thatLength = thoseIngredients.length;
      if (thisLength > thatLength) {
        // thisIngredient contains sliding window of thatIngredient
        const thisWindow = theseIngredients.slice(0, thatLength);
        for (let i = 0; i < thisLength - thatLength + 1; i++) {
          if (
            thisWindow.join("_") === thoseIngredients.join("_") ||
            thisWindow.join("_") === thoseIngredients.join("_").concat("s") ||
            thisWindow.join("_").concat("s") === thoseIngredients.join("_")
          ) {
            return true;
          }
          thisWindow.shift();
          thisWindow.push(theseIngredients[thatLength + i]);
        }
      } else {
        // thatIngredient contains sliding window of thisIngredient
        const thatWindow = thoseIngredients.slice(0, thisLength);
        for (let i = 0; i < thatLength - thisLength + 1; i++) {
          if (
            thatWindow.join("_") === theseIngredients.join("_") ||
            thatWindow.join("_") === theseIngredients.join("_").concat("s") ||
            thatWindow.join("_").concat("s") === theseIngredients.join("_")
          ) {
            return true;
          }
          thatWindow.shift();
          thatWindow.push(thoseIngredients[thisLength + i]);
        }
      }
      return false;
    });
  };

  const calculateRecipeInfo = (recipe) => {
    // Each ingredient in the recipe which doesn't appear in the user's ingredients
    recipe.missing = recipe.ingredients.filter(
      (recipeIngredient) => !containsIngredient(ingredients, recipeIngredient)
    );
    recipe.notUsed = ingredients.filter(
      (ingredient) => !containsIngredient(recipe.ingredients, ingredient)
    );
    // Substitutions
    // Enter ... onion ... => recipes with ... leek(s) ... display "leek with onion"
    // Enter ... onions ... => recipes with ... leek(s) ... display "leek with onions"
    // Enter ... leek ... => recipes with ... onion(s) ... display "onion with leek"
    // Enter ... leeks ... => recipes with ... onion(s) ... display "onion with leeks"
    recipe.substitutions = substitutions
      .filter((substitution) => {
        if (substitution) {
          return containsIngredient(recipe.ingredients, substitution);
        }
      })
      .map(
        (substitutionInUse) =>
          `${substitutionInUse} with ${SUBSTITUTIONS.getSub(substitutionInUse)}`
      );
    return recipe;
  };

  useEffect(async () => {
    setLoading(true);
    if (ingredients?.length > 0) {
      let newRecipes = await axios
        .post("https://smart-food-app-backend.herokuapp.com/recipes/partial", {
          // .post("http://127.0.0.1:8000/recipes/partial", {
          ingredients,
          no_missing: Math.max(2, 3 * Math.floor(ingredients.length / 4)),
        })
        .then((res) => {
          setLoading(false);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      if (Array.isArray(newRecipes) && newRecipes.length > 0) {
        newRecipes.forEach((recipe) => calculateRecipeInfo(recipe));
        setRecipes(newRecipes);
        setFilteredRecipes(newRecipes);
        setFilteredRecipes(
          sortRecipes(filterRecipes(newRecipes, filters), sortBy)
        );
      }
      console.log(newRecipes);
    }
    setLoading(false);
  }, [ingredients]);

  const hasValidRecipes = Array.isArray(recipes) && recipes.length > 0;
  const hasFilteredRecipes =
    Array.isArray(filteredRecipes) && filteredRecipes.length > 0;

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
    <Layout title="Recipes you can make..." validRecipes>
      <Typography className={classes.title} variant="h1" gutterBottom>
        {loading || loadingIngredients
          ? "Finding some delicious recipes for you..."
          : hasValidRecipes
          ? hasFilteredRecipes
            ? `Recipes you can make...`
            : "No recipes"
          : `No recipes found :(`}
      </Typography>
      {!(loading || loadingIngredients) && hasValidRecipes && (
        <Grid container className={classes.filterSelect} spacing={2}>
          <Grid item xs={6}>
            <Button
              onClick={() => setOpenFilter(true)}
              style={{ marginTop: 16 }}
            >
              Filter
            </Button>
            <Tooltip title="Reset Filter" placement="top">
              <IconButton onClick={resetRecipeFilter} style={{ marginTop: 12 }}>
                <RestorePageIcon />
              </IconButton>
            </Tooltip>
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
                <MenuItem value="most_using">Most using</MenuItem>
                <MenuItem value="least_missing">Least missing</MenuItem>
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
        {loading || loadingIngredients ? (
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
          <>
            <Typography>
              Unfortunately, we weren't able to find recipes to suit your
              ingredients this time.
            </Typography>
            <Link href="/" passHref>
              <Button>Try again with other ingredients</Button>
            </Link>
          </>
        )}
      </Container>
    </Layout>
  );
}
