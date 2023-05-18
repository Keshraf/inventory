import { Dispatch, SetStateAction } from "react";

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex-1 sm:w-52 w-full min-h-[50px]">
      <input
        className="w-full text-black min-h-[50px] h-full indent-2 pr-2 py-1 sm:rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
