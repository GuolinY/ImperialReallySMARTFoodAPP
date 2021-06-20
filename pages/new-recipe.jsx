import React, { useState } from "react";
import * as yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import {
  Button,
  TextField,
  IconButton,
  Paper,
  Grid,
  Typography,
  FormLabel,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { DeleteOutlined } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Layout from "../components/_Layout";
import axios from "axios";
import Link from "next/link";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const validationSchema = yup.object({
  name: yup.string("Enter recipe name").required("Recipe name is required"),
  image_link: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?(i.imgur.com\/)[a-zA-Z0-9]+(.((png)|(jpg)|(jpeg)|(gif)))/,
      "Need an image of the finished product, your link should look something like https://i.imgur.com/<image_name> (image needs to be a png, jpeg, jpg, gif)"
    )
    .required("Please enter a link to an image hosted on imgur"),
  ingredientsList: yup
    .array()
    .of(yup.string().required("Ingredient cannnot be empty"))
    .min(1, "Ingredients are required"),
  method: yup.string().required("Recipe needs a method"),
  hours: yup.number().required("Recipe needs a cook time"),
  minutes: yup.number().required("Recipe needs a cook time"),
  vegan: yup.bool(),
  vegetarian: yup.bool(),
  difficulty: yup
    .number()
    .required("Difficulty is required")
    .min(1, "Lowest difficulty is easy")
    .max(3, "Highest difficulty is hard"),
  calories: yup.number().required("Number of calories is required"),
  protein: yup.number().required("Amount of protein is required"),
  fats: yup.number().required("Amount of fats is required"),
  carbs: yup.number().required("Amount of carbohydrates is required"),
  extra_link: yup.string().url(),
});

