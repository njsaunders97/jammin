import React from 'react';
import './Track.module.css';
import { Container, Button, Row, Col } from 'react-bootstrap'; 

function Track({ track, onAddTrack, onRemoveTrack }) {
  return (
    <Container>
      <Container className="mt-2 mb-2">
        <Row>
          <Col className="text-start" md={8}>
          <h3>{track.name}</h3>
          <p>{track.album}, {track.artist}</p>
          </Col>
          <Col md={4}>
          {onAddTrack && <Button onClick={() => onAddTrack(track)}>+</Button>}
          {onRemoveTrack && <Button onClick={() => onRemoveTrack(track.id)}>-</Button>}
          </Col>
        </Row>             
      </Container>
    </Container>
  );
}

export default Track;