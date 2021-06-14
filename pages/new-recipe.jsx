import React from "react";
import * as yup from "yup";
import { FieldArray, Form, Formik, Field } from "formik";
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
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Layout from "../components/_Layout";
import axios from "axios";

const validationSchema = yup.object({
  name: yup.string("Enter recipe name").required("Recipe name is required"),
  ingredients: yup
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
});

export default function NewRecipe() {
  function hMToS(hm) {
    const a = ("" + hm).split(":");
    const sec = +a[0] * 3600 + +a[1] * 60;
    console.log(sec);
    return sec;
  }

  function secondsToHm(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    return h + ":" + m;
  }

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
          image_link:
            "https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg",
          ingredients: [""],
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
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          values.time = values.hours * 3600 + values.minutes * 60;
          axios
            .post(
              "https://smart-food-app-backend.herokuapp.com/recipes/submit",
              values
            )
            .then((result) => console.log(result));
          resetForm();
          alert("submitted new recipe");
        }}
      >
        {({ values, touched, errors, handleChange, setFieldValue }) => (
          <Form autoComplete="off">
            <Paper variant="outlined" elevation={3} style={{ padding: 16 }}>
              <Grid
                container
                spacing={2}
                direction="column"
                justify="center"
                alignItems="stretch"
              >
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    variant="outlined"
                    label="Recipe Name"
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <Button variant="outlined" component="label">
                    Upload a photo of the final product
                    <input type="file" accept="image/png, image/jpeg" hidden />
                  </Button>
                </Grid>

                <Grid item container direction="column" spacing={2}>
                  <FieldArray name="ingredients">
                    {({ push, remove }) => (
                      <>
                        {values.ingredients.map((ingredient, i) => (
                          <Grid item container key={i}>
                            <Grid item xs={9}>
                              <TextField
                                variant="outlined"
                                label="Ingredient"
                                name={`ingredients[${i}]`}
                                value={values.ingredients[i]}
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
                      {["vegan", "vegetarian"].map((x, i) => (
                        <FormControlLabel
                          key={i}
                          control={
                            <Checkbox
                              checked={values[x]}
                              onChange={handleChange}
                              name={x}
                            />
                          }
                          label={x.charAt(0).toUpperCase() + x.slice(1)}
                        />
                      ))}
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
    </Layout>
  );
}
