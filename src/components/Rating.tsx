import React, { useState } from "react";
import StarRatings from "react-star-ratings";

interface IRating {
    rating: number;
    setRating: (rating: number) => void;
}

const Rating: React.FC<IRating> = ({ rating, setRating }) => {
  const changeRating = (newRating: any) => {
    setRating(newRating);
  };

  return (
    <StarRatings
      rating={rating}
      starRatedColor="blue"
      changeRating={changeRating}
      numberOfStars={5}
      name="rating"
    />
  );
};

export default Rating;
