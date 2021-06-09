import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { useRouter } from "next/router";
import {
  Box,
  Grid,
  Typography,
  Container,
  Button,
  TextField,
  Slider,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CheckboxIcon,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import Masonry from "react-masonry-css";
import axios from "axios";
import { useIngredients } from "../contexts/ingredients";
import Skeleton from "@material-ui/lab/Skeleton";
import { useFormik, Form, Formik, Field } from "formik";
import * as yup from "yup";
import BackButton from "../components/BackButton";
import Tile from "../components/Tile";

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
}));

export default function ValidRecipes() {
  const classes = useStyles();
  const router = useRouter();

  const ingredients = useIngredients();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState({ id: -1 });

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

  const Filter = () => {
    const time_marks = [
      {
        value: 0,
        label: "0m",
      },
      {
        value: 15,
        label: "15m",
      },
      {
        value: 30,
        label: "30m",
      },
      {
        value: 45,
        label: "45m",
      },
      {
        value: 60,
        label: "1h",
      },
      {
        value: 90,
        label: "2h",
        scaledValue: 90,
      },
      {
        value: 120,
        label: "3h",
      },
      {
        value: 150,
        label: "Ꝏ",
      },
    ];

    const [state, setState] = React.useState({
      checkedA: true,
      checkedB: true,
      checkedF: true,
      checkedG: true,
    });

    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };

    const [value, setValue] = React.useState(2);

    return (
      <Formik
        initialValues={{
          calories: [0, 5000],
          carbs: [0, 500],
          protein: [0, 500],
          fats: [0, 500],
          cooking_time: [0, 500],
          halal: false,
          vegan: false,
          vegetarian: false,
          gluten_free: false,
          min_rating: 0,
          difficulty: {
            easy: true,
            medium: true,
            hard: true,
          },
        }}
        onSubmit={(values) => {
          console.log(JSON.stringify(values, null, 2));
        }}
      >
        {({
          submitForm,
          isSubmitting,
          handleSubmit,
          handleChange,
          setFieldValue,
          touched,
          errors,
          values,
        }) => (
          <Form onSubmit={handleSubmit} className={classes.filter}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography id="calorie-slider" gutterBottom>
                  Calories
                </Typography>
                <Slider
                  id="calories"
                  name="calories"
                  min={0}
                  step={10}
                  max={5000}
                  value={values.calories}
                  onChange={(event, value) => setFieldValue("calories", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => {
                    return val < 5000 ? val : "Ꝏ";
                  }}
                  aria-labelledby="calorie-slider"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography id="carbohydrates-slider" gutterBottom>
                  Carbohydrates
                </Typography>
                <Slider
                  id="carbohydrates"
                  name="carbohydrates"
                  min={0}
                  step={5}
                  max={500}
                  value={values.carbs}
                  onChange={(event, value) => setFieldValue("carbs", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => {
                    return val < 500 ? `${val}g` : "Ꝏ";
                  }}
                  aria-labelledby="carbohydrates-slider"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography id="protein-slider" gutterBottom>
                  Protein
                </Typography>
                <Slider
                  id="protein"
                  name="protein"
                  min={0}
                  step={5}
                  max={500}
                  value={values.protein}
                  onChange={(event, value) => setFieldValue("protein", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => {
                    return val < 500 ? `${val}g` : "Ꝏ";
                  }}
                  aria-labelledby="protein-slider"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography id="fats-slider" gutterBottom>
                  Fats
                </Typography>
                <Slider
                  id="fats"
                  name="fats"
                  min={0}
                  step={5}
                  max={500}
                  value={values.fats}
                  onChange={(event, value) => setFieldValue("fats", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => {
                    return val < 500 ? `${val}g` : "Ꝏ";
                  }}
                  aria-labelledby="fats-slider"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography id="fats-slider" gutterBottom>
                  Dietary requirements
                </Typography>
                <FormGroup row style={{ justifyContent: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.halal}
                        onChange={(event) =>
                          setFieldValue("halal", event.target.checked)
                        }
                        name="halal"
                      />
                    }
                    label="Halal"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.kosher}
                        onChange={(event) =>
                          setFieldValue("kosher", event.target.checked)
                        }
                        name="kosher"
                      />
                    }
                    label="Kosher"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.vegan}
                        onChange={(event) =>
                          setFieldValue("vegan", event.target.checked)
                        }
                        name="vegan"
                      />
                    }
                    label="Vegan"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.vegetarian}
                        onChange={(event) =>
                          setFieldValue("vegetarian", event.target.checked)
                        }
                        name="vegetarian"
                      />
                    }
                    label="Vegetarian"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.gluten_free}
                        onChange={(event) =>
                          setFieldValue("gluten_free", event.target.checked)
                        }
                        name="gluten_free"
                      />
                    }
                    label="Gluten"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography id="discrete-slider-restrict" gutterBottom>
                  Cooking time
                </Typography>
                <Slider
                  defaultValue={[0, 150]}
                  min={0}
                  max={150}
                  aria-labelledby="prep-time-slider"
                  step={null}
                  onChange={(event, value) => {
                    setFieldValue(
                      "cooking_time",
                      value.map((x) => (x > 60 ? (x == 90 ? 120 : 180) : x))
                    );
                  }}
                  valueLabelDisplay="off"
                  marks={time_marks}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography component="legend">
                  {values.min_rating == 5
                    ? "5 stars only"
                    : values.min_rating == 0
                    ? "All ratings"
                    : `${values.min_rating}+ stars`}
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={values.min_rating}
                  onChange={(e, value) => {
                    setFieldValue("min_rating", value || 0);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography component="legend">Difficulty</Typography>
                <FormGroup row style={{ justifyContent: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.difficulty.easy}
                        onChange={(event) =>
                          setFieldValue("difficulty.easy", event.target.checked)
                        }
                        name="easy"
                      />
                    }
                    label="Easy"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.difficulty.medium}
                        onChange={(event) =>
                          setFieldValue("difficulty.medium", event.target.checked)
                        }
                        name="medium"
                      />
                    }
                    label="Medium"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.difficulty.hard}
                        onChange={(event) =>
                          setFieldValue("difficulty.hard", event.target.checked)
                        }
                        name="hard"
                      />
                    }
                    label="Hard"
                    labelPlacement="top"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: 16 }}
            >
              Filter
            </Button>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <Layout title="Recipes you can make..." validRecipes>
      <Typography className={classes.title} variant="h1" gutterBottom>
        {loading
          ? "Loading..."
          : hasValidRecipes
          ? `Recipes you can make...`
          : `No recipes found :(`}
      </Typography>
      <Filter />
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
