import React, { useState, useEffect } from "react";
import Layout from "../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Paper,
} from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";

import FastfoodIcon from "@material-ui/icons/Fastfood";

import { useRouter } from "next/router";
import ReviewsModal from "../components/ReviewsModal";
import axios from "axios";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { PLACEHOLDER_IMAGE } from "../components/Tile";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
    color: "white",
  },
  image: {
    borderRadius: "5%",
    border: "2px solid black",
  },
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-start",
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

export default function Recipe() {
  const classes = useStyles();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState({ id: -1 });

  useEffect(async () => {
    let newRecipe = await axios
      .get(
        `https://smart-food-app-backend.herokuapp.com/recipes/${router.query.id}`
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    setRecipe(newRecipe);
    if (router.query.id) {
      setLoading(false);
    }
  }, [router]);

  return (
    <Layout title={recipe?.name || "Recipe"} recipe>
      {!loading ? (
        recipe ? (
          <>
            <div
              style={{
                width: "100%",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
                  recipe.image_link.includes("placeholder")
                    ? "/images/food.png"
                    : recipe.image_link
                })`,
                height: "405px",
                backgroundColor: "purple",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  position: "relative",
                  top: "50%",
                  left: "50%",
                  transform: " translate(-50%, -50%)",
                }}
              >
                <Typography className={classes.title} variant="h2" gutterBottom>
                  {recipe.name}
                </Typography>
              </div>
            </div>
            <div style={{ marginTop: "40px" }}>
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
                <Paper style={{ padding: "16px" }} elevation={5}>
                  <Typography variant="h2" gutterBottom>
                    Ingredients
                  </Typography>
                  <List>
                    {recipe.ingredients
                      .concat(recipe.pantry_ingredients)
                      .map((ingredient, i) => {
                        return (
                          ingredient && (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <FastfoodIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                key={i}
                                primary={
                                  ingredient.charAt(0).toUpperCase() +
                                  ingredient.slice(1)
                                }
                              />
                            </ListItem>
                          )
                        );
                      })}
                  </List>
                </Paper>
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
                    <div key={`${step}_${i}`}>
                      <Typography variant="h6" className={classes.iconsAndText}>
                        <ChevronRightIcon color="secondary" />
                        Step {i + 1}
                      </Typography>
                      <ListItem key={i}>
                        <ListItemText
                          key={i}
                          primary={step}
                          primaryTypographyProps={{ paragraph: true }}
                        />
                      </ListItem>
                    </div>
                  ))}
                  {recipe.extra_link &&
                    recipe.extra_link !== "http://google.com" && (
                      <ListItem>
                        <Typography variant="h6">
                          For extra information{" "}
                          <Link href={recipe.extra_link} passHref>
                            <Button variant="outlined">Click here</Button>
                          </Link>
                        </Typography>
                      </ListItem>
                    )}
                </List>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography>No recipe found</Typography>
        )
      ) : (
        <Typography variant="h1">Loading...</Typography>
      )}
    </Layout>
  );
}
