import {useEffect, useRef, useState} from "react";

import api from "./api";
import {Pokemon} from "./types";
import "./css/custom.css";

interface IScore {
  guess: number;
  error: number;
}

const Index = () => {
  const initialScore = {
    guess: 0,
    error: 0,
  };
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [guessPokemon, setGuessPokemon] = useState("");
  const [isGuessed, setIsGuessed] = useState(false);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<IScore>(initialScore);

  const modal = useRef(null);
  const getPokemon = async () => {
    const getPokemon = await api.random();

    setPokemon(getPokemon);
  };

  useEffect(() => {
    getPokemon();
    loadDataFromLocalStorage();
  }, []);

  const loadDataFromLocalStorage = () => {
    const localScore = localStorage.getItem("pokemonScore");

    if (localScore) {
      setScore(JSON.parse(localScore));
    }
  };

  useEffect(() => {
    localStorage.setItem("pokemonScore", JSON.stringify(score));
  }, [score]);

  const isGuess = async (guessPokemon: string) => {
    if (!guessPokemon) return;
    if (guessPokemon.trim().toLocaleLowerCase() === pokemon!.name.trim().toLocaleLowerCase()) {
      setIsGuessed(true);
      setScore({...score, guess: score.guess + 1});
    } else {
      setIsGuessed(false);
      setScore({...score, error: score.error + 1});
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isGuess(guessPokemon);
  };

  const playAgain = () => {
    getPokemon();
    setIsGuessed(false);
  };

  const resetScore = () => {
    setScore(initialScore);
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  if (!pokemon) return <div>cargando...</div>;

  return (
    <>
      {/* <div className="nes-text is-primary">{pokemon.name}</div> */}
      <div className="container">
        <a className="nes-badge" href="#">
          <span className="is-success">{score.guess}</span>
        </a>
        <a className="nes-badge" href="#">
          <span className="is-error">{score.error}</span>
        </a>
        <img
          alt={pokemon?.name}
          className={!isGuessed ? "cover" : undefined}
          src={pokemon?.image}
        />
        <form className="flex mb-4" onSubmit={onSubmit}>
          <input
            className={` mr-4 ${isGuessed ? "nes-input is-success" : "nes-input  is-error"}`}
            type="text"
            onChange={(e) => setGuessPokemon(e.target.value)}
          />
          <input
            className="nes-btn is-secondary"
            disabled={isGuessed}
            type="submit"
            value="adivinar"
          />
        </form>
        <div className="flex">
          <button className="nes-btn is-primary mr-4" onClick={playAgain}>
            Volver a jugar
          </button>
          <button className="nes-btn is-error" onClick={openModal}>
            Resetear puntos
          </button>
        </div>
        <dialog ref={modal} className="nes-dialog" id="dialog-default" open={open} role="dialog">
          <div className="nes-container  with-title is-centered mb-4">
            <p className="title"> Estas seguro de querer borrar los puntos?</p>
            <p>Tramposo se nace.</p>
          </div>
          <div>
            <button className="nes-btn mr-4" onClick={resetScore}>
              Si,segurisimo.
            </button>
            <button className="nes-btn" onClick={() => setOpen(false)}>
              Tengo miedo.
            </button>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Index;
