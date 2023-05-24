import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ visible }) => {
    return (
        <Modal show={visible} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Error Fetching Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>There was an error while fetching the data.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { }}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
