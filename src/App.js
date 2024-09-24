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

const client_id = '84032ca547e9462cbe363e23212a67b5';
const redirect_uri = 'http://localhost:3000/callback';
const scope = 'playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public';

let url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + client_id;
url += '&scope=' + scope;
url += '&redirect_uri=' + redirect_uri;
console.log(url);

function App() {

  //defining state 

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(testData);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [playlistID, setPlaylistID] = useState(''); 

  //parsing and validating access tokens on-mount
    useEffect(() => {
    let keyValuePairs = window.location.hash.substring(1).split('&');
    let accessTokenPair = keyValuePairs.find(pair => pair.startsWith('access_token'));
    let tokenExpirationPair = keyValuePairs.find(pair => pair.startsWith('expires_in'));
    let tokenExpiration = parseInt(tokenExpirationPair.split('=')[1]);
    const currentTime = Math.floor(Date.now() / 1000);
    let expirationTimeStamp = localStorage.getItem('expirationTimeStamp');
    let parsedExpirationTimeStamp = parseInt(expirationTimeStamp);
  
    if (accessTokenPair) {
      let extractedAccessToken = accessTokenPair.split('=')[1];
      setAccessToken(extractedAccessToken); 
    } else {
      alert('No access token found. Redirecting to login.');
      window.location.href = url; 
    };

    if(!expirationTimeStamp) {
      expirationTimeStamp = currentTime + tokenExpiration;
      localStorage.setItem('expirationTimeStamp', expirationTimeStamp);
    };

    console.log(currentTime, parsedExpirationTimeStamp);

    if (currentTime > parsedExpirationTimeStamp) {
      alert('Your Spotify access token has expired. Redirecting to login again.');
      setAccessToken('');
      localStorage.removeItem('expirationTimeStamp');
      window.location.href = url;
    }

  }, []);

  /*
  function isTokenExpired() {
    const currentTime = Math.floor(Date.now() / 1000);
    if(currentTime > newExpirationTime) {
      return true;
    }
  };
  */

  useEffect(() => {
    setSearchResults(testData.filter(data => data.name.includes(searchQuery) || data.artist.includes(searchQuery) || data.album.includes(searchQuery)))
  }, [searchQuery]);

  function handleSearchBarSubmit(e) {
    e.preventDefault();
    fetchSearchResults();
  };

  async function fetchSearchResults() {
    /*if (!isTokenExpired()) { */
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/search?type=track&q=' + searchQuery, 
          {
            headers: {
              'Authorization': 'Bearer ' + accessToken, // Include access token in the header
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          return data;
        } else {
          console.error('Error fetching search results:', response.statusText);
          alert('Failed to fetch search results. Please try again.');
        }
      } catch (error) {
        console.error('Network or fetch error:', error);
        alert('An error occurred while fetching search results. Please try again later.');
      }
    /*} else {
      alert('Your access token is expired. Please login again or refresh the token.');
    }*/
  };

  async function extractJSONTrackData(response) {
    const parsedJSON = await response.json();
    const items = parsedJSON.tracks.items;
    return items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  };

  async function fetchUserProfile() {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me', 
          {
          headers: 
          {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const userProfile = await response.json();
        setUsername(userProfile.display_name);
        setUserID(userProfile.id);
        return userProfile;
      } else {
        console.error('Error fetching user profile: ' + response.statusText);
        alert('An error occurred whilst fetching your profile. Please try again later.');
      }
    } catch (error) {
      console.error('Network or fetch error', error);
      alert('An error occurred whilst fetching your profile. Please try again later.');
    }
  };

  async function createPlaylistInUserAccount() {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/users/' + userID + '/playlists', 
        {
          method: "POST",
          headers:
          {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify( 
          {
            name: playlistName 
          })
        }
      );

      if(response.ok) {
        const newPlaylist = await response.json();
        setPlaylistID(newPlaylist.id);
        return newPlaylist;
      } else {
        console.error('Error creating new playlist: ' + response.statusText);
        alert('There was an error creating your playlist. Please try again later.');
      }
    } catch (error) {
      console.error("Network or fetch error occurred", error);
      alert('An error occurred whilst creating your playlist. Please try again later.');
    }
  };

  async function populatePlaylist() {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks',
       {
        method: "POST",
        headers:
        {
          'Authorization': "Bearer " + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            uris: playlist.map(track => track.uri)
          }
        )
       } 
      );

      if (!response.ok) {
        console.error('Error adding tracks to playlist: ' + response.statusText);
        alert('There was an error adding your tracks to the playlist. Please try again later.');
      }

    } catch (error) {
      console.error('Network or fetch error', error);
      alert('There was an error whilst adding tracks to your playlist. Please try again later.');
    }
  }

  async function savePlaylist() {
    try {
      await fetchUserProfile();
      await createPlaylistInUserAccount();
      await populatePlaylist();
    } catch (error) {
      console.error("Error saving playlist: ", error);
      alert('There was an error saving your playlist to spotify. Please try again later.');
    }
  }

  function searchBarUpdate(e) {
    setSearchQuery(e.target.value);
  };

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

  async function exportPlaylist() {
    const playlist = extractPlaylistNameAndURI();
    await savePlaylist();
    console.log("Exporting playlist:", playlist);
    resetPlaylist();
  }
  

  return (
    <div>
          <SearchBar 
          onSearchBarUpdate={searchBarUpdate}
          onSearchBarSubmit={handleSearchBarSubmit} 
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
