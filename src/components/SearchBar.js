import React from 'react';
import './SearchBar.module.css';

function SearchBar({ onSearchBarUpdate }) {
    return ( 
        <form>
            <label htmlFor="searchQuery">Search</label>
            <input
            name="name"
            type="text"
            id="searchQuery"
            onChange={onSearchBarUpdate}
            />
        </form>
    )
};

export default SearchBar;