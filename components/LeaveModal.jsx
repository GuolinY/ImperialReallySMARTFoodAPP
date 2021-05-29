import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Modal,
  Fade,
  Backdrop,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
}));

export default function LeaveModal({ url, open, handleOpen, handleClose }) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="modal"
      aria-describedby="this is a modal"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">
            Are you sure you want to leave this site?
          </h2>
          <p id="transition-modal-description">
            You are being redirected to {url}
          </p>
          <Button onClick={() => (document.location.href = url)}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </div>
      </Fade>
    </Modal>
  );
}
