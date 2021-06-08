import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import {
  Grid,
  Typography,
  Container,
  Button,
  TextField,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CheckboxIcon,
} from "@material-ui/core";
import Tile from "../components/Tile";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import BackButton from "../components/BackButton";
import Masonry from "react-masonry-css";
import axios from "axios";
import { useIngredients } from "../contexts/ingredients";
import Skeleton from "@material-ui/lab/Skeleton";
import { useFormik, Form, Formik, Field } from "formik";
import * as yup from "yup";

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
    maxWidth: theme.spacing(60),
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

  // const validationSchema = yup.object({
  //   email: yup
  //     .string("Enter your email")
  //     .email("Enter a valid email")
  //     .required("Email is required"),
  //   password: yup
  //     .string("Enter your password")
  //     .min(8, "Password should be of minimum 8 characters length")
  //     .required("Password is required"),
  // });

  //* Filter on:
  // Nutrition:
  //   carbs,
  //   fats,
  //   protein,
  //   calories,
  // halal, vegan, vegetarian, gluten_free
  // cooking_time,
  // rating,
  // difficulty,

  const Filter = () => {
    // const formik = useFormik({
    //   initialValues: {
    //     calories: [0, 100],
    //     carbs: [0, 100],
    //     protein: [0, 100],
    //     fats: [0, 100],
    //     halal: false,
    //     vegan: false,
    //     vegetarian: false,
    //     gluten_free: false,
    //     cooking_time: [0, 100],
    //     // rating: 0,
    //     // difficulty: 0,
    //   },
    //   // validationSchema: validationSchema,
    //   onSubmit: (values) => {
    //     console.log(JSON.stringify(values, null, 2));
    //   },
    // });

    const [value, setValue] = React.useState([20, 37]);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

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
          // rating: 0,
          // difficulty: 0,
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
            </Grid>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
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
