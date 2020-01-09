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
 * Provide a way to determine if a variable is an array or not
 */
Handlebars.registerHelper('is_array', function (obj, opts) {
  if (Array.isArray(obj)) return opts.fn(this);
  return opts.inverse(this);
});

/**
 * Provide a way to loop slice an array and loop through it
 * NOTE: it also provides the variables @index, @last_sliced_item and @last_item
 */
Handlebars.registerHelper('each_slice', function (array, count, opts) {
  if (!array.length) return opts.inverse(this);
  return array.slice(0, count)
    .map(function (elem, index) {
      return opts.fn(elem, {
        data: {
          index: index,
          last_sliced_item: index === count - 1,
          last_item: index === array.length - 1
        }
      });
    }).join('');
});

/**
 * Not Equals helper
 */
Handlebars.registerHelper('ne', function (v1, v2, opts) {
  if (v1 !== v2) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});
