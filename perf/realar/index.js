import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import { wait_core_instantiate } from "realar";

wait_core_instantiate(() => {
  render(<App />, document.getElementById("root"));
});
