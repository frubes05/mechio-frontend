import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface IModal {
  title: string;
  show: boolean;
  setShow: (elem: boolean) => void;
  handleClose: () => void;
  handleSubmit?: (e: React.FormEvent) => void;
  children: React.ReactChildren | React.ReactChild;
  checkState?: boolean;
  classname?: string;
}

const ModalForm: React.FC<IModal> = ({ show, setShow, handleClose, handleSubmit, children, checkState, title, classname }) => {
  return (
    <div className={classname}>
      <Modal size="lg" show={show} onHide={handleClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title className={classname ? `modal-title--${classname}` : ''}>{title}</Modal.Title>
        </Modal.Header>
        <Container>
            <Row>
                <Col>
                    {children}
                </Col>
            </Row>
        </Container>
      </Modal>
    </div>
  );
};

export default ModalForm;
