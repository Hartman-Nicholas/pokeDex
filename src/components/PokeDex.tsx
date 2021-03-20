import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Field } from 'react-final-form';

interface pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: [{ type: { name: string } }];
  sprites: { front_default?: string };
  response: { status: number };
}

interface pokemonSWOT {
  damage_relations: { double_damage_from: [{ name: string }]; double_damage_to: [{ name: string }] };
}

const PokeDex: React.FC = () => {
  const [callPokemon, setPokemon] = useState({} as pokemon);
  const [callSWOT, setSwot] = useState({} as pokemonSWOT);
  const [callError, setError] = useState(0);

  const typeStyle = () => {
    const pokemonType = callPokemon.types[0].type.name;
    switch (pokemonType) {
      case 'fire':
        return 'bg-red-300';
      case 'water':
        return 'bg-blue-300';
      case 'ground':
        return 'bg-yellow-400';
      case 'grass':
        return 'bg-green-400';
      default:
        return 'bg-green-200';
    }
  };

  useEffect(() => {
    const defaultSearch = { SearchPokemon: 'Charizard' };
    onSearchSubmit(defaultSearch);
  }, []);

  const onSearchSubmit = async (value: { SearchPokemon: string }) => {
    const responsePokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${value.SearchPokemon.toLowerCase()}`).catch((error) => {
      return error.response;
    });

    if (responsePokemon.status === 404) {
      setError(responsePokemon.status);
      return;
    } else {
      setError(0);
    }
    console.log(responsePokemon);

    const pokemon: pokemon = responsePokemon.data;
    const type = pokemon.types[0].type.name;

    const responseSWOT = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const pokemonSWOT: pokemonSWOT = responseSWOT.data;

    setSwot(pokemonSWOT);
    setPokemon(pokemon);
  };

  const isEmpty = (obj: {}) => Object.keys(obj).length === 0;

  const renderWeakness = () => {
    const damageFrom = callSWOT.damage_relations.double_damage_from;
    const renderList = damageFrom.map((value) => {
      return <p key={value.name}>{value.name}</p>;
    });
    return renderList;
  };

  const renderStrength = () => {
    const damageFrom = callSWOT.damage_relations.double_damage_to;
    const renderList = damageFrom.map((value) => {
      return <p key={value.name}>{value.name}</p>;
    });
    return renderList;
  };

  const pokemonNotFound = () => {
    if (callError === 404) {
      return <div className="m-2 text-red-500">Please enter a valid pokemon</div>;
    }
  };

  const isPokemonLoaded = () => {
    if (isEmpty(callPokemon)) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md object-center">
          <img src={callPokemon.sprites.front_default} alt="pokemon" className="object-contain h-48 w-full ..."></img>
          <div className={`p-6 text-center ${typeStyle()}`}>
            <h4 className="font-semibold text-lg">{callPokemon.name}</h4>
            <div>ID: {callPokemon.id}</div>
            <div>Height: {callPokemon.height}</div>
            <div>Weight: {callPokemon.weight}</div>
            <div className="pb-2">Type: {callPokemon.types[0].type.name}</div>
            <div className="flex flex-wrap">
              <div className="px-4 mr-2 ml-2">
                <h4 className="font-semibold text-lg">Weakness</h4>
                {renderWeakness()}
              </div>
              <div className="px-4 mr-2 ml-2">
                <h4 className="font-semibold text-lg">Strength</h4>
                {renderStrength()}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Form
        onSubmit={onSearchSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="py-6">
            <div>
              <label className="m-2">Search Pokemon:</label>
              <Field name="SearchPokemon" component="input" placeholder=" Pokemon" />
              {pokemonNotFound()}
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4 ">
              Submit
            </button>
          </form>
        )}
      />
      <div className="max-w flex items-center justify-center">{isPokemonLoaded()}</div>
    </div>
  );
};

export default PokeDex;
