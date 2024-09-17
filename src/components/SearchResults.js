import React from 'react';
import './SearchResults.module.css';
import Tracklist from './Tracklist';

function SearchResults({ searchResults, onAddTrack }) {
    return(
        <div>
            <h2>Search Results</h2>
            <Tracklist tracks={searchResults} onAddTrack={onAddTrack} />    
        </div>
    )

};

export default SearchResults;