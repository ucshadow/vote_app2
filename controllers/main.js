ang = angular.module('pollApp', ['chart.js']);

ang.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#ff6868', '#6f68ff', '#68ff68', '#ffcf68', '#ff68e8',
                  '#8868ff', '#00732b', '#dcff89', '#7f5e4e', '#496e7a'],
        scaleShowLabels: true,
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

var line_number = 1;
var pollData = {};


ang.controller('bodyController', function($scope, $http){

    $scope.test = 'Minah';
    $scope.submit_poll = function(){
        var title = document.getElementById('poll_title').value;
        var author = document.getElementById('title').innerHTML;
        var pollOpt = document.getElementById('poll_id').childNodes;
        pollData.author = author.split(' ')[1];
        pollData.title = title;
        pollData.options = [];
        for(var i = 0; i < pollOpt.length; i++){
            var dic = {};
            dic['score'] = 0;
            dic['custom_id'] = pollOpt[i].value;
            pollData.options.push(dic);
        }
        //console.log('-----------------Sending Poll Data --------------');
        //console.log(pollData);
        $http.post('/submit_poll', pollData).success(function(data, status){
            //console.log(status);
        })
    };
    $scope.query_poll = function(){
        var author = document.getElementById('title').innerHTML;
        var name = {data: author.split(' ')[1]};
        $http.post('/query_polls', name).success(function(data){
            //console.log('received data:');
            //console.log(data)
        })
    }
});

ang.controller('formPoll', function($scope) {
    $scope.r = 'NaEun';
    $scope.keyPress = function(event){
        if(event.which === 13){
            document.querySelector('#p0').focus()
        }
    }
});

ang.controller('pollOptions', function($scope){
    $scope.keyPress = function(event){
        if(event.which === 13){
            var parent_ = event.target.parentElement;
            var newRow = document.createElement('input');
            newRow.setAttribute('id', 'p' + line_number);
            newRow.setAttribute('class', 'poll_option');
            newRow.setAttribute('type', 'text');
            newRow.setAttribute('name', 'poll_option' + line_number);
            newRow.setAttribute('placeholder', 'option ' + line_number);
            parent_.appendChild(newRow);
            document.querySelector('#p' + line_number).focus();
            line_number += 1;
        }
    }
});

ang.controller('pollController', function($scope, $http, socket){

    var colors = ['#ff6868', '#6f68ff', '#68ff68', '#ffcf68', '#ff68e8',
                  '#8868ff', '#00732b', '#dcff89', '#7f5e4e', '#496e7a'];
    var labels = [];
    var pie_data = [];
    var emitter = function(){
        var pid = {data: window.location.pathname.substr(1)};
        socket.emit('pollId', pid);
    };
    var colorer = function(){
        for(var z in labels){
            var names = document.getElementById(labels[z]);
            names.style.background =  colors[z];
        }
    };
    emitter();

    $scope.labels = labels;
    $scope.data = pie_data;

    socket.on('graphData', function(d){
        //console.log('data from socket');
        //console.log(d);
        var data = d.options;
        var page_id = d._id;
        if(window.location.pathname.substr(1) === page_id) {  // reload protection between graphs
            if (labels.length === 0) {
                for (var i = 0; i < data.length; i++) {
                    labels.push(data[i].custom_id);
                    pie_data.push(data[i].score);
                }
            } else {
                var new_pie_data = [];
                for (var x = 0; x < labels.length; x++) {
                    new_pie_data.push(data[x].score)
                }
                $scope.data = new_pie_data;
            }
            colorer();
        }
    });


    var alerts = document.getElementById('alerts');
    var selected = 0;
    var poll = document.getElementById('ul_ul');
        $scope.show_results = function(){
            //console.log('show clicked');

    };
    poll.addEventListener('click', function(obj){
        if(obj.target.id !== 'option_row' && obj.target.id !== 'poll_') {
            if (selected === 0) {
                selected = obj.target.id;
                document.getElementById(selected).style.borderRadius = '2em';
            } else {
                document.getElementById(selected).style.borderRadius = '0em';
                selected = obj.target.id;
                document.getElementById(selected).style.borderRadius = '2em';
            }
        }
    }, false);

    $scope.submit_vote = function(){

        if(selected === 0){
            alerts.innerHTML = 'Please select at least one option';
        } else {
            var load = {data: {choice: selected, poll_id: window.location.pathname.substr(1)}};
            $http.post('/submit_poll_vote', load).success(function (data) {
                //console.log('received data:');
                //console.log(data)
                emitter();
            });

            var d1 = new Date(),
                d2 = new Date(d1);
            d2.setSeconds(d1.getSeconds() + 1);
            var expireTime = d2.toUTCString();
            if (document.cookie.replace(/(?:(?:^|.*;\s*)VoteOnce\s*=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
                document.cookie = "VoteOnce=true; expires=" + expireTime;
                //console.log(document.cookie);
            } else {
                alert("Wait at least 5 secs");
            }
        }
    };

});
