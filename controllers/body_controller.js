var pollData = {};


ang.controller('bodyController', function($scope, $http){

    $scope.test = 'Minah';
    $scope.submit_poll = function(){
        var title = document.getElementById('poll_title').value;
        var author = document.getElementById('title').innerHTML;
        var pollOpt = document.getElementById('poll_id').childNodes;
        pollData.author = author.split(' ')[1];
        pollData.title = title;
        pollData.opts = [];
        for(var i = 0; i < pollOpt.length; i++){
            if(pollOpt[i].value !== '') {
                var dic = {};
                dic['score'] = 0;
                dic['custom_id'] = pollOpt[i].value;
                pollData.opts.push(dic);
            }
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
            console.log(data)
        })
    }
});
