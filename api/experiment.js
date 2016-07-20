const TwitchMonitor = require('./twitchMonitor');

var id = TwitchMonitor.registerListener('voyboy', function(status) {
  console.log('status change stream', status)
});

setTimeout(function() {
  TwitchMonitor.unregisterListener('voyboy', id);
}, 10000);