import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Paper, Grid, TextField, Button } from "@material-ui/core";
import Link from "next/link";

import Layout from "../../components/_Layout";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {},
}));

export default function Projects() {
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [lists, setList] = useState(["salt", "eggs", "apples"]);
  const listItems = lists.map((item, i) => <li key={i}>{item}</li>);

  const handleOnChange = (event) => {
    setInput(event.target.value);
    console.log(event.target.value);
  };

  const handleClick = () => {
    setList([...lists, input]);
    setInput("");
  };

  return (
    <Layout title="Example">
      <Container>
        <div>
          <Link href="example/page">
            <a>Test</a>
          </Link>
        </div>
        <br />
        <br />
        <TextField
          id="standard-basic"
          label="Standard"
          value={input}
          onChange={handleOnChange}
        />
        <Button variant="contained" onClick={handleClick}>
          Default
        </Button>
        {listItems}
        <br />
        <Link href="/">
          <a>Return Home</a>
        </Link>
      </Container>
    </Layout>
  );
}
