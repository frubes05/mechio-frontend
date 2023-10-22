import { IPaginate } from './Paginate.types';
import { Pagination } from 'react-bootstrap'

const Paginate = ({getPageNumbers, paginate}: IPaginate) => {

  return (
        <Pagination>
            {getPageNumbers.map((number, i) => 
            <Pagination.Item onClick={() => paginate(number)} key={`${number}-${i}`}>{number}</Pagination.Item>)}
        </Pagination>
  )
}

export default Paginate