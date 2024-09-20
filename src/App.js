import React, { useState, useEffect } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

const testData = [
  { id: 1, name: 'song1', artist: 'artist1', album: 'album1', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ" },
  { id: 2, name: 'song2', artist: 'artist2', album: 'album2', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXF" }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(testData);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  // create 3 state hooks to set state in the above components
  function searchBarUpdate(e) {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let url = window.location.href();
    let includesToken = url.includes()

  })

  useEffect(() => {
    setSearchResults(testData.filter(data => data.name.includes(searchQuery) || data.artist.includes(searchQuery) || data.album.includes(searchQuery)))
  }, [searchQuery]);

  function addTrackToPlaylist(track) {
    const isTrackInPlaylist = playlist.some(existingTrack => existingTrack.id === track.id);

    if(!isTrackInPlaylist) {
      setPlaylist(prevPlaylist => [...prevPlaylist, track]);
    } else {
      alert('This track is already in your playlist!');
    }
  }

  function removeTrackFromPlaylist(trackId) {
    setPlaylist(prevPlaylist => prevPlaylist.filter(track => track.id !== trackId))
  };

  function updatePlaylistName(e) {
    setPlaylistName(e.target.value)
  };
  // updates searchQuery state with value from the target input field when an event is triggered

  function extractPlaylistNameAndURI() {
    return {
      name: playlistName,
      uris: playlist.map((track) => track.uri),
    }
  };

  function resetPlaylist() {
    setPlaylist([]);
  }

  function exportPlaylist() {
    const playlist = extractPlaylistNameAndURI();
    console.log("Exporting playlist:", playlist);
    resetPlaylist();
  }
  

  return (
    <div>
          <SearchBar 
          onSearchBarUpdate={searchBarUpdate} 
          />
          {/* passes SearchBarUpdate function as a prop 'onSearchBarUpdate' to the SearchBar component */}
          <SearchResults 
          searchResults={searchResults} 
          onAddTrack={addTrackToPlaylist}  
          />
          <Playlist 
          playlist={playlist} 
          onRemoveTrack={removeTrackFromPlaylist} 
          playlistName={playlistName} 
          onNameChange={updatePlaylistName}
          exportPlaylist={exportPlaylist} 
          />
    </div>

  )
}

export default App;
