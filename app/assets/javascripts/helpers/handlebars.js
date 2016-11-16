Handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a === b) return opts.fn(this);
  return opts.inverse(this);
});
