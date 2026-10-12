
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";

function AppLayout() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [location.pathname]);

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-cinema-background text-cinema-heading">
      {showSplash && (
        <SplashScreen
          duration={2600}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {!hideLayout && <Navbar />}

      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/seats/:movieId" element={<SeatSelection />} />

          <Route
            element={<ProtectedRoute />}
          >
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppLayout />
      </BookingProvider>
    </AuthProvider>
  );
}
