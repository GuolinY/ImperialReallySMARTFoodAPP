import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { Grid, Typography, Box, Container } from "@material-ui/core";
import Tile from "../components/Tile";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import BackButton from "../components/BackButton";
import Masonry from "react-masonry-css";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
  },
  recipeTileContainer: {
    margin: 0,
    width: "90%",
    maxWidth: theme.spacing(180),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
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

  const breakpoints = {
    default: 4,
    1100: 3,
    900: 2,
  };

  const hasValidRecipes = Array.isArray(recipes);

  return (
    <Layout title="Recipes you can make...">
      <Grid container justify="space-evenly" alignItems="center">
        <Grid item>
          <Typography className={classes.title} variant="h1" gutterBottom>
            {hasValidRecipes
              ? `Recipes you can make...`
              : `No recipes found :(`}
          </Typography>
        </Grid>
        <Grid item>
          <BackButton
            href="/"
            message="Edit Ingredients"
            ingredientList={router.query.ingredientList}
          />
        </Grid>
      </Grid>

      <Container style={{ marginTop: 20 }}>
        {hasValidRecipes ? (
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

ValidRecipes.propTypes = {
  recipes: PropTypes.array.isRequired,
};
