import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
    [theme.breakpoints.down("xs")]: {
      fontSize: 64,
    },
  },
  root: {
    width: "100%",
  },
  textField: {
    width: "60%",
    maxWidth: theme.spacing(120),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    marginTop: "1rem",
    marginBottom: "1rem",
  },
}));

export default function Home() {
  const classes = useStyles();

  let [session, loading] = useSession();

  const handleDisplayNameCreation = () => {
    console.log("send post request to create display name");
  };

  const fetchSessionData = async () => {
    console.log("fetching additional user data");
    return { display_name: "bob" };
  };

  useEffect(async () => {
    if (!loading) {
      const additionalSessionData = await fetchSessionData();
      session = { ...session, ...additionalSessionData };
      if (!session?.display_name) {
        console.log(session);
        handleDisplayNameCreation();
      }
    }
  }, [loading]);

  return (
    <Layout title="Login" flex other>
      <Grid container justify="center" alignItems="center">
        <Link href="/">Back to home page</Link>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.title} gutterBottom>
            Login
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Log in using Google
          </Typography>
          <>
            {loading && <h2>Loading...</h2>}

            {!loading && !session && (
              <>
                Not signed in <br />
                <Button onClick={() => signIn()}>Sign in</Button>
                <pre>{!session && "User is not logged in"}</pre>
              </>
            )}
            {!loading && session && (
              <>
                Signed in as{" "}
                {session.display_name ? "display_name" : session.user.email}{" "}
                <br />
                <Button onClick={() => signOut()}>Sign out</Button>
                {session.accessToken && <pre>User has access token</pre>}
              </>
            )}
          </>
        </Grid>
      </Grid>
    </Layout>
  );
}
