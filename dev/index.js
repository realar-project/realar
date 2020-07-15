import React from "react";
import { render } from "react-dom";
import { Root } from "./root";
// import { App as Root } from "./perf";
import { init } from "../lib";

init(() => render(<Root />, document.getElementById("root")));

