import React from "react";
import { useState, useEffect } from "react";
import { Typography, CircularProgress, Button } from "@material-ui/core";
import { toFirstCharuppercase } from "./constants";
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import {withStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';


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
