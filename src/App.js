import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "./App.css";
import { useStateContext } from "./contexts/ContextProvider";
import styles from "./components/Styles";
const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext();

  React.useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  return (
    <div style={styles.fontFamily} className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
};

export default App;
