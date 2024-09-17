import React from 'react';
import './Track.module.css';

function Track({ track }) {
  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>
    </div>
  );
}

export default Track;