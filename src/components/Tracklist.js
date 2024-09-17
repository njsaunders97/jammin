import React from 'react';
import './Tracklist.module.css';
import Track from './Track';


function Tracklist({ tracks, onRemoveTrack, onAddTrack }) {
    return (
        <div>
            {tracks.length > 0 ? tracks.map(track => (
            <Track 
            key={track.id} 
            track={track} 
            onRemoveTrack={onRemoveTrack} 
            onAddTrack={onAddTrack} />
            )) : <p>No tracks to display</p>}
        </div>
    )
}

export default Tracklist;