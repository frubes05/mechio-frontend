import React, { useState } from "react";
import StarRatings from "react-star-ratings";

interface IRating {
    rating: number;
    setRating?: (rating: number) => void;
}

const Rating: React.FC<IRating> = ({ rating, setRating }) => {
  const changeRating = (newRating: any) => {
    if (setRating) {
      setRating(newRating);
    }
  };

  return (
    <StarRatings
      rating={rating}
      starRatedColor="black"
      starHoverColor="black"
      changeRating={changeRating}
      numberOfStars={5}
      name="rating"
    />
  );
};

export default Rating;
