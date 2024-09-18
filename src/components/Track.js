import React from 'react';
import './Track.module.css';

function Track({ track, onAddTrack, onRemoveTrack }) {
  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.album}, {track.artist}</p>
      {onAddTrack && <button onClick={() => onAddTrack(track)}>+</button>}
      {onRemoveTrack && <button onClick={() => onRemoveTrack(track.id)}>-</button>}
    </div>
  );
}

export default Track;