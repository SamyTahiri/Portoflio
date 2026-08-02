import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/ThemeContent";
import Landing from "./pages/Landing";
import Room from "./pages/Room";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;