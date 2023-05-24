import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ visible, setVisible }) => {
    return (
        <Modal show={visible} onHide={() => { setVisible(false) }}>
            <Modal.Header closeButton>
                <Modal.Title>Error Fetching Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>There was an error while fetching the data.</p>
                <p>Please Try again later.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { setVisible(false) }}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
