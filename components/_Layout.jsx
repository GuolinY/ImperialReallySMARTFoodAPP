import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";

export default function Layout({
  title = "A Really Smart Food App",
  children,
  home,
}) {
  const redirect = (url) => {
    console.log(url);
    window.location = url;
  };

  return (
    <div className={styles.container}>
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

      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <Typography style={{ textAlign: "center" }} variant="body1">
          A Really Smart Food App{" "}
        </Typography>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
};
