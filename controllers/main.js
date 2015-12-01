ang = angular.module('pollApp', ['chart.js']);

var h = screen.height;

ang.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#ff6868', '#6f68ff', '#68ff68', '#ffcf68', '#ff68e8',
                  '#737373', '#00732b', '#dcff89', '#7f5e4e', '#496e7a'],
        scaleShowLabels: true,
        tooltipFontSize: Math.round(h / 150),
        // maintainAspectRatio: false,
        onAnimationComplete: function()
    {
        this.showTooltip(this.segments, true);
    },

    tooltipEvents: [],

    showTooltips: true
    });
}]);

ang.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


