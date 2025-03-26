export const pluralRule = function (value) {
  const formatter = new Intl.PluralRules("en", { type: "cardinal" });
  const mapper = {
    one: `only ${value} room left`,
    other: `${value} rooms available`,
  };
  return mapper[formatter.select(value)]
};
