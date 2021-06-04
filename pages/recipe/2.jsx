import React from "react";
import PropTypes from "prop-types";
import Layout from "../../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box, ThemeProvider } from "@material-ui/core";
import Image from "next/image";
import TimerIcon from "@material-ui/icons/Timer";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { withStyles } from "@material-ui/core/styles";
import LocalDiningIcon from "@material-ui/icons/LocalDining";

export async function getStaticProps() {
  const res = await fetch(
    `http://smart-food-app-backend.herokuapp.com/recipe/2`
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
  image: {
    borderRadius: "50%",
    border: "2px solid black",
  },
  title: {
    marginBottom: "1`rem",
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
  ingredientsSubtitle: {},
  method: {
    "& ol": {
      "& li": {
        marginBottom: "1rem",
      },
    },
  },
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ingredients: {
    "& ul": {
      "& li": {
        marginBottom: "1rem",
      },
    },
  },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

export default function Recipe({ recipe }) {
  const classes = useStyles();
  console.log(recipe);

  return (
    <Layout title={recipe.name}>
      <Image
        src={recipe.image_link}
        width={200}
        height={200}
        alt="balkan surprise"
        className={classes.image}
      />
      <Typography className={classes.title} variant="h2">
        {recipe.name}
      </Typography>
      <Typography className={classes.iconsAndText}>
        <StyledRating
          value={recipe.rating}
          precision={0.5}
          readOnly
          name="customized-color"
          size="large"
          icon={<LocalDiningIcon fontSize="inherit" />}
        />
        &nbsp;({recipe.no_reviews})
      </Typography>
      <Grid
        container
        alignItems="flex-start"
        spacing={10}
        className={classes.container}
      >
        <Grid item className={classes.ingredients} xs={12} sm={3}>
          <Typography variant="h2" className={classes.ingredientsSubtitle}>
            Ingredients
          </Typography>
          <ul>
            {recipe.ingredients.map((ingredient, i) => {
              return <li key={i}>{ingredient}</li>;
            })}
          </ul>
        </Grid>
        <Grid className={classes.method} item xs={9}>
          <Typography variant="h2">Method</Typography>
          <ol>
            <li>First get your bread</li>
            <li>Grab your nearest watermelon and mash 'em together</li>
            <li>You have now made the Balkan surprise (without cheese)</li>
          </ol>
        </Grid>
      </Grid>
    </Layout>
  );
}

Recipe.propTypes = {
  recipes: PropTypes.object.isRequired,
};
