import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box } from "@material-ui/core";
import Image from "next/image";
import TimerIcon from "@material-ui/icons/Timer";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import Tile from "../components/Tile";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: "4rem",
  },
}));

export async function getServerSideProps(context) {
  console.log(context);
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipe/${context.query.ingredientList}`
  );
  const recipes = await res.json();
  return {
    props: { recipes }, // will be passed to the page component as props
  };
}

export default function ValidRecipes({ recipes }) {
  const classes = useStyles();
  console.log(recipes);

  return (
    <Layout title="Available Recipes">
      <Typography className={classes.title} variant="h1">
        Recipes you can make...
      </Typography>
      <Grid container alignItems="center" justify="center" spacing={10}>
        {recipes.map((recipe, i) => (
          <Tile key={i} recipe={recipe} />
        ))}
      </Grid>
    </Layout>
  );
}

ValidRecipes.propTypes = {
  recipes: PropTypes.array.isRequired,
};
