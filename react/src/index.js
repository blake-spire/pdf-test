import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Delaware from "./components/delaware";
import * as serviceWorker from "./serviceWorker";

import questions from "./data/delaware";

ReactDOM.render(
  <Delaware
    questions={questions}
    // mock inspection data for now
    inspection={{ id: 77, inspector: "Justin OConnell", routine_interval: 14 }}
  />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
