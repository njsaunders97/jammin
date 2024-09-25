import React from 'react';
import './SearchBar.module.css';

function SearchBar({ onSearchBarUpdate, onSearchBarSubmit }) {
    return ( 
        <form onSubmit={onSearchBarSubmit}>
            <label htmlFor="searchQuery">Search</label>
            <input
            name="searchQuery"
            type="text"
            id="searchQuery"
            onChange={onSearchBarUpdate}
            />
        </form>
    )
};

export default SearchBar;