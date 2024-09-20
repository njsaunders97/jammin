import React, { useState, useEffect } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

// authorisation URL - https://accounts.spotify.com/authorize?client_id=84032ca547e9462cbe363e23212a67b5&response_type=token&redirect_uri=http://localhost:3000/callback&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public
// example callback URL - http://localhost:3000/callback#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600

const testData = [
  { id: 1, name: 'song1', artist: 'artist1', album: 'album1', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ" },
  { id: 2, name: 'song2', artist: 'artist2', album: 'album2', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXF" }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(testData);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [expirationTime, setExpirationTime] = useState();
  // create 3 state hooks to set state in the above components
  function searchBarUpdate(e) {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let keyValuePairs = window.location.hash.substring(1).split('&');
    let accessTokenPair = keyValuePairs.find(pair => pair.startsWith('access_token'));
    if (accessTokenPair) {
      let extractedAccessToken = accessTokenPair.split('=')[1];
      setAccessToken(extractedAccessToken);

      let tokenExpirationPair = keyValuePairs.find(pair => pair.startsWith('expires_in'));
      if (tokenExpirationPair) {
        let tokenExpiration = parseInt(tokenExpirationPair.split('=')[1]);
        let currentTime = (Math.floor(Date.now() / 1000));
        let expirationTimestamp = tokenExpiration + currentTime;
        setExpirationTime(expirationTimestamp);
        if (currentTime > expirationTimestamp) {
          alert('Access token expired. You need to login again.');
        };
      }
    } else {
      alert('No access token found.');
    }
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }, []);

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
