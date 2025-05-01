module.exports = {
  presets: ["next/babel"],
  plugins: [
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-private-property-in-object",
    "@babel/plugin-transform-class-properties"
  ]
};
