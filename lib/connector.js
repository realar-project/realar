const
  connector_key = Symbol();

export {
  connector,
  is_connector
}

function connector(fn) {
  fn[connector_key] = true;
  return fn;
}

function is_connector(fn) {
  return fn[connector_key];
}
