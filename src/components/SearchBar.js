import React from 'react';
import './SearchBar.module.css';

function SearchBar({ onSearchBarUpdate, onSearchBarSubmit }) {
    return ( 
        <form autocomplete="off" onSubmit={onSearchBarSubmit}>
            <input
            name="searchQuery"
            type="text"
            id="searchQuery"
            onChange={onSearchBarUpdate}
            />
            <button onClick={onSearchBarSubmit}>Search</button>
        </form>
    )
};

export default SearchBar;