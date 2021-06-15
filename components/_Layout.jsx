import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import { Typography, AppBar, Toolbar } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function Layout({
  title = "A Really Smart Food App",
  flex = false,
  children,
  home,
  validRecipes,
  recipe,
  other,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={flex ? styles.flexContainer : styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="body1"
            style={{ fontFamily: "Abril Fatface" }}
            noWrap
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link href="/login" passHref>
            <ListItem button component="a">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          </Link>

          <Link href="/new-recipe" passHref>
            <ListItem button component="a">
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="New Recipe" />
            </ListItem>
          </Link>

          <Link href="/all-recipes" passHref>
            <ListItem button component="a">
              <ListItemIcon>
                <CollectionsBookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="All Recipes" />
            </ListItem>
          </Link>

          {!home && (
            <>
              <Divider />
              <Link href="/" passHref>
                <ListItem button component="a">
                  <ListItemIcon>
                    <ChevronLeftIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={other ? "Home" : "Back to Ingredients"}
                  />
                </ListItem>
              </Link>
            </>
          )}

          {recipe && (
            <Link href="/valid-recipes" passHref>
              <ListItem button component="a">
                <ListItemIcon>
                  <ChevronLeftIcon />
                </ListItemIcon>
                <ListItemText primary="Back to Recipes" />
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>

      <main className={styles.main}>{children}</main>
      {/* <footer className={styles.footer}>
        <Typography style={{ textAlign: "center" }} variant="body1">
          A Really Smart Food App{" "}
        </Typography>
      </footer> */}
    </div>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  flex: PropTypes.bool,
  children: PropTypes.any,
};
