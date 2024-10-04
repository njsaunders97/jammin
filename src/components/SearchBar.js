import React from 'react';
import './SearchBar.module.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; 

function SearchBar({ onSearchBarUpdate, onSearchBarSubmit }) {
    return ( 
        <Container>
            <Row>
                <Col md={6} className="mx-auto">
                    <Form inline autocomplete="off" onSubmit={onSearchBarSubmit}>
                        <div className="d-flex align-items-center">
                            <Form.Control 
                            name="searchQuery"
                            placeholder="Search Spotify..."
                            className="mr-sm-2"
                            type="text"
                            id="searchQuery"
                            onChange={onSearchBarUpdate}
                            />
                            <Button type="button" className="btn btn-primary" onClick={onSearchBarSubmit}>Search</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>  
    )
};

export default SearchBar;