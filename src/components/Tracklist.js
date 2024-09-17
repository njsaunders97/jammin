import React from 'react';
import './Tracklist.module.css';
import Track from './Track';


function Tracklist({ searchResults }) {
    return (
        <div>
            {searchResults.map(track => (
            <Track key={track.id} track={track} />
            ))}
        </div>
    )
}

export default Tracklist;