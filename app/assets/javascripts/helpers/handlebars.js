Handlebars.registerHelper('if_eq', function (a, b, opts) {
  // This code is really tricky: when Handlebars is passed the value null, it replaces it with an empty object.
  // Nevertheless, any other value is also converted to an object using the constructor Boolean, Number or String
  var isNullObject = function (obj) {
    return (obj instanceof Object) && !(obj instanceof Number) && !(obj instanceof Boolean) && !Object.keys(obj).length;
  };

  if (a === b || (b === null && isNullObject(a))) return opts.fn(this);
  return opts.inverse(this);
});