export default function NewRecipe() {
  const [openSuccess, setOpenSuccess] = useState(true);
  const [openFailure, setOpenFailure] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ name: "asdas" });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
    setOpenFailure(false);
  };

  const handleOpenSnackbar = (newRecipe) => {
    setNewRecipe(newRecipe);
    if (newRecipe?.id && newRecipe?.name) {
      setOpenSuccess(true);
    } else {
      setOpenFailure(true);
    }
  };

  return (
    <Layout title="New Recipe" other>
      <Typography
        variant="h1"
        style={{ fontFamily: "Abril Fatface" }}
        gutterBottom
      >
        Submit a new recipe
      </Typography>
      <Formik
        initialValues={{
          name: "",
          image_link: "",
          ingredientsList: [""],
          method: "",
          hours: 0,
          minutes: 0,
          difficulty: 1,
          vegetarian: false,
          vegan: false,
          calories: 0,
          carbs: 0,
          protein: 0,
          fats: 0,
          extra_link: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          values.name = values.name.trim();
          values.time = values.hours * 3600 + values.minutes * 60;
          values.method = values.method
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join("\n");
          values.ingredientsList = values.ingredientsList.map((ing) =>
            ing.trim().toLowerCase()
          );
          values.ingredients = values.ingredientsList.join("_");
          const newRecipeID = await axios
            .post(
              "https://smart-food-app-backend.herokuapp.com/recipes/submit",
              values
            )
            .then((result) => {
              console.log(result);
              return result.data;
            })
            .catch((err) => {
              console.log(err);
            });
          if (newRecipeID?.success && newRecipeID?.new_recipe_id) {
            const newRecipe = await axios
              .get(
                `https://smart-food-app-backend.herokuapp.com/recipes/${newRecipeID.new_recipe_id}`
              )
              .then((res) => {
                return res.data;
              })
              .catch((err) => {
                console.log(err);
              });
            handleOpenSnackbar(newRecipe);
          } else {
            handleOpenSnackbar({});
          }
          resetForm();
        }}
      >
        {({ values, touched, errors, handleChange, setFieldValue }) => (
          <Form autoComplete="off">
            <Paper variant="outlined" elevation={20} style={{ padding: 16 }}>
              <Grid
                container
                spacing={2}
                direction="column"
                justify="center"
                alignItems="stretch"
              >
                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Recipe Name</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    variant="outlined"
                    value={values.name}
                    label="Recipe Name"
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Image</FormLabel>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="image_link"
                    variant="outlined"
                    value={values.image_link}
                    label="Image URL"
                    placeholder="Paste a link to your image here"
                    onChange={handleChange}
                    error={touched.image_link && Boolean(errors.image_link)}
                    helperText={touched.image_link && errors.image_link}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Ingredients</FormLabel>
                </Grid>

                <Grid item container direction="column" spacing={2}>
                  <FieldArray name="ingredientsList">
                    {({ push, remove }) => (
                      <>
                        {values.ingredientsList.map((ingredient, i) => (
                          <Grid item container key={i}>
                            <Grid item xs={9}>
                              <TextField
                                variant="outlined"
                                label="Ingredient"
                                name={`ingredientsList[${i}]`}
                                value={values.ingredientsList[i]}
                                onChange={handleChange}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <IconButton
                                aria-label="delete ingredient"
                                onClick={() => remove(i)}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="default"
                            fullWidth
                            onClick={() => push("")}
                            startIcon={<AddCircleOutlineIcon />}
                          >
                            Add Ingredient
                          </Button>
                        </Grid>
                      </>
                    )}
                  </FieldArray>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "left" }}>
                  <FormControl>
                    <FormLabel>Diet</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        key={0}
                        control={
                          <Checkbox
                            checked={values["vegan"]}
                            onChange={(e, value) => {
                              setFieldValue("vegan", value);
                              if (value) {
                                setFieldValue("vegetarian", true);
                              }
                            }}
                            name="vegan"
                          />
                        }
                        label="Vegan"
                      />
                      <FormControlLabel
                        key={1}
                        control={
                          <Checkbox
                            checked={values["vegetarian"]}
                            onChange={(e, value) => {
                              setFieldValue("vegetarian", value);
                              if (!value) {
                                setFieldValue("vegan", false);
                              }
                            }}
                            name="vegetarian"
                          />
                        }
                        label="Vegetarian"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item style={{ textAlign: "left" }}>
                  <FormControl>
                    <FormLabel>Difficulty</FormLabel>
                    <RadioGroup
                      id="difficulty"
                      row
                      value={values.difficulty}
                      onChange={(e) => {
                        console.log(parseInt(e.target.value));
                        setFieldValue("difficulty", parseInt(e.target.value));
                      }}
                    >
                      {["easy", "medium", "hard"].map((x, i) => (
                        <FormControlLabel
                          key={i}
                          name="difficulty"
                          value={i + 1}
                          control={<Radio />}
                          label={x.charAt(0).toUpperCase() + x.slice(1)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="method"
                    label="Method"
                    placeholder="Separate each step with a new line"
                    variant="outlined"
                    multiline
                    rows={4}
                    onChange={handleChange}
                    value={values.method}
                    error={touched.method && Boolean(errors.method)}
                    helperText={touched.method && errors.method}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Cooking time</FormLabel>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item xs={3} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setFieldValue("hours", isNaN(newValue) ? 0 : newValue);
                      }}
                      label="Hours"
                      value={values.hours}
                    />
                  </Grid>
                  <Grid item xs={3} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setFieldValue(
                          "minutes",
                          isNaN(newValue) ? 0 : newValue
                        );
                      }}
                      label="Minutes"
                      value={values.minutes}
                    />
                  </Grid>
                </Grid>

                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Nutritional Information</FormLabel>
                </Grid>
                <Grid item container spacing={2}>
                  {["calories", "carbs", "protein", "fats"].map((x, i) => (
                    <Grid item xs={6} key={i}>
                      <TextField
                        id={x}
                        label={x.charAt(0).toUpperCase() + x.slice(1)}
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setFieldValue(x, isNaN(newValue) ? 0 : newValue);
                        }}
                        value={values[x]}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Grid item style={{ textAlign: "left" }}>
                  <FormLabel>Extra information</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="extra_link"
                    variant="outlined"
                    value={values.extra_link}
                    label="Link to extra information"
                    placeholder="Paste a link here"
                    onChange={handleChange}
                    error={touched.extra_link && Boolean(errors.extra_link)}
                    helperText={touched.extra_link && errors.extra_link}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          New recipe{" "}
          <Link
            href={{ pathname: `/recipes`, query: { id: newRecipe.id } }}
          >{`"${newRecipe.name}"`}</Link>{" "}
          submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openFailure}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          There has been an error submitting your recipe. Please try again with
          a different recipe name
        </Alert>
      </Snackbar>
    </Layout>
  );
}
