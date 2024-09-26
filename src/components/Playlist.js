import React from 'react';
import './Playlist.module.css';
import Tracklist from './Tracklist';

function Playlist({ playlist, onRemoveTrack, playlistName, onNameChange, onSavePlaylist}) {
    const handleSaveClick = (e) => {
        e.preventDefault();
        onSavePlaylist();
    }
    return(
        <div>
            <h2>Playlist</h2>
            <form>
                <label htmlFor="playlistName">Name your playlist:</label>
                <input
                name="playlistName"
                type="text"
                value={playlistName}
                id="playlistName"
                onChange={onNameChange}
                />
            </form>
            <Tracklist tracks={playlist} onRemoveTrack={onRemoveTrack} />
            <button onClick={handleSaveClick}>Save this Playlist to Spotify</button>
        </div>

    )

};

export default Playlist;
