import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography } from "@material-ui/core";
import Link from "next/link";
import LocalDiningIcon from "@material-ui/icons/LocalDining";

const useStyles = makeStyles((theme) => ({
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: "#cc0000",
  },
  iconHover: {
    color: "#cc0000",
  },
})(Rating);

export default function RatingAndReviews({ recipe, size = "small" }) {
  const classes = useStyles();

  return (
    <Typography variant="body1" className={classes.iconsAndText}>
      <StyledRating
        value={recipe.rating}
        precision={0.5}
        readOnly
        name="Recipe Rating"
        size={size}
        icon={<LocalDiningIcon fontSize="inherit" />}
      />
      &nbsp;({recipe.no_reviews})
    </Typography>
  );
}
