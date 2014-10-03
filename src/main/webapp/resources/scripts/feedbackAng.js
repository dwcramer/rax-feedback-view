angular.module('feedbackApp', ['ngResource'])
.factory('FeedbackFactory', function ($resource) {
    return $resource('http://content-services.rackspace.com/rax-feedback-backend/getFeedbackPages',
    		{
    	        startfrom: 0,
    	        retrievetotal: 200
    	    },
    	    {
    	        'query': {method: 'GET'} 
    	    });
}).
controller('FeedbackController', ['$scope', 'FeedbackFactory', function ($scope, feedback) {
    $scope.pages = [];
    $scope.pagecount=0;
    $scope.tablecount=0;
    $scope.setupFeedbackPages = function () {
        feedback.query({
        }, function (data) {
            $scope.pages = data.pages;
            $scope.pagecount=data.count;
            $scope.tablecount=data.pages.length;
            
        });
    };

    $scope.setupFeedbackPages();
    
    $scope.launchFeedback = function(pageid){
    	var newUrl=("http://content-services.rackspace.com/rax-feedback-backend/getAllFeedbacksByPageId?pageid="+pageid);
    	window.location.href=newUrl;
    };
    
    $scope.shouldShowLoads=function(){
    	if($scope.pagecount>$scope.tablecount){
    		return true;
    	}
    	return false;
    };
    
    $scope.loadMoreResults=function(){
    	$('#loadsid1').hide();
    	$('#loadsid2').hide();
    	$('#spinner').show();
    	var tableLength=($('#pagesid tr').length-1);
    	var url="http://content-services.rackspace.com/rax-feedback-backend/getRangeOfFeedbacks?startfrom="+
    	tableLength+"&retrievetotal=200";

    	$.getJSON(url, function(data){})
    	.done(function(data){
        	$('#loadsid1').show();
        	$('#loadsid2').show();
        	$('#spinner').hide();
        	
        	var oldTableSize=$scope.pages.length;
    		$scope.pages=$scope.pages.concat(data);
            $scope.tablecount=$scope.pages.length;
            
            $scope.$apply();
            $(window).scrollTop($('#row'+oldTableSize).offset().top);
    	})
    	.fail(function(data){
        	$('#loadsid1').show();
        	$('#loadsid2').show();
        	$('#spinner').hide();
    	});
    };
    
    $scope.loadAllResults=function(){
    	$('#loadsid1').hide();
    	$('#loadsid2').hide();
    	$('#spinner').show();
    	var tableLength=($('#pagesid tr').length-1);
    	var url="http://content-services.rackspace.com/rax-feedback-backend/getRangeOfFeedbacks?startfrom="+
    	tableLength+"&retrievetotal="+$scope.pagecount;
    	$.getJSON(url, function(data){})
    	.done(function(data){
        	$('#loadsid1').show();
        	$('#loadsid2').show();
        	$('#spinner').hide();
        	
        	var oldTableSize=$scope.pages.length;
    		$scope.pages=$scope.pages.concat(data);
            $scope.tablecount=$scope.pages.length;
            
            $scope.$apply();
            $(window).scrollTop($('#row'+oldTableSize).offset().top);
    	})
    	.fail(function(data){
        	$('#loadsid1').show();
        	$('#loadsid2').show();
        	$('#spinner').hide();
    	});    	
    };
    
    /**********Bind Event Listeners***********/
    
    $('#containerid').on('mouseover','.pagestablerow',function(event){
        var target=event.target;
        $(target).parent().children().attr('style','background-color:#BBCCDD');
    });
    $('#containerid').on('mouseout','.pagestablerow',function(event){
        var target=event.target;
        $(target).parent().children().removeAttr('style');
    });
}]);

