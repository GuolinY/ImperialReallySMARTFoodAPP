import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/_Layout";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Card,
  CardHeader,
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

  const [session, loading] = useSession();
  if (!loading) {
    console.log(session);
  }

  const handleDisplayNameCreation = () => {
    console.log("send post request to create display name");
  }

  return (
    <Layout title="A Really Smart Food App" flex>
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
                {session.username ? "username" : session.user.email} <br />
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

// export default function Home() {
//   const [session, loading] = useSession();

//   return (

//   );
// }
