import { useEffect } from "react";
import { useState } from "react";
import css from "../styles/darkModeButton.module.scss";
import { ThemeContext } from "../ThemeContext";

const DarkMode = () => {
  const body = document.body;
  const [theme, setTheme] = useState("light");
  const [checkedS, setCheckedS] = useState(false);

  useEffect(() => {
    if (localStorage) {
      let value = localStorage.getItem("theme");
      if (value === "light" || value === "dark") {
        body.classList.add(value);
        setTheme(value);
      } else {
        body.classList.add("light");
      }
      if (value === "dark") setCheckedS(true);
    }
  }, []);

  const toggleDarkMode = (callback: (newTheme: string) => void) => {
    if (theme === "dark") {
      body.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      setTheme("light");
      callback("light");
      setCheckedS(false);
    } else {
      body.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
      callback("dark");
      setCheckedS(true);
    }
  };

  return (
    <div id={css.switch}>
      <label className={css.toggle}>
        <ThemeContext.Consumer>
          {({ theme, setTheme }) => (
            <input
              type="checkbox"
              onChange={() => {
                toggleDarkMode(setTheme);
              }}
              checked={checkedS}
            />
          )}
        </ThemeContext.Consumer>
        <span className={css.slider}></span>
        <span className={css.labels}></span>
      </label>
    </div>
  );
};

export default DarkMode;
