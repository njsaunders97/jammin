import React from 'react';
import './Playlist.module.css';
import Tracklist from './Tracklist';

function Playlist({ playlist, onRemoveTrack }) {
    return(
        <Tracklist playlist={playlist} onRemoveTrack={onRemoveTrack} />
    )

};

export default Playlist;
