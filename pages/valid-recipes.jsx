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
import { useRouter } from "next/router";

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
  const router = useRouter();
  console.log(recipes);

  return (
    <Layout title="Recipes you can make...">
      <Typography variant="h1" className={classes.title}>
        Recipes you can make...
      </Typography>
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
