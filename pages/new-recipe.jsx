import {
  Paper,
  TextField,
  Typography,
  Grid,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import Layout from "../components/_Layout";
import { useState } from "react";
import axios from "axios";

export default function NewRecipe() {
  function hMToS(hm) {
    const a = hm.split(":");
    return +a[0] * 3600 + +a[1] * 60;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));
    axios
      .post("http://smart-food-app-backend.herokuapp.com/recipes/submit", data)
      .then((result) => console.log(result));
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const [checked, setChecked] = useState({
    checkedVegan: false,
    checkedVegetarian: false,
    checkedKosher: false,
    checkedGluten: false,
    checkedHalal: false,
  });

  const [recipeName, setRecipeName] = useState("");
  const [ingredientList, setIngredientList] = useState("");
  const [method, setMethod] = useState("");
  const [time, setTime] = useState("00:00");
  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  const data = {
    recipeName: recipeName,
    image_link:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg",
    ingredients: ingredientList.split(","),
    method: method,
    time: hMToS(time),
    difficulty: difficulty == "easy" ? 1 : difficulty == "medium" ? 2 : 3,
    nutrition: {
      calories: calories,
      carbohydrates: carbs,
      proteins: protein,
      fats: fats,
    },
  };

  const handleCheckbox = (event) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  return (
    <Layout title="New Recipe">
      <Typography
        variant="h1"
        style={{ fontFamily: "Abril Fatface" }}
        gutterBottom
      >
        Submit a New Recipe
      </Typography>

      <form autoComplete="off" onSubmit={handleSubmit}>
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
                variant="outlined"
                label="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" component="label">
                Upload a photo of the final product
                <input type="file" accept="image/png, image/jpeg" hidden />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ingredients"
                placeholder="Enter ingredients, separated by commas"
                variant="outlined"
                multiline
                onChange={(e) => setIngredientList(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <FormLabel component="legend">Difficulty</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.checkedVegan}
                      onChange={handleCheckbox}
                      name="checkedVegan"
                    />
                  }
                  label="Vegan"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.checkedVegetarian}
                      onChange={handleCheckbox}
                      name="checkedVegetarian"
                    />
                  }
                  label="Vegetarian"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.checkedKosher}
                      onChange={handleCheckbox}
                      name="checkedKosher"
                    />
                  }
                  label="Kosher"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.checkedGluten}
                      onChange={handleCheckbox}
                      name="checkedGluten"
                    />
                  }
                  label="Gluten-free"
                />
              </FormGroup>
            </Grid>
            <Grid item style={{ textAlign: "left" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Difficulty</FormLabel>
                <RadioGroup
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  row
                >
                  <FormControlLabel
                    value="easy"
                    control={<Radio />}
                    label="Easy"
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value="hard"
                    control={<Radio />}
                    label="Hard"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Method"
                placeholder="Separate each step with a new line"
                variant="outlined"
                multiline
                rows={4}
                onChange={(e) => setMethod(e.target.value)}
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
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Calories"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setCalories(e.target.value)}
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Carbohydrates"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setCarbs(e.target.value)}
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Protein (g)"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setProtein(e.target.value)}
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fats"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setFats(e.target.value)}
                  type="number"
                  required
                />
              </Grid>
            </Grid>

            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Layout>
  );
}
