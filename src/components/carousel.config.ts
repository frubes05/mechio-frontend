export const carouselConfig = (teaserLength: number) => {
  return {
    pagination: false,
    gap: 32,
    rewind: false,
    padding: {
        left: 10,
        right: 10
    },
    breakpoints: {
      672: {
        type: "loop",
        perPage: 1,
        arrows: false,
        padding: {
          left: 10,
          right: 120,
        },
        drag: true,
      },
      1056: {
        type: "slide",
        perPage: 2,
        arrows: teaserLength > 2 ? true : false,
        drag: teaserLength > 2 ? true : false,
      },
      1312: {
        type: "slide",
        perPage: 3,
        arrows: teaserLength > 3 ? true : false,
        drag: teaserLength > 3 ? true : false,
      },
      10000: {
        type: "slide",
        perPage: 4,
        arrows: teaserLength > 4 ? true : false,
        drag: teaserLength > 4 ? true : false,
      },
    },
  };
};
