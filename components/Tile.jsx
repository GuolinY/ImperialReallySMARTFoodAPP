import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography } from "@material-ui/core";
import Image from "next/image";
import TimerIcon from "@material-ui/icons/Timer";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import Link from "next/link";
import LocalDiningIcon from "@material-ui/icons/LocalDining";
import RatingAndReviews from "./RatingAndReviews";

function secondsToHm(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  return hDisplay + mDisplay;
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

  return (
    <Link href={`recipes/${recipe.id}`}>
      <Grid
        className={classes.tile}
        item
        xs={12}
        sm={6}
        lg={4}
        xl={3}
        style={{ cursor: "pointer" }}
      >
        <Typography variant="h4">{recipe.name}</Typography>
        <Image
          src={recipe.image_link}
          width={200}
          height={200}
          alt="balkan suprise"
          className={classes.preview}
        />
        <RatingAndReviews recipe={recipe} />
        <Typography className={classes.iconsAndText} variant="h6">
          <TimerIcon /> &nbsp; {secondsToHm(recipe.cooking_time)} &nbsp; |
          &nbsp;
          {Array(recipe.difficulty).fill(<WhatshotIcon />)}
        </Typography>
        <Typography variant="body1">{recipe.description}</Typography>
        <Typography className={classes.nutrition} variant="body2">
          Calories:
          <span className={classes.nutritionalData}>
            {recipe.nutrition.calories}
          </span>
          <br />
          Carbohyrdates:
          <span className={classes.nutritionalData}>
            {recipe.nutrition.carbohydrates}
          </span>
          <br />
          Protein:
          <span className={classes.nutritionalData}>
            {recipe.nutrition.protein}
          </span>
          <br />
          Fat:
          <span className={classes.nutritionalData}>
            {recipe.nutrition.fats}
          </span>
        </Typography>
      </Grid>
    </Link>
  );
}

Tile.propTypes = {
  recipe: PropTypes.object.isRequired,
};
