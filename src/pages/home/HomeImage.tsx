import React from 'react'

const HomeImage = ({position, children}: {position: string, children?: React.ReactElement}) => {
  return (
      <>
        {position === 'top' && <div className='home__image' style={{backgroundImage: "url(/assets/swiper2.jpg)"}}>{children}</div>}
        {position === 'middle' && <div className='home__image home__image--middle' style={{backgroundImage: "url(/assets/swiper3.webp)"}}></div>}
      </>
  )
}

export default HomeImage