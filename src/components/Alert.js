import React from 'react';
import './Alert.module.css';
import { Button, Col, Row, Container } from 'react-bootstrap';

function Alert ({ title, message, onClose }) {
  return (
    <Container className="alert mt-3 mb-0">
        <div className="alert-content">
            <h3>{title}</h3>
            <p>{message}</p>
            <Button onClick={onClose}>OK</Button>
        </div>
    </Container>
  )
}

export default Alert;

