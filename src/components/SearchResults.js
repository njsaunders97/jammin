import React from 'react';
import './SearchResults.module.css';
import Tracklist from './Tracklist';

function SearchResults({ searchResults }) {
    return(
        <Tracklist searchResults={searchResults} />
    )

};

export default SearchResults;