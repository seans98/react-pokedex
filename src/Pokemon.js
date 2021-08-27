import React from "react";
import { useState, useEffect } from "react";
import { Typography, CircularProgress, Button } from "@material-ui/core";
import { toFirstCharuppercase } from "./constants";
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles({
  typeColors: {
    bug: "#729f3f",
    dragon: "#53a4cf",
    fairy: "#fdb9e9",
    fire: "#fd7d24",
    ghost: "#7b62a3",
    ground: "#f7de3f",
    normal: "#a4acaf",
    pyschic: "#f366b9",
    steel: "#9eb7b",
    dark: "#707070",
    electric: "#eed535",
    fighting: "#d56723",
    flying: "#3dc7ef",
    grass: "#9bcc50",
    ice: "#51c4e7",
    poison: "#b97fc9",
    rock: "#a38c21",
    water: "#4592c4",
  },
});


const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);


const Pokemon = (props) => {
  const { history, match } = props;
  const { params } = match;
  const { pokemonId } = params;
  const [pokemon, setPokemon] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
      .then((response) => {
        const { data } = response;
        setPokemon(data);
      })
      .catch((err) => {
        setPokemon(false);
      });
  }, [pokemonId]);

  const generatePokemonJSX = () => {
    const { name, id, height, weight, types, sprites, stats } = pokemon;
    const fullImageUrl = `https://img.pokemondb.net/sprites/home/normal/${name}.png`;
    const { front_default } = sprites;
    return (
      <>
        <Typography variant="h1">
          #{id} {toFirstCharuppercase(name)}
          <img src={front_default} alt="Sprite" />
        </Typography>
        <img
          style={{ width: "300px", height: "300px" }}
          src={fullImageUrl}
          alt="pokemon"
        />
        <Typography variant="h3">Pokemon Info</Typography>
        <Typography>
          Height: <Chip label={`${height}`} />
        </Typography>
        <Typography>
          Weight: <Chip label={weight} />
        </Typography>
        <Typography variant="h6">Types:</Typography>
        {types.map((typeInfo) => {
          const { type } = typeInfo;
          const { name } = type;
          return (
            <Typography key={name}>
              <Chip
                label={`${name}`}
                color="primary"
                style={{ backgroundColor: classes.typeColors.steel }}
              />
            </Typography>
          );
        })}
        <Typography variant="h6">Stats:</Typography>
        {stats.map((statInfo) => {
          const {base_stat, stat} = statInfo;
          const { name } = stat;
          return (
            <Typography key={name}>{name}: {base_stat}<BorderLinearProgress variant="determinate" value={base_stat} /></Typography>
          )
        })}
      </>
    );
  };
  return (
    <>
      {pokemon === undefined && <CircularProgress />}
      {pokemon !== undefined && pokemon && generatePokemonJSX(pokemon)}
      {pokemon === false && <Typography>Pokemon Not Found</Typography>}
      {pokemon !== undefined && (
        <Button variant="contained" onClick={() => history.push("/")}>
          Back To Pokedex
        </Button>
      )}
    </>
  );
};

export default Pokemon;
