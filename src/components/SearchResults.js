import React from 'react';
import './SearchResults.module.css';
import Tracklist from './Tracklist';

function SearchResults({ searchResults, onAddTrack }) {
    return(
        <Tracklist searchResults={searchResults} onAddTrack={onAddTrack} />
    )

};

export default SearchResults;