import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function CharacterDetails({ selectedId, isAddedToFav, addFav }) {
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const eps = data.episode.map((url) => url.split("/").at(-1));
        const { data: epData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${eps}`
        );
        // console.log(epData);
        setEpisodes([epData].flat().slice(0, 10));
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
    // to avoid the error of value null in the first render
    if (selectedId) fetchData();
  }, [selectedId]);

  if (!character || !selectedId)
    return (
      <div style={{ flex: 1 }}>
        <div className="bg-container ">
          <img
            src="../../img/rick-and-morty-8rc57d4ds44gqzau.jpg"
            alt=""
            className="character-bg"
          />
        </div>

        {/* <div className="badge badge--secondary">
          Please select a character...

        </div> */}
      </div>
    );

  return (
    <div style={{ flex: 1 }}>
      <CharacterInfo
        character={character}
        isAddedToFav={isAddedToFav}
        addFav={addFav}
      />
      <CharacterEpisode episodes={episodes} />
    </div>
  );
}

export default CharacterDetails;

function CharacterInfo({ character, isAddedToFav, addFav }) {
  return (
    <div className="character-detail">
      <img
        className="character-detail__img"
        src={character.image}
        alt={character.name}
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender == "Male" ? "👨🏼" : "👩🏼"}</span>
          <span className="name">&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status == "Dead" ? "red" : "green"}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span> - &nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddedToFav ? (
            <p className="badge">Already added to favorites✅</p>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => addFav(character)}
            >
              Add to Favorite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CharacterEpisode({ episodes }) {
  const [sortBy, setSortBy] = useState(true);

  let sortedEpisodes;

  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of episodes</h2>
        <button
          onClick={() => {
            setSortBy(!sortBy);
          }}
        >
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")} - {item.episode} :{" "}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
