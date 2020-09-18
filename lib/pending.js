export {
  pending
}

function pending(pool) {
  if (pool) {
    const pending = pool.pending;
    if (pending === true || pending === false) {
      return pending;
    }
  }
  throw new Error(`Function "pending" support only async unit method as agrument`);
}
