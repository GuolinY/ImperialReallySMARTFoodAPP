import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tile: {
    outline: "1px black",
  },
}));

function Tile(props) {
  const classes = useStyles();

  const { recipe } = props;

  return (
    <Grid item className={classes.tile} xs={12} md={6} xl={3}>
      <Typography variant="h3">{recipe.name}</Typography>
      <img src={recipe.img} />
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating name="simple-controlled" value={recipe.rating} />
      </Box>
    </Grid>
  );
}

Tile.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default function ValidRecipes() {
  const recipes = [
    // fake api response
    {
      id: 1,
      name: "Balkan surprise",
      img: null, // TODO add image
      rating: 2.5,
      reviews: null, // TODO add link to fetch reviews
      review_number: 9,
      cooking_time: 1200, // time measured in seconds
      difficulty: "easy",
      description: "Bread, cheese and one 'special' ingredient",
      dietary_requirements: ["halal"],
      nutrition: {
        calories: 200,
        carbohydrates: "200g",
        protein: "200g",
        fat: "20g",
      },
    },
  ];

  return (
    <Layout title="Available recipes">
      <Grid container spacing={2}>
        {recipes.map((recipe, i) => (
          <Tile key={i} recipe={recipe} />
        ))}
      </Grid>
    </Layout>
  );
}
