import React from 'react';
import './Playlist.module.css';
import Tracklist from './Tracklist';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

function Playlist({ playlist, onRemoveTrack, playlistName, onNameChange, onSavePlaylist}) {
    const handleSaveClick = (e) => {
        e.preventDefault();
        onSavePlaylist();
    }
    return(
        <Container className="align-items-center">
            <Row className="mb-4">
                <Col>
                    <h2>Playlist</h2>
                    <Form inline autocomplete="off">
                        <div className="d-flex align-items-center justify-content-center">
                            <Form.Control  
                                placeholder="Name your playlist..."
                                className="mr-sm-2 w-50"
                                name="playlistName"
                                type="text"
                                value={playlistName}
                                id="playlistName"
                                onChange={onNameChange}
                            />     
                        </div>
                    </Form>
                </Col>
            </Row>
            <Container>
                <Tracklist tracks={playlist} onRemoveTrack={onRemoveTrack} />
            </Container>
            <Container>
                <Button className="mt-0" onClick={handleSaveClick}>Save to Spotify</Button>
            </Container>
        </Container>
    )
};

export default Playlist;
