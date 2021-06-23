import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
  Button,
  Switch,
} from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import Link from "next/link";

import ReviewsModal from "./ReviewsModal";

function secondsToHm(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  return hDisplay + mDisplay;
}

const useStyles = makeStyles((theme) => ({
  preview: {
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
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
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

export default function Tile(props) {
  const classes = useStyles();
  const { recipe } = props;

  function difficulty(level) {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
    }
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={recipe.name}
        titleTypographyProps={{ variant: "h4" }}
      />
      {recipe.image_link && (
        <CardMedia
          className={classes.media}
          image={
            recipe.image_link.includes("placeholder")
              ? "/images/food.png"
              : recipe.image_link
          }
          title={recipe.name}
        />
      )}
      <CardContent>
        <Typography className={classes.iconsAndText} variant="h6">
          <TimerIcon /> &nbsp; {secondsToHm(recipe.cooking_time)} &nbsp;
          {recipe.difficulty >= 1 &&
            recipe.difficulty <= 3 &&
            `| ${difficulty(recipe.difficulty)}`}
        </Typography>
        <Typography variant="body1">{recipe.description}</Typography>
        <Typography className={classes.nutrition} variant="body2">
          {recipe.nutrition.calories >= 0 && (
            <>
              Calories:
              <span className={classes.nutritionalData}>
                {recipe.nutrition.calories}
              </span>
              <br />
            </>
          )}
          {recipe.nutrition.calories >= 0 && (
            <>
              Carbohydrates:
              <span className={classes.nutritionalData}>
                {recipe.nutrition.carbohydrates}g
              </span>
              <br />
            </>
          )}
          {recipe.nutrition.calories >= 0 && (
            <>
              Protein:
              <span className={classes.nutritionalData}>
                {recipe.nutrition.protein}g
              </span>
              <br />
            </>
          )}
          {recipe.nutrition.calories >= 0 && (
            <>
              Fat:
              <span className={classes.nutritionalData}>
                {recipe.nutrition.fats}g
              </span>
            </>
          )}
        </Typography>
        <div style={{ textAlign: "left", padding: "12px 0px" }}>
          {recipe?.missing?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Typography variant="body1">
                Missing {recipe.missing.length} ingredient(s)
              </Typography>
            </div>
          )}
          {recipe?.notUsed?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Typography variant="body1">Not using:</Typography>
              {recipe.notUsed.join(", ")}
            </div>
          )}
          {recipe?.substitutions?.length > 0 && (
            <div>
              <Typography variant="body1">You can substitute:</Typography>
              {recipe.substitutions.map((sub, i) => (
                <p style={{ margin: 0 }} key={i}>
                  {sub}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardActions>
        <Link
          href={{ pathname: `/recipes`, query: { id: recipe.id } }}
          passHref
        >
          <Button color="primary" variant="contained">
            Let's Cook
          </Button>
        </Link>
        <ReviewsModal recipe={recipe} size="small" />
      </CardActions>
    </Card>
  );
}

Tile.propTypes = {
  recipe: PropTypes.object.isRequired,
};
