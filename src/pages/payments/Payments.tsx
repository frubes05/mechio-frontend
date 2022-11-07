import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import {Container, Row, Col, Button} from 'react-bootstrap';
import { IUserToken } from "../users/User.types";
import { ICompanyToken } from "../companies/Company.types";
import { AuthContext } from "../../context/AuthContext";
import Payment from './Payment';

const Payments = () => {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  return (
    <section className='payments'>
        <Container>
            <Row className='payments__row'>
                <Col className='payments__col' md={4} lg={4}>
                  <Payment option='standard' isSelected={(state.companyPremium || token?.companyPremium) ? false : true}></Payment>
                </Col>
                <Col className='payments__col' md={4} lg={4}>
                  <Payment option='premium' isSelected={(state.companyPremium || token?.companyPremium) ? true : false}></Payment>
                </Col>
            </Row>
            <Row className="payments__proceed">
              <Col>
                <Link to={'/poslovi'}>Nastavi dalje</Link>
              </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Payments