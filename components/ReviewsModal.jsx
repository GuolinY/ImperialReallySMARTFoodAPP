import { forwardRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { withStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  Container,
  Grid,
  CardActions,
  Avatar,
  IconButton,
  Box,
} from "@material-ui/core";
import RatingAndReviews from "./RatingAndReviews";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import LocalDiningIcon from "@material-ui/icons/LocalDining";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";

const StyledRating = withStyles({
  iconFilled: {
    color: "#6b5b95",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
  },
  iconsAndText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReviewssModal({ recipe }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleOpen = async () => {
    const res = await axios.get(
      `https://smart-food-app-backend.herokuapp.com/reviews/${recipe.id}`
    );
    console.log(res.data);
    if (res?.data) {
      setReviews(res.data);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <RatingAndReviews recipe={recipe} />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <Paper elevation={24} outlined style={{ padding: 16 }}>
          <Box
            className={classes.iconsAndText}
            display="flex"
            justifyContent="space-between"
          >
            <Typography variant="h6">Reviews</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {reviews?.length > 0 ? (
            reviews.map((r, i) => (
              <DialogContent item xs={12}>
                <Card variant="outlined">
                  <CardHeader
                    title={title}
                    avatar={<Avatar>{r.user.charAt(0)}</Avatar>}
                  />
                  <CardContent>
                    <StyledRating
                      value={r.rating}
                      precision={0.5}
                      readOnly
                      name="Recipe Rating"
                      size="medium"
                      icon={<LocalDiningIcon fontSize="inherit" />}
                    />
                    <Typography>{r.content}</Typography>
                  </CardContent>
                </Card>
              </DialogContent>
            ))
          ) : (
            <Typography>There are no reviews for this recipe</Typography>
          )}
        </Paper>
      </Dialog>
    </div>
  );
}
