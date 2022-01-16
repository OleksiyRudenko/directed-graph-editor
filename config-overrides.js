const rewireRawLoader = require("@baristalabs/react-app-rewire-raw-loader");

module.exports = function override(config, env) {
  config = rewireRawLoader(config, env);
  // TODO: enable import css as styles
  /* config.module.rules.forEach((rule, idx) => {console.log(idx); console.dir(rule)});
  const css = config.module.rules[1].oneOf[2];
  console.dir(css.use); */
  /* config.module.rules.push({
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  }); */
  return config;
};
