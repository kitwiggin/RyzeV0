import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";

function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const [searchList, setSearchList] = useState(options);

  //   function handleSearch(e) {
  //     event.preventDefault();
  //     console.log(searchValue);
  //   }

  return (
    // <form className="navbar__search-form" onSubmit={handleSearch}>
    //   <input
    //     type="text"
    //     placeholder="Search"
    //     value={searchValue}
    //     onChange={(e) => setSearchValue(e.target.value)}
    //     className="navbar__search-input"
    //   />
    //   <button type="submit" className="navbar__search-button">
    //     <SearchIcon />
    //   </button>
    // </form>
    <div>
      <Select
        value={searchValue}
        options={searchList}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        openMenuOnClick={false}
      />
    </div>
  );
}

export default SearchBar;
