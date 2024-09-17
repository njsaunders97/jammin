import React from 'react';
import './Tracklist.module.css';
import Track from './Track';


function Tracklist({ searchResults, onRemoveTrack, onAddTrack }) {
    return (
        <div>
            {searchResults.map(track => (
            <Track 
            key={track.id} 
            track={track} 
            onRemoveTrack={onRemoveTrack} 
            onAddTrack={onAddTrack} />
            ))}
        </div>
    )
}

export default Tracklist;