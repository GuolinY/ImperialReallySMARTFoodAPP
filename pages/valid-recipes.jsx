import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { Grid, Typography, Box } from "@material-ui/core";
import Tile from "../components/Tile";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import BackButton from "../components/BackButton";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
  },
}));

export async function getServerSideProps(context) {
  console.log(context);
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipes/${context.query.ingredientList}`
  );
  const recipes = await res.json();
  return {
    props: { recipes }, // will be passed to the page component as props
  };
}

export default function ValidRecipes({ recipes }) {
  const classes = useStyles();
  const router = useRouter();
  console.log(recipes);

  return (
    <Layout title="Recipes you can make...">
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.title} variant="h1" gutterBottom>
            Recipes you can make...
          </Typography>
        </Grid>
        <Grid item>
          <BackButton href="/" message="Edit Ingredients" />
        </Grid>
      </Grid>
      <Grid
        style={{ width: "90%" }}
        container
        alignItems="stretch"
        justify="center"
        spacing={10}
      >
        {recipes.map((recipe, i) => (
          <Tile
            key={i}
            recipe={recipe}
            ingredientList={router.query.ingredientList}
          />
        ))}
      </Grid>
    </Layout>
  );
}

ValidRecipes.propTypes = {
  recipes: PropTypes.array.isRequired,
};
