module.exports = {
  "presets": [
    "@babel/env",
    "@babel/react"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    __dirname + "/babel/index.js"
  ]
}
