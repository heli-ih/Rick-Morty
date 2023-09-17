import { useEffect, useState } from "react";
import { allCharacters, episodes } from "../data/data";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar, { Search, SearchResult, Favorite } from "./components/Navbar";
import CharacterList from "./components/CharacterList";
import CharacterDetails from "./components/CharacterDetails";
import { IdentificationIcon } from "@heroicons/react/24/outline";

function App() {
  const [char, setChar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("FAVORITES")) || []
  );
  // .THEN .CATCH SYNTAX
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch("https://rickandmorty api.com/api/character")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Something went wrong!");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setChar(data.results.slice(0, 6));
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       toast.error(err.message);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, []);

  // ASYNC / AWAIT SYNTAX

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://rickandmortyapi.com/api/character?name=${query}`
        );
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        setChar(data.results.slice(0, 6));
      } catch (err) {
        setChar([]);
        // err.response.data.message

        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query]);

  // useEffect(() => {
  //   console.log("call on first mount");
  // }, [query]);

  useEffect(() => {
    localStorage.setItem("FAVORITES", JSON.stringify(favorites));
  }, [favorites]);

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId == id ? null : id));
  };

  const handleAddFav = (character) => {
    // prevChar to clone the "favorites" instead of rewriting it
    setFavorites((prevChar) => [...prevChar, character]);
  };

  const handleDeleteFav = (id) => {
    setFavorites(favorites.filter((fav) => fav.id != id));
  };

  // A derived state
  const isAddedToFav = favorites.map((fav) => fav.id).includes(selectedId);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult characters={char} />
        <Favorite favorites={favorites} onDelete={handleDeleteFav} />
      </Navbar>
      <Main>
        <CharacterList
          characters={char}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
          selectedId={selectedId}
        />
        <CharacterDetails
          episodes={episodes}
          selectedId={selectedId}
          addFav={handleAddFav}
          isAddedToFav={isAddedToFav}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
