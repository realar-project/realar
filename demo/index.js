import React from "react";
import { render } from "react-dom";
import { ready } from "realar";
import { Root } from "./root";

ready(render, <Root />, document.getElementById("root"));
