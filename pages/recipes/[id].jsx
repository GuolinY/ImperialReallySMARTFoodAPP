import React from "react";
import Layout from "../../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Box,
  ThemeProvider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import Image from "next/image";
import TimerIcon from "@material-ui/icons/Timer";
import RatingAndReviews from "../../components/RatingAndReviews";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

export async function getStaticPaths() {
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipe/bread`
  );
  const data = await res.json();

  const paths = data.map((recipe) => {
    return {
      params: { id: recipe.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipe/${context.params.id}`
  );
  const recipe = await res.json();
  return {
    props: { recipe }, // will be passed to the page component as props
  };
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
  },
  image: {
    borderRadius: "50%",
    border: "2px solid black",
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
    width: "90%",
  },
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

export default function Recipe({ recipe }) {
  const classes = useStyles();
  console.log(recipe);

  return (
    <Layout title={recipe.name}>
      <Image
        src={recipe.image_link}
        width={200}
        height={200}
        alt="balkan suprise"
        className={classes.image}
      />
      <Typography className={classes.title} variant="h2" gutterBottom>
        {recipe.name}
      </Typography>
      <RatingAndReviews recipe={recipe} />
      <Grid
        container
        alignItems="flex-start"
        spacing={10}
        className={classes.container}
      >
        <Grid item className={classes.ingredients} xs={12} sm={3}>
          <Typography
            variant="h2"
            className={classes.ingredientsSubtitle}
            gutterBottom
          >
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map((ingredient, i) => {
              return (
                <ListItem>
                  <ListItemIcon>
                    <FastfoodIcon />
                  </ListItemIcon>
                  <ListItemText key={i} primary={ingredient} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h2" gutterBottom>
            Method
          </Typography>
          <List component="ol">
            {recipe.method.split(". ").map((step, i) => (
              <ListItem>
                <ListItemIcon>
                  <ArrowForwardIosIcon />
                </ListItemIcon>
                <ListItemText key={i} primary={step} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}
