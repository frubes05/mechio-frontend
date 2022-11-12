export const carouselConfig = (teaserLength: number, nonClassic = false) => {
  return {
    pagination: false,
    gap: 32,
    rewind: false,
    padding: {
        left: 10,
        right: 10
    },
    breakpoints: {
      500: {
        type: "loop",
        padding: {
          left: 10,
          right: 60
        }
      },
      672: {
        type: "loop",
        perPage: 1,
        arrows: false,
        padding: {
          left: 10,
          right: nonClassic ? 80 : 120,
        },
        drag: true,
      },
      1056: {
        type: nonClassic ? "loop" : "slide",
        perPage: 2,
        arrows: nonClassic ? false : (teaserLength > 2 ? true : false),
        drag: nonClassic ? true : (teaserLength > 2 ? true : false),
      },
      1312: {
        type: "slide",
        perPage: nonClassic ? 3 : 4,
        arrows: nonClassic ? false : (teaserLength > 3 ? true : false),
        drag: nonClassic ? true : (teaserLength > 3 ? true : false),
      },
      10000: {
        type: "slide",
        perPage: 4,
        arrows: nonClassic ? false : (teaserLength > 3 ? true : false),
        drag: nonClassic ? false : (teaserLength > 3 ? true : false),
      },
    },
  };
};
