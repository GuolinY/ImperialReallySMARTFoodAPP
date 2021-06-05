import Link from "next/link";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Typography } from "@material-ui/core";

export default function BackButton({
  href = "/",
  ingredientList = "",
  message = "",
}) {
  return (
    <Link
      href={{
        pathname: "/",
        query: { ingredientList: ingredientList },
      }}
      passHref
    >
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<ArrowBackIcon />}
      >
        {message}
      </Button>
    </Link>
  );
}
