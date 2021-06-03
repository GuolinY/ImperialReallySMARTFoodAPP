import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box } from "@material-ui/core";
import Image from 'next/image'
import TimerIcon from '@material-ui/icons/Timer';
import WhatshotIcon from '@material-ui/icons/Whatshot';

export async function getStaticProps() {
    const res = await fetch(`http://smart-food-app-backend.herokuapp.com/recipe/cheese_bread_watermelon`)
    const recipes = await res.json()
    return {
        props: { recipes }, // will be passed to the page component as props
    }
}

function secondsToHm(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay;
}

const useStyles = makeStyles((theme) => ({
    tile: {
        outline: "3px solid black",
        borderRadius: '5px',
        color: theme.palette.text.primary,
        margin: '2rem',
        textAlign: 'center',
    },
    preview: {
        borderRadius: '50%',
        border: '2px solid black',
    },
    title: {
        marginBottom: '4rem',
    },
    iconsAndText: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    nutrition: {
        textAlign: 'left',
    },
    nutritionalData: {
        float: 'right',
    }
}));

function Tile(props) {
    const classes = useStyles();
    const { recipe } = props;

    return (
        <Grid alignContent='center' justify='center' className={classes.tile} item xs={12} md={6} xl={3}>
            <Typography variant="h4">{recipe.name}</Typography>
            <Image src={recipe.image_link} width={200} height={200} alt="balkan suprise" className={classes.preview} />
            <Typography className={classes.iconsAndText}>
                <Rating name="read-only" value={recipe.rating} readOnly />&nbsp;({recipe.no_reviews})
            </Typography>
            <Typography className={classes.iconsAndText} variant='h6'>
                <TimerIcon /> &nbsp; {secondsToHm(recipe.cooking_time)} &nbsp; | &nbsp; {Array(recipe.difficulty).fill(<WhatshotIcon />)}
            </Typography>
            <Typography variant='body1'>{recipe.description}</Typography>
            <Typography className={classes.nutrition} variant='body2'>
                Calories: <span className={classes.nutritionalData}>{recipe.nutrition.calories}</span><br />
                Carbohyrdates: <span className={classes.nutritionalData}>{recipe.nutrition.carbohydrates}</span><br />
                Protein: <span className={classes.nutritionalData}>{recipe.nutrition.protein}</span><br />
                Fat: <span className={classes.nutritionalData}>{recipe.nutrition.fats}</span>
            </Typography>
        </Grid>
    );
}

Tile.propTypes = {
    recipe: PropTypes.object.isRequired,
};

export default function ValidRecipes({ recipes }) {
    const classes = useStyles();
    console.log({ recipes })

    return (
        <Layout title="Available Recipes">
            <Typography className={classes.title} variant='h1'>Recipes you can make...</Typography>
            <Grid container alignItems="center" justify="center" spacing={10}>
                {recipes.map((recipe, i) => (
                    <Tile key={i} recipe={recipe} />
                ))}
            </Grid>
        </Layout>
    );
}

