import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Layout({ title = "A Really Smart Food App", children, home }) {
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      <main className={styles.main}>{children}</main>

      {!home && <Link href='/'><a>Back to Ingredients List</a></Link>}

      <footer className={styles.footer}>
        A Really Smart Food App
      </footer>
    </div >
  );
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
};
