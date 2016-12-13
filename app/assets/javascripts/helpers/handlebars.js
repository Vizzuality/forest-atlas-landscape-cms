/**
 * Provide a way to compare two values (i.e. classic condition)
 */
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  // This code is really tricky: when Handlebars is passed the value null, it replaces it with an empty object.
  // Nevertheless, any other value is also converted to an object using the constructor Boolean, Number or String
  var isNullObject = function (obj) {
    return (obj instanceof Object) && !(obj instanceof Number) && !(obj instanceof Boolean) && !Object.keys(obj).length;
  };

  if (a === b || (b === null && isNullObject(a))) return opts.fn(this);
  return opts.inverse(this);
});

/**
 * Provide an iterator through the list of values between a min and a max value (inclusive),
 * with the provided step
 */
Handlebars.registerHelper('each_range', function (min, max, step, block) {
  // Javascript is a player: if it has to sum 1.6 with 0.1, then it will return 1.7000000000000002
  // For this reason, we have a method to count the number of decimals of a number so we
  // later return the exact value
  var getDecimalsCount = function (number) {
    var str = number + '';
    var split = str.split('.');
    return (split.length === 1) ? 0 : split[1].length;
  };

  var count = ((max - min) / step) + 1;
  var stepDecimals = getDecimalsCount(step); // Maxiumum number of decimals allowed

  return new Array(count).fill(null).map(function (value, index) {
    var res = min + (index * step);
    res = +res.toFixed(stepDecimals);
    return block.fn(res);
  }).reduce(function (res, value) {
    return res + value;
  }, '');
});

/**
 * Provide a conditional helper which checks if value is contained into array
 */
Handlebars.registerHelper('if_contains', function (array, value, opts) {
  array = array || []; // eslint-disable-line no-param-reassign
  if (array.indexOf(value) !== -1) return opts.fn(this);
  return opts.inverse(this);
});

/**
 * Provide a way to format dates as MM/DD/YYYY
 */
Handlebars.registerHelper('format_date', function (date) {
  if (!(date instanceof Date)) {
    date = new Date(date); // eslint-disable-line no-param-reassign
  }

  var day = date.getUTCDate();
  var month = date.getUTCMonth() + 1;
  var year = date.getUTCFullYear();

  return [month, day, year].join('/');
});
