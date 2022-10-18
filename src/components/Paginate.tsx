import React, { useState, useEffect } from 'react';
import { IPaginate } from './Paginate.types';
import { Pagination } from 'react-bootstrap'

const Paginate = ({getPageNumbers, paginate}: IPaginate) => {

  return (
        <Pagination>
            {getPageNumbers.map((number) => 
            <Pagination.Item onClick={() => paginate(number)} key={number}>{number}</Pagination.Item>)}
        </Pagination>
  )
}

export default Paginate