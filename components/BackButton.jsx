import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Typography } from "@material-ui/core";

export default function BackButton({
  href = "/",
  message = "Back",
  style,
  query,
}) {
  return (
    <Link
      href={{
        pathname: href,
        query: query,
      }}
      passHref
    >
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        style={style}
      >
        {message}
      </Button>
    </Link>
  );
}

BackButton.propTypes = {
  href: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  style: PropTypes.object,
  query: PropTypes.object,
};
