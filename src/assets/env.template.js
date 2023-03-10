(function (window) {
  window['env'] = window['env'] || {};

  const aggregator = '${AGGREGATOR_URL}';

  window['env']['aggregator'] = aggregator || '';

})(this);
