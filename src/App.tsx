import { ThemeProvider } from "./components/ui/ThemeContent";
import Landing from "./pages/Landing";

function App() {
  return (
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  );
}

export default App;