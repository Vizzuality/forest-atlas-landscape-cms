((function (App) {
  'use strict';

  App.Helper.ChartConfig = [
    {
      name: 'bar',
      acceptedStatTypes: [
        ['nominal', 'quantitative'],
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative']
      ]
    },
    {
      name: 'line',
      acceptedStatTypes: [
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative']
      ]
    },
    {
      name: 'pie',
      acceptedStatTypes: [
        ['nominal'],
        ['ordinal']
      ]
    },
    {
      name: 'scatter',
      acceptedStatTypes: [
        ['quantitative', 'quantitative'],
        ['nominal', 'nominal'],
        ['nominal', 'ordinal'],
        ['ordinal', 'ordinal']
      ]
    }
  ];
})(this.App));
