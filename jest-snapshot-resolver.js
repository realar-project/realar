module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/\.test\.([tj]sx?)/, `${snapshotExtension}.$1`),

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, ".test"),

  testPathForConsistencyCheck: "test/basic.test.js"
};
