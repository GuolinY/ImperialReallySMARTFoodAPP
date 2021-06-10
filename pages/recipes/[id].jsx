import React from "react";
import Layout from "../../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import Image from "next/image";

import FastfoodIcon from "@material-ui/icons/Fastfood";

import { useRouter } from "next/router";
import ReviewsModal from "../../components/ReviewsModal";
import axios from "axios";

export async function getStaticPaths() {
  const res = await axios.get(
    `https://smart-food-app-backend.herokuapp.com/recipes/all`
  );

  const data = await res.data;

  const paths = data.ids.map((id) => {
    return {
      params: { id: id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const res = await axios.get(
    `https://smart-food-app-backend.herokuapp.com/recipes/${context.params.id}`
  );
  const recipe = await res.data;
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
    width: "90%",
    maxWidth: theme.spacing(180),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: theme.spacing(1),
    },
  },
  recipeTileContainer: {
    padding: theme.spacing(4),
    width: "90%",
    maxWidth: theme.spacing(180),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: theme.spacing(1),
    },
  },
}));

export default function Recipe({ recipe }) {
  const classes = useStyles();
  const router = useRouter();
  console.log(recipe);

  return (
    <Layout title={recipe.name} recipe>
      <div>
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
        <ReviewsModal recipe={recipe} />
      </div>
      <Grid container spacing={10} className={classes.container}>
        <Grid
          item
          container
          direction="column"
          alignItems="flex-start"
          xs={12}
          md={5}
          lg={4}
        >
          <Typography variant="h2" gutterBottom>
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map((ingredient, i) => {
              return (
                <ListItem key={i}>
                  <ListItemIcon>
                    <FastfoodIcon />
                  </ListItemIcon>
                  <ListItemText key={i} primary={ingredient} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={7}
          lg={8}
          direction="column"
          alignItems="flex-start"
        >
          <Typography variant="h2" gutterBottom>
            Method
          </Typography>
          <List component="ol">
            {recipe.method.split("\n").map((step, i) => (
              <ListItem key={i}>
                <ListItemText
                  key={i}
                  primary={step}
                  primaryTypographyProps={{ paragraph: true }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}
