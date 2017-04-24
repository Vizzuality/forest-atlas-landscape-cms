((function (App) {
  'use strict';

  App.Helper.ChartConfig = [
    {
      name: 'bar',
      acceptedStatTypes: [
        ['nominal', 'quantitative'],
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative'],
        ['quantitative', 'quantitative'],
        ['nominal', 'nominal'],
        ['nominal', 'ordinal'],
        ['ordinal', 'nominal']
      ]
    },
    {
      name: 'line',
      acceptedStatTypes: [
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative'],
        ['quantitative', 'quantitative'],
        ['temporal', 'nominal']
      ]
    },
    {
      name: 'pie',
      acceptedStatTypes: [
        ['quantitative'],
        ['nominal'],
        ['nominal'],
        ['ordinal']
      ]
    },
    {
      name: 'scatter',
      acceptedStatTypes: [
        ['nominal', 'quantitative'],
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative'],
        ['quantitative', 'quantitative'],
        ['nominal', 'nominal'],
        ['nominal', 'ordinal'],
        ['ordinal', 'ordinal']
      ]
    }
  ];
})(this.App));
