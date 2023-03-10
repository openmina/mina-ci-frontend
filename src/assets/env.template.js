(function (window) {
  window['env'] = window['env'] || {};

  const aggregator = JSON.parse('${AGGREGATOR_URL}');

  window['env']['aggregator'] = aggregator || '';

})(this);
