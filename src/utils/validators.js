
import { isValidEmail, isValidPhone } from "./helpers.js";

export const validateEmail = (email) => {
  const value = String(email ?? "").trim();

  if (!value) return "Email address is required.";
  if (!isValidEmail(value)) return "Enter a valid email address.";

  return "";
};

export const validatePassword = (password) => {
  const value = String(password ?? "");

  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must contain at least 8 characters.";

  return "";
};

export const validateSignupPassword = (password) => {
  const value = String(password ?? "");
  const basicError = validatePassword(value);

  if (basicError) return basicError;
  if (!/[a-z]/.test(value)) {
    return "Include at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(value)) {
    return "Include at least one uppercase letter.";
  }
  if (!/[0-9]/.test(value)) {
    return "Include at least one number.";
  }

  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!String(confirmPassword ?? "")) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

export const validateName = (name) => {
  const value = String(name ?? "").trim();

  if (!value) return "Full name is required.";
  if (value.length < 2) return "Name must contain at least 2 characters.";
  if (value.length > 80) return "Name cannot exceed 80 characters.";
  if (!/^[\p{L}\p{M} .'-]+$/u.test(value)) {
    return "Enter a valid name.";
  }

  return "";
};

export const validatePhone = (phone) => {
  const value = String(phone ?? "").trim();

  if (!value) return "Phone number is required.";
  if (!isValidPhone(value)) {
    return "Enter a valid 10-digit phone number.";
  }

  return "";
};

export const validateLoginForm = (values = {}) => {
  const errors = {
    email: validateEmail(values.email),
    password: values.password ? "" : "Password is required."
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => Boolean(error))
  );
};

export const validateSignupForm = (values = {}) => {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    password: validateSignupPassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword
    ),
    acceptTerms: values.acceptTerms
      ? ""
      : "You must accept the terms and conditions."
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => Boolean(error))
  );
};

export const validatePassenger = (passenger = {}) => {
  const errors = {
    name: validateName(passenger.name),
    email: validateEmail(passenger.email),
    phone: validatePhone(passenger.phone)
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => Boolean(error))
  );
};

export const validatePassengers = (passengers = []) => {
  if (!Array.isArray(passengers) || passengers.length === 0) {
    return { passengers: "At least one passenger is required." };
  }

  const errors = {};

  passengers.forEach((passenger, index) => {
    const passengerErrors = validatePassenger(passenger);

    if (Object.keys(passengerErrors).length > 0) {
      errors[index] = passengerErrors;
    }
  });

  return errors;
};

export const validateSeatSelection = (seats, maxSeats = 10) => {
  if (!Array.isArray(seats) || seats.length === 0) {
    return "Please select at least one seat.";
  }

  if (seats.length > maxSeats) {
    return `You can select a maximum of ${maxSeats} seats.`;
  }

  const seatIds = seats.map((seat) =>
    String(seat?.id ?? seat?.seatId ?? seat?.label ?? "")
  );

  if (seatIds.some((id) => !id)) {
    return "One or more selected seats are invalid.";
  }

  if (new Set(seatIds).size !== seatIds.length) {
    return "Duplicate seats cannot be selected.";
  }

  return "";
};

export const validateShowtime = (showtime) => {
  if (!showtime) return "Please select a showtime.";

  if (
    typeof showtime === "object" &&
    !(
      showtime.id ||
      showtime.time ||
      showtime.label
    )
  ) {
    return "Please select a valid showtime.";
  }

  return "";
};

export const validateBooking = (booking = {}) => {
  const errors = {};

  if (!booking.movie) {
    errors.movie = "Please select a movie.";
  }

  if (!booking.theatre) {
    errors.theatre = "Please select a theatre.";
  }

  const showtimeError = validateShowtime(booking.showtime);

  if (showtimeError) {
    errors.showtime = showtimeError;
  }

  const seatsError = validateSeatSelection(booking.seats);

  if (seatsError) {
    errors.seats = seatsError;
  }

  if (!booking.customer) {
    errors.customer = "Customer information is required.";
  } else {
    const customerErrors = {
      name: validateName(booking.customer.name),
      email: validateEmail(booking.customer.email),
      phone: validatePhone(booking.customer.phone)
    };

    const filteredCustomerErrors = Object.fromEntries(
      Object.entries(customerErrors).filter(([, error]) => Boolean(error))
    );

    if (Object.keys(filteredCustomerErrors).length > 0) {
      errors.customer = filteredCustomerErrors;
    }
  }

  if (!booking.paymentMethod) {
    errors.paymentMethod = "Please select a payment method.";
  }

  return errors;
};

export const hasErrors = (errors = {}) => {
  if (typeof errors === "string") return Boolean(errors);
  if (!errors || typeof errors !== "object") return false;

  return Object.values(errors).some((error) => {
    if (typeof error === "string") return Boolean(error);
    if (error && typeof error === "object") return hasErrors(error);
    return Boolean(error);
  });
};

export const getFirstError = (errors = {}) => {
  if (typeof errors === "string") return errors;

  for (const error of Object.values(errors ?? {})) {
    if (typeof error === "string" && error) return error;

    if (error && typeof error === "object") {
      const nestedError = getFirstError(error);

      if (nestedError) return nestedError;
    }
  }

  return "";
};
