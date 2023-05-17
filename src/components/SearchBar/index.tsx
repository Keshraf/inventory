import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Dispatch, SetStateAction } from "react";

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <input
        value={query}
        id="search"
        type="text"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
