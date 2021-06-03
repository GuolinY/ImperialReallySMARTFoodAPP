import React from "react";
import PropTypes from "prop-types";
import Layout from "../../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box, ThemeProvider } from "@material-ui/core";
import Image from "next/image";
import TimerIcon from "@material-ui/icons/Timer";
import WhatshotIcon from "@material-ui/icons/Whatshot";

export async function getStaticProps() {
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipe/1`
  );
  const recipe = await res.json();
  return {
    props: { recipe }, // will be passed to the page component as props
  };
}

const useStyles = makeStyles((theme) => ({
  tile: {
    outline: "3px solid black",
    borderRadius: "5px",
    color: theme.palette.text.primary,
    margin: "2rem",
    textAlign: "center",
  },
  preview: {
    borderRadius: "50%",
    border: "2px solid black",
  },
  title: {
    marginBottom: "4rem",
  },
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  nutrition: {
    textAlign: "left",
  },
  nutritionalData: {
    float: "right",
  },
  container: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1),
    },
  },
  ingredientsSubtitle: {
    margin: theme.spacing(2, 0, 0, 0),
  },
}));

export default function Recipe({ recipe }) {
  const classes = useStyles();
  console.log(recipe);

  return (
    <Layout title="Available Recipes">
      <Typography className={classes.title} variant="h2">
        Balkan Surprise
      </Typography>
      <Grid
        container
        alignItems="center"
        justify="center"
        spacing={10}
        className={classes.container}
      >
        <Grid item container xs={12} sm={3}>
          <Image
            src={recipe.image_link}
            width={200}
            height={200}
            alt="balkan suprise"
            className={classes.preview}
          />
          <Typography className={classes.iconsAndText}>
            <Rating name="read-only" value={recipe.rating} readOnly />
            &nbsp;({recipe.no_reviews})
          </Typography>
          <Typography variant="h5" className={classes.ingredientsSubtitle}>
            Ingredients
          </Typography>
          <ul>
            {recipe.ingredients.map((ingredient, i) => {
              return <li key={i}>{ingredient}</li>;
            })}
          </ul>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h3">Method</Typography>
          <div>
            <p>1. First you have to have cheese</p>
            <p>2. Second, you have to have bread</p>
            <p>3. Now, grab your nearest watermelon and mash 'em together</p>
            <p>4. You have now made the balkan suprise</p>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
}

Recipe.propTypes = {
  recipes: PropTypes.object.isRequired,
};
