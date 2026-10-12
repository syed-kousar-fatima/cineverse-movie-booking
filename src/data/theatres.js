
import movies from "./movies.js";

const theatreMetadata = [
  {
    id: "cineplex-central",
    name: "Cineplex Central",
    location: "City Centre",
    address: "City Centre, Main City",
    rating: 4.6,
    facilities: [
      "Dolby Sound",
      "Recliner Seats",
      "Food Court",
      "Parking",
      "Accessible Seating"
    ],
    formats: ["2D", "3D", "IMAX"],
    image:
      "https://i.pinimg.com/736x/52/76/75/5276753a17a84c0e391d0f6717b603d9.jpg"
  },
  {
    id: "grand-cinema",
    name: "Grand Cinema",
    location: "Main Road",
    address: "Main Road, Main City",
    rating: 4.4,
    facilities: [
      "Premium Sound",
      "Comfortable Seating",
      "Snacks Counter",
      "Parking",
      "Accessible Seating"
    ],
    formats: ["2D", "3D"],
    image:
      "https://i.pinimg.com/736x/4d/9e/71/4d9e716b9157216aaf33f8851ce48204.jpg"
  }
];

export const theatres = theatreMetadata.map((theatre) => ({
  ...theatre,
  showtimes: movies.flatMap((movie) => {
    const movieTheatre = movie.theatres?.find(
      (item) => item.id === theatre.id
    );

    if (!movieTheatre) {
      return [];
    }

    return movieTheatre.showtimes.map((showtime) => ({
      ...showtime,
      movieId: movie.id,
      movieTitle: movie.title,
      theatreId: theatre.id,
      theatreName: theatre.name,
      poster: movie.poster,
      price: movie.price
    }));
  })
}));

export const getTheatreById = (theatreId) =>
  theatres.find((theatre) => theatre.id === theatreId);

export const getTheatresForMovie = (movieId) => {
  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return [];
  }

  return movie.theatres
    .map((movieTheatre) => {
      const theatre = getTheatreById(movieTheatre.id);

      if (!theatre) {
        return null;
      }

      return {
        ...theatre,
        showtimes: movieTheatre.showtimes.map((showtime) => ({
          ...showtime,
          movieId: movie.id,
          movieTitle: movie.title,
          theatreId: theatre.id,
          theatreName: theatre.name,
          poster: movie.poster,
          price: movie.price
        }))
      };
    })
    .filter(Boolean);
};

export const getShowtimesForMovieAtTheatre = (movieId, theatreId) => {
  const theatre = getTheatresForMovie(movieId).find(
    (item) => item.id === theatreId
  );

  return theatre?.showtimes ?? [];
};

export default theatres;
