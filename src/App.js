import React, { useState, useEffect } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Alert from './components/Alert';

//sample data for test phase
/*const testData = [
  { id: 1, name: 'song1', artist: 'artist1', album: 'album1', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ" },
  { id: 2, name: 'song2', artist: 'artist2', album: 'album2', uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXF" }
];*/

//defines auth url for Spotify API and redirect url for return to app
// authorisation URL - https://accounts.spotify.com/authorize?client_id=84032ca547e9462cbe363e23212a67b5&response_type=token&redirect_uri=http://localhost:3000/callback&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public
// example callback URL - http://localhost:3000/callback#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600
const client_id = '84032ca547e9462cbe363e23212a67b5';
const redirect_uri = 'http://localhost:3000/callback';
const scope = 'playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public';

let url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + client_id;
url += '&scope=' + scope;
url += '&redirect_uri=' + redirect_uri;
console.log(url);

//App component

function App() {

  //defining state 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  //declare expirationTimeStamp
  let expirationTimeStamp = localStorage.getItem('expirationTimeStamp');
  let parsedExpirationTimeStamp = parseInt(expirationTimeStamp);
  let currentTime = Math.floor(Date.now() / 1000);

  //parsing and validating access tokens upon mount 
    useEffect(() => {

    if(window.location.hash) {
      let keyValuePairs = window.location.hash.substring(1).split('&');
      console.log(keyValuePairs);
    } else {
      window.location.href = url;
    }

    let keyValuePairs = window.location.hash.substring(1).split('&');
    console.log(keyValuePairs);

    let accessTokenPair = keyValuePairs.find(pair => pair.startsWith('access_token'));
    let tokenExpirationPair = keyValuePairs.find(pair => pair.startsWith('expires_in'));
    let tokenExpiration = parseInt(tokenExpirationPair.split('=')[1]);

    if (accessTokenPair) {
      let extractedAccessToken = accessTokenPair.split('=')[1];
      setAccessToken(extractedAccessToken); 
    } else {
      showAlert('Whoops.', 'No access token found. Redirecting you to Spotify login.');
      window.location.href = url; 
    };

    if (!tokenExpirationPair) {
      console.log(tokenExpirationPair);
      showAlert('Whoops.', 'No token expiration information found. Redirecting to login.');
      window.location.href = url;
    }

    if (!expirationTimeStamp) {
      expirationTimeStamp = currentTime + tokenExpiration;
      localStorage.setItem('expirationTimeStamp', expirationTimeStamp);
    };

    if (currentTime > parsedExpirationTimeStamp) {
      showAlert('Whoops.', 'Your Spotify access token has expired. Logging in again.');
      setAccessToken('');
      localStorage.removeItem('expirationTimeStamp');
      window.location.href = url;
    }
  }, []);

  //define separate token expiration function for other asyncs - can't store expiration time in state
  function isTokenExpired() {
    if(currentTime > parsedExpirationTimeStamp) {
      return true;
    }
  };

  //requests Spotify database for given searchQuery
  async function fetchSearchResults() {
    if (!isTokenExpired()) {
      try {
        console.log('Search Query:', searchQuery); // Log search query
        console.log('Access Token:', accessToken); // Log access token
  
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${searchQuery}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Response Status:', response.status); // Log response status
  
        // Check if the response is ok before calling json()
        if (response.ok) {
          const data = await response.json(); // Read the response body here
          console.log('Response Data:', data); // Log the response data
          const parsedData = await extractJSONTrackData(data); // Pass the parsed data to the function
          const limitResults = parsedData.slice(0, 10);
          setSearchResults(limitResults); // Set the parsed data to searchResults
        } else {
          console.error('Error fetching search results:', response.statusText);
          showAlert('Whoops.', 'Failed to fetch search results. Please try again later.');
        }
      } catch (error) {
        console.error('Network or fetch error:', error);
        showAlert('Whoops.', 'An error occurred while fetching search results. Please try again later.');
      }
    } else {
      showAlert('Whoops.', 'Your access token is expired. Please login again.');
    }
  }

  // fetchSearchResults();

  function handleSearchBarSubmit(e) {
    e.preventDefault();
    fetchSearchResults();
    console.log('fetched');
  };

  async function extractJSONTrackData(data) {
    const items = data.tracks.items;
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
        return userProfile.id;
      } else {
        console.error('Error fetching user profile: ' + response.statusText);
        showAlert('Whoops.', 'An error occurred whilst fetching your profile. Please try again later.');
      }
    } catch (error) {
      console.error('Network or fetch error', error);
      showAlert('Whoops.', 'An error occurred whilst fetching your profile. Please try again later.');
    }
  };

  async function createPlaylistInUserAccount(userID) {
    try {
      console.log('User ID: ' + userID, 'Access Token: ' + accessToken, 'Playlist Name: ' + playlistName);
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`, 
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

      console.log('Response Status: ', response.status);

      if(response.ok) {
        const newPlaylist = await response.json();
        return newPlaylist;
      } else {
        const errorResponse = await response.json();
        console.error('error creating: ', errorResponse);
        console.error('Error creating new playlist: ' + response.statusText);
        showAlert('Whoops.', 'There was an error creating your playlist. Please try again later.');
      }

    } catch (error) {
      console.error("Network or fetch error occurred", error);
      showAlert('Whoops.', 'An error occurred whilst creating your playlist. Please try again later.');
    }
  };

  async function populatePlaylist(playlistID) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
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
        showAlert('Whoops.', 'There was an error whilst adding tracks to your playlist. Please try again later.');
      }

    } catch (error) {
      console.error('Network or fetch error', error);
      showAlert('Whoops.', 'There was an error adding your tracks to the playlist. Please try again later.');
    }
  }

  async function savePlaylist() {
    try {
      // Wait for the userID to be fetched
      const userID = await fetchUserProfile();
      console.log('User ID fetched:', userID);
  
      const exportedPlaylist = await exportPlaylist();
      console.log('Exported Playlist:', exportedPlaylist);
  
      // Pass the userID directly into the playlist creation
      const newPlaylist = await createPlaylistInUserAccount(userID);
      console.log('Created Playlist ID:', newPlaylist.id);
  
      await populatePlaylist(newPlaylist.id); // Populate only after playlist creation
      showAlert('WOO!', 'Playlist saved to Spotify.');
    } catch (error) {
      console.error("Error saving playlist:", error);
      showAlert('Whoops.', 'There was an error saving your playlist to Spotify. Please try again later.');
    }
  };

  async function exportPlaylist() {
    const playlist = extractPlaylistNameAndURI();
    return playlist;
  }

  function searchBarUpdate(e) {
    setSearchQuery(e.target.value);
  };

  function addTrackToPlaylist(track) {
    const isTrackInPlaylist = playlist.some(existingTrack => existingTrack.id === track.id);

    if(!isTrackInPlaylist) {
      setPlaylist(prevPlaylist => [...prevPlaylist, track]);
    } else {
      showAlert('Hold up there, Turbo.', 'This track is already in your playlist!');
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

  function showAlert (title, message) {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
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
          onSavePlaylist={savePlaylist}
          />
          {
            alertOpen && (
              <Alert
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
              />
            )
          }
    </div>

  )
}

export default App;
