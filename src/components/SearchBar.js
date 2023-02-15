import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
// This half imports it - the search bar looks nicer but it still messes up
// the alignment (e.g. profile icon next to name is out of whack...?)
// import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
//import "../style/SearchBar.module.css";

function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const [searchList, setSearchList] = useState(options);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

  return (
    <>
      <form className="navbar__search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="navbar__search-input"
        />
        <button type="submit" className="navbar__search-button">
          <SearchIcon />
        </button>
      </form>
      {/* <div>
        <Select
          value={searchValue}
          options={searchList}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          openMenuOnClick={false}
        />
      </div> */}
    </>

    // <div>
    //   <input type="text" placeholder="Search" />
    // </div>

    // <div className="input-group mb-3">
    //   <input type="text" className="form-control" placeholder="Search" />
    // </div>
  );
}

export default SearchBar;
