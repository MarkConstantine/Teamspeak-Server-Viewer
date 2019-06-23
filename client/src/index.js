import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import Server from "./components/server";

import config from "./config";

ReactDOM.render(<Server config={config} />, document.getElementById("root"));
