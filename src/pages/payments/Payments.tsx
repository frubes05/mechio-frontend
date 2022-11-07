import React from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Payment from './Payment';

const Payments = () => {
  return (
    <section className='payments'>
        <Container>
            <Row className='payments__row'>
                <Col className='payments__col' md={4} lg={4}>
                  <Payment option='standard'></Payment>
                </Col>
                <Col className='payments__col' md={4} lg={4}>
                  <Payment option='premium'></Payment>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Payments