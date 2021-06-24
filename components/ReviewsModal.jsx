import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  Container,
  Avatar,
  IconButton,
  Box,
  Slider,
  Grid,
  TextField,
  FormLabel,
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
import * as yup from "yup";
import { FieldArray, Form, Formik, Field } from "formik";

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
  reviewModal: {
    width: "90%",
    maxWidth: theme.spacing(100),
    maxHeight: theme.spacing(80),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  title: yup.string().required(),
  content: yup.string().required(),
  rating: yup.number().required(),
});

const ratingMarks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

export default function ReviewsModal({ recipe, size = "small" }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviews, setReviews] = useState([]);

  const refreshReviews = async () => {
    setLoadingReviews(true);
    const res = await axios.get(
      `https://smart-food-app-backend.herokuapp.com/reviews/${recipe.id}`
    );
    console.log(res.data);
    if (res?.data) {
      const newReviews = [...res.data];
      setReviews(newReviews);
    } else {
      setReviews([]);
    }
    setLoadingReviews(false);
  };

  const handleOpen = async () => {
    refreshReviews();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <RatingAndReviews recipe={recipe} size={size} />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        PaperProps={{
          className: classes.reviewModal,
        }}
      >
        <Paper elevation={24} variant="outlined" style={{ padding: 16 }}>
          <DialogContent>
            <Box
              className={classes.iconsAndText}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="h5">Reviews for {recipe.name}</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogContent>
            <Formik
              initialValues={{
                title: "",
                rating: 5,
                content: "",
                user: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const res = await axios
                  .post(
                    "https://smart-food-app-backend.herokuapp.com/reviews/submit",
                    { ...values, recipe_id: recipe.id }
                  )
                  .then((result) => {
                    console.log(result);
                    resetForm();
                    values = {};
                    refreshReviews();
                  });
              }}
            >
              {({ values, touched, errors, handleChange, setFieldValue }) => (
                <Form autoComplete="off">
                  <Paper elevation={1} style={{ padding: 32 }}>
                    <Grid
                      container
                      direction="column"
                      alignItems="stretch"
                      spacing={2}
                    >
                      <Typography variant="h6" gutterBottom>
                        Submit a new review
                      </Typography>
                      <Grid item xs={12}>
                        <TextField
                          id="title"
                          variant="outlined"
                          label="Title"
                          value={values.title}
                          onChange={handleChange}
                          error={touched.title && Boolean(errors.title)}
                          helperText={touched.title && errors.title}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        className={classes.iconsAndText}
                        spacing={2}
                        justify="space-between"
                      >
                        <Grid item>
                          <FormLabel>Rating:</FormLabel>
                        </Grid>
                        <Grid item>
                          <Rating
                            id="rating"
                            name="rating"
                            value={values.rating}
                            onChange={(e) =>
                              setFieldValue("rating", parseInt(e.target.value))
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid item>
                        <TextField
                          id="content"
                          variant="outlined"
                          label="Review"
                          value={values.content}
                          placeholder="What would you like or dislike about this recipe?"
                          onChange={handleChange}
                          error={touched.content && Boolean(errors.content)}
                          helperText={touched.content && errors.content}
                          multiline
                          rows={3}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <Button variant="contained" type="submit">
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  {/* <>
                    <pre style={{ textAlign: "left" }}>
                      <strong>Values</strong>
                      <br />
                      {JSON.stringify(values, null, 2)}
                    </pre>
                    <pre style={{ textAlign: "left" }}>
                      <strong>Errors</strong>
                      <br />
                      {JSON.stringify(errors, null, 2)}
                    </pre>
                  </> */}
                </Form>
              )}
            </Formik>
          </DialogContent>
          {loadingReviews ? (
            <DialogContent>
              <Typography variant="h5" style={{ marginBottom: 8 }}>
                Loading...
              </Typography>
            </DialogContent>
          ) : reviews?.length > 0 ? (
            reviews.map((r, i) => (
              <DialogContent key={i}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" style={{ marginBottom: 8 }}>
                      {r.title}
                    </Typography>
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
            <DialogContent>
              <Typography variant="h5">
                There are no reviews for this recipe
              </Typography>
            </DialogContent>
          )}
        </Paper>
      </Dialog>
    </div>
  );
}

ReviewsModal.propTypes = {
  recipe: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
};
