import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import { ready } from "realar";

ready(() => {
  render(<App />, document.getElementById("root"));
});
