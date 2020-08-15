let
  debug_mode = process.env.REALAR_DEV;

module.exports = {
  transform
};

function transform_code(code) {
  if (!debug_mode) return code;
  code = code.replace(/\/\*#if DEBUG/g, "//#if DEBUG");
  code = code.replace(/\/\/#else \*\//g, "/*#else");
  code = code.replace(/\/\/#endif \*\//g, "//#endif");
  code = code.replace(/\/\/#endif/g, "//#endif */");
  return code;
}

function transform(cfg) {
  if (typeof cfg === "string") {
    return transform_code(cfg);
  } else {
    cfg.code = transform_code(cfg.code);
    return cfg;
  }
}
