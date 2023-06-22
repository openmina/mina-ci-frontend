(function (window) {
  window['env'] = window['env'] || {};

  const aggregator = '${AGGREGATOR_URL}';
  const drone = '${DRONE_URL}';

  window['env']['aggregator'] = aggregator || '';
  window['env']['drone'] = drone || '';

})(this);
