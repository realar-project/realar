export {
  changed
}

function changed(value, cmpfn, vals, vals_key) {
  if (arguments.length !== 4) {
    throw new Error(`Unsupported "changed" function call outside of unit "expression"`);
  }

  let is_changed = false;
  if (vals.has(vals_key)) {
    const val = vals.get(vals_key);
    is_changed = !(cmpfn || Object.is)(value, val);
    if (is_changed) {
      vals.set(vals_key, value);
    }
  } else {
    vals.set(vals_key, value);
  }
  return is_changed;
}
