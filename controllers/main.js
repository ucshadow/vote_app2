ang = angular.module('pollApp', []);

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
            //n = 'option' + i;
            pollData.options.push(pollOpt[i].value);
        }
        // console.log(pollData);
        $http.post('/submit_poll', pollData).success(function(data, status, headers){
            console.log(status);
        })
    };
    $scope.query_poll = function(){
        var author = document.getElementById('title').innerHTML;
        var name = {data: author.split(' ')[1]};
        $http.post('/query_polls', name).success(function(data){
            console.log('received data:');
            console.log(data)
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
