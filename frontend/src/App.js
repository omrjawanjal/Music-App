import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MyToken } from "./pages/ContextAPI/context";
const App = () => {
  const CLIENT_ID = "fe6399a8a028484891f0a865c74eeed2";
  const CLIENT_SECRET_ID = "62d8c26a3cc645ef8b7c8e39b43c5e27";
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET_ID,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);
  console.log(accessToken);
  return (
    <div>
      <MyToken.Provider value={accessToken}>
        <Routes>
          {routes &&
            routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                ></Route>
              );
            })}
        </Routes>
      </MyToken.Provider>
    </div>
  );
};

export default App;
