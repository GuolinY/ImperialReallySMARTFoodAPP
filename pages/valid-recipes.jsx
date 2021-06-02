import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Grid, Typography, Box } from "@material-ui/core";
import Image from 'next/image'
import TimerIcon from '@material-ui/icons/Timer';
import ChildCareIcon from '@material-ui/icons/ChildCare';

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
        //borderRadius: '5px',
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
}));

function Tile(props) {
    const classes = useStyles();
    const { recipe } = props;

    return (
        <Grid alignContent='center' justify='center' className={classes.tile} item xs={12} md={6} xl={3}>
            <Typography variant="h4">{recipe.name}</Typography>
            <Image src={recipe.img} width={200} height={200} alt="balkan suprise" className={classes.preview} />
            <Rating name="read-only" value={recipe.rating} readOnly />({recipe.review_number})
            <Typography variant='h6' className={classes.info}>
                <TimerIcon /> {secondsToHm(recipe.cooking_time)} | <ChildCareIcon />
            </Typography>
            <Typography variant='body1'>{recipe.description}</Typography>
            <Typography variant='body2'>
                Calories: {recipe.nutrition.calories}<br />
                Carbohyrdates: {recipe.nutrition.carbohydrates}<br />
                Protein: {recipe.nutrition.protein}<br />
                Fat: {recipe.nutrition.fat}
            </Typography>
        </Grid>
    );
}

Tile.propTypes = {
    recipe: PropTypes.object.isRequired,
};

export default function ValidRecipes() {
    const classes = useStyles();
    const recipes = [
        // fake api response
        {
            id: 1,
            name: "Balkan surprise",
            img: '/images/balkan-suprise.jpg', // TODO add image
            rating: 2.5,
            reviews: null, // TODO add link to fetch reviews
            review_number: 9,
            cooking_time: 1200, // time measured in seconds
            difficulty: "easy",
            description: "Bread, cheese and one 'special' ingredient",
            dietary_requirements: ["halal"],
            nutrition: {
                calories: 200,
                carbohydrates: "200g",
                protein: "200g",
                fat: "20g",
            },
        },
        {
            id: 1,
            name: "Balkan surprise",
            img: '/images/balkan-suprise.jpg', // TODO add image
            rating: 2.5,
            reviews: null, // TODO add link to fetch reviews
            review_number: 9,
            cooking_time: 1200, // time measured in seconds
            difficulty: "easy",
            description: "Bread, cheese and one 'special' ingredient",
            dietary_requirements: ["halal"],
            nutrition: {
                calories: 200,
                carbohydrates: "200g",
                protein: "200g",
                fat: "20g",
            },
        },
        {
            id: 1,
            name: "Balkan surprise",
            img: '/images/balkan-suprise.jpg', // TODO add image
            rating: 2.5,
            reviews: null, // TODO add link to fetch reviews
            review_number: 9,
            cooking_time: 1200, // time measured in seconds
            difficulty: "easy",
            description: "Bread, cheese and one 'special' ingredient",
            dietary_requirements: ["halal"],
            nutrition: {
                calories: 200,
                carbohydrates: "200g",
                protein: "200g",
                fat: "20g",
            },
        },
    ];

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
