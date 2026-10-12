
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import movies, { getMovieById as findMovieById } from "../data/movies.js";
import {
  getTheatreById as findTheatreById,
  getTheatresForMovie
} from "../data/theatres.js";
import { generateBookingId } from "../utils/helpers.js";

const BookingContext = createContext(null);

const initialState = {
  movie: null,
  theatre: null,
  showtime: null,
  seats: [],
  customer: null,
  paymentMethod: "",
  booking: null
};

const getSeatKey = (seat) =>
  String(seat?.id ?? seat?.seatId ?? seat?.label ?? "");

const getSeatPrice = (seat, movie) =>
  Number(seat?.price ?? movie?.price ?? 0);

const calculateTotal = (selectedSeats, movie) =>
  selectedSeats.reduce(
    (total, seat) => total + getSeatPrice(seat, movie),
    0
  ) + (selectedSeats.length > 0 ? 30 : 0);

export function BookingProvider({ children }) {
  const [state, setState] = useState(initialState);

  const selectMovie = useCallback((movieOrId) => {
    const selectedMovie =
      typeof movieOrId === "string"
        ? findMovieById(movieOrId)
        : movieOrId;

    if (!selectedMovie) {
      return;
    }

    setState((current) => {
      if (current.movie?.id === selectedMovie.id) {
        return {
          ...current,
          movie: selectedMovie
        };
      }

      return {
        ...initialState,
        movie: selectedMovie
      };
    });
  }, []);

  const selectTheatre = useCallback((theatreOrId) => {
    setState((current) => {
      if (!current.movie) {
        return current;
      }

      const availableTheatres = getTheatresForMovie(current.movie.id);

      const selectedTheatre =
        typeof theatreOrId === "string"
          ? availableTheatres.find((item) => item.id === theatreOrId)
          : availableTheatres.find(
              (item) => item.id === theatreOrId?.id
            ) || theatreOrId;

      if (!selectedTheatre) {
        return current;
      }

      if (current.theatre?.id === selectedTheatre.id) {
        return {
          ...current,
          theatre: selectedTheatre
        };
      }

      return {
        ...current,
        theatre: selectedTheatre,
        showtime: null,
        seats: [],
        customer: null,
        paymentMethod: "",
        booking: null
      };
    });
  }, []);

  const selectShowtime = useCallback((showtimeOrId) => {
    setState((current) => {
      if (!current.movie || !current.theatre) {
        return current;
      }

      const theatre = getTheatresForMovie(current.movie.id).find(
        (item) => item.id === current.theatre.id
      );

      const selectedShowtime =
        typeof showtimeOrId === "string"
          ? theatre?.showtimes.find(
              (item) => item.id === showtimeOrId
            )
          : showtimeOrId;

      if (!selectedShowtime) {
        return current;
      }

      if (current.showtime?.id === selectedShowtime.id) {
        return {
          ...current,
          showtime: selectedShowtime
        };
      }

      return {
        ...current,
        showtime: selectedShowtime,
        seats: [],
        customer: null,
        paymentMethod: "",
        booking: null
      };
    });
  }, []);

  const selectSeats = useCallback((selectedSeats) => {
    setState((current) => ({
      ...current,
      seats: Array.isArray(selectedSeats) ? selectedSeats : [],
      booking: null
    }));
  }, []);

  const toggleSeat = useCallback((seat) => {
    const seatKey = getSeatKey(seat);

    if (!seatKey) {
      return;
    }

    setState((current) => {
      const alreadySelected = current.seats.some(
        (item) => getSeatKey(item) === seatKey
      );

      if (alreadySelected) {
        return {
          ...current,
          seats: current.seats.filter(
            (item) => getSeatKey(item) !== seatKey
          ),
          booking: null
        };
      }

      if (current.seats.length >= 10) {
        return current;
      }

      return {
        ...current,
        seats: [
          ...current.seats,
          {
            ...seat,
            price: getSeatPrice(seat, current.movie)
          }
        ],
        booking: null
      };
    });
  }, []);

  const updateCustomer = useCallback((customer) => {
    setState((current) => ({
      ...current,
      customer: {
        ...(current.customer || {}),
        ...customer
      },
      booking: null
    }));
  }, []);

  const selectPaymentMethod = useCallback((method) => {
    setState((current) => ({
      ...current,
      paymentMethod: method,
      booking: null
    }));
  }, []);

  const confirmBooking = useCallback(() => {
    if (!state.movie) {
      return {
        success: false,
        message: "Please select a movie."
      };
    }

    if (!state.theatre) {
      return {
        success: false,
        message: "Please select a cinema."
      };
    }

    if (!state.showtime) {
      return {
        success: false,
        message: "Please select a showtime."
      };
    }

    if (!state.seats.length) {
      return {
        success: false,
        message: "Please select at least one seat."
      };
    }

    if (!state.customer?.name?.trim()) {
      return {
        success: false,
        message: "Please enter your full name."
      };
    }

    if (!state.customer?.email?.trim()) {
      return {
        success: false,
        message: "Please enter your email address."
      };
    }

    if (!state.paymentMethod) {
      return {
        success: false,
        message: "Please select a payment method."
      };
    }

    const createdAt = new Date().toISOString();
    const total = calculateTotal(state.seats, state.movie);

    const confirmedBooking = {
      id: generateBookingId(),
      movie: state.movie,
      theatre: state.theatre,
      showtime: state.showtime,
      seats: [...state.seats],
      customer: { ...state.customer },
      paymentMethod: state.paymentMethod,
      subtotal: total - (state.seats.length > 0 ? 30 : 0),
      convenienceFee: state.seats.length > 0 ? 30 : 0,
      total,
      createdAt,
      status: "confirmed"
    };

    setState((current) => ({
      ...current,
      booking: confirmedBooking
    }));

    return {
      success: true,
      booking: confirmedBooking
    };
  }, [state]);

  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  const availableMovies = movies;

  const availableTheatres = useMemo(
    () =>
      state.movie
        ? getTheatresForMovie(state.movie.id)
        : [],
    [state.movie]
  );

  const availableShowtimes = useMemo(
    () => state.theatre?.showtimes ?? [],
    [state.theatre]
  );

  const totals = useMemo(() => {
    const subtotal = state.seats.reduce(
      (sum, seat) => sum + getSeatPrice(seat, state.movie),
      0
    );

    const convenienceFee = state.seats.length > 0 ? 30 : 0;

    return {
      subtotal,
      convenienceFee,
      total: subtotal + convenienceFee,
      seatCount: state.seats.length
    };
  }, [state.seats, state.movie]);

  const getMovieById = useCallback(
    (movieId) => findMovieById(movieId),
    []
  );

  const getTheatreById = useCallback(
    (theatreId) => findTheatreById(theatreId),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      availableMovies,
      availableTheatres,
      availableShowtimes,
      totals,
      selectMovie,
      selectTheatre,
      selectShowtime,
      selectSeats,
      toggleSeat,
      updateCustomer,
      selectPaymentMethod,
      confirmBooking,
      resetBooking,
      getMovieById,
      getTheatreById
    }),
    [
      state,
      availableMovies,
      availableTheatres,
      availableShowtimes,
      totals,
      selectMovie,
      selectTheatre,
      selectShowtime,
      selectSeats,
      toggleSeat,
      updateCustomer,
      selectPaymentMethod,
      confirmBooking,
      resetBooking,
      getMovieById,
      getTheatreById
    ]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider.");
  }

  return context;
}

export default BookingContext;
