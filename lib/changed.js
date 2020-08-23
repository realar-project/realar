export {
  changed
}

function changed() {
  throw new Error("Unsupported `changed` outside `expression` unit function");
}
