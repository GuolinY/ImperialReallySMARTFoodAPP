import * as yup from "yup";
import { FieldArray, Form, Formik, Field } from "formik";
import {
  Divider,
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
  time: yup.number().required("Recipe needs a cook time"),
  halal: yup.bool(),
  kosher: yup.bool(),
  gluten_free: yup.bool(),
  vegan: yup.bool(),
  vegetarian: yup.bool(),
  difficulty: yup
    .number()
    .required("Difficulty is required")
    .min(1, "Lowest difficulty is easy")
    .max(3, "Highest difficulty is hard"),
  calories: yup.number().required("Number of calories is required"),
  proteins: yup.number().required("Amount of protein is required"),
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
    <Layout title="New Recipe">
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
          time: 0,
          difficulty: 1,
          halal: false,
          vegetarian: false,
          vegan: false,
          gluten_free: false,
          kosher: false,
          calories: 0,
          carbs: 0,
          proteins: 0,
          fats: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          axios
            .post(
              "http://smart-food-app-backend.herokuapp.com/recipes/submit",
              values
            )
            .then((result) => console.log(result));
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
                          <Grid item container>
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
                        <Button
                          variant="outlined"
                          color="default"
                          onClick={() => push("")}
                          startIcon={<AddCircleOutlineIcon />}
                        >
                          Add Ingredient
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "left" }}>
                  <FormControl>
                    <FormLabel>Diet</FormLabel>
                    <FormGroup row>
                      {[
                        "vegan",
                        "vegetarian",
                        "kosher",
                        "gluten_free",
                        "halal",
                      ].map((x, i) => (
                        <FormControlLabel
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
                <Grid item>
                  <TextField
                    id="time"
                    label="Cooking Time"
                    type="time"
                    variant="outlined"
                    defaultValue="00:00"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setFieldValue("time", hMToS(e.target.value));
                    }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item container spacing={2}>
                  {["calories", "carbs", "proteins", "fats"].map((x, i) => (
                    <Grid item xs={6}>
                      <TextField
                        id={x}
                        label={x.charAt(0).toUpperCase() + x.slice(1)}
                        variant="outlined"
                        fullWidth
                        onChange={(e) =>
                          setFieldValue(x, parseInt(e.target.value))
                        }
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

            <>
              <pre style={{ textAlign: "left" }}>
                <strong>Values</strong>
                <br />
                {JSON.stringify(values, null, 2)}
              </pre>
              <pre style={{ textAlign: "left" }}>
                <strong>Errors</strong>
                <br />
                {JSON.stringify(errors, null, 2)}
              </pre>
            </>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
