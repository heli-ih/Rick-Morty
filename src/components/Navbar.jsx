import { useState } from "react";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { Character } from "./CharacterList";

export default function Navbar({ children }) {
  return (
    <nav className="navbar">
      <div className="navbar__logo">🚀</div>
      {children}
    </nav>
  );
}

export function SearchResult({ characters }) {
  return (
    <div className="navbar__result">found {characters.length} characters</div>
  );
}

export function Search({ query, setQuery }) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      placeholder="search..."
      className="text-field"
    />
  );
}

export function Favorite({ favorites, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal title={"List of Favorites"} onOpen={setOpen} open={open}>
        {favorites.map((item) => (
          <Character key={item.id} item={item}>
            <TrashIcon className="icon red" onClick={() => onDelete(item.id)} />
          </Character>
        ))}
      </Modal>
      <button className="heart" onClick={() => setOpen(true)}>
        <HeartIcon className="icon" />
        <span className="badge">{favorites.length}</span>
      </button>
    </>
  );
}
