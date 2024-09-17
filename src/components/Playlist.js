import React from 'react';
import './Playlist.module.css';
import Tracklist from './Tracklist';

function Playlist({ playlist, onRemoveTrack }) {
    return(
        <div>
            <h2>Playlist</h2>
            <Tracklist tracks={playlist} onRemoveTrack={onRemoveTrack} />
        </div>

    )

};

export default Playlist;
