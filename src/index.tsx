import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "react-datepicker/dist/react-datepicker.css";
// redirect user to projects if the user is not in a project
/*
TODO: import user here -> if logged in -> this might be totally unnecessary?
if (!projectId || projectId === "") {
  window.location.href = `${window.location.origin}/projects`;
}
*/

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
