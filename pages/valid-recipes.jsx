import Layout from '../components/_Layout'
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    tile: {
        outline: "1px black",
    },
}))


function Tile(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(2);

    return (
        <div className={classes.tile}>
            <img src={props.img} />
            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                />
            </Box>
        </div>
    )
}

export default function ValidRecipes() {
    return (<Layout title="Available recipes">
        <Tile img='' />
    </Layout>)
}