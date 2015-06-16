'use strict';

/*
*   Set project information to productService.dataDetailProject
*/
angular.module('app').controller('userDetailController',function($scope,$sce, productService, $http) {

		$scope.tabbar.setTabbarVisibility(true);

	$scope.detailUser =  productService.userSelectDetail;
	console.log("goto user detail: "+$scope.detailUser.Username);
	$scope.detailProject = function(data) {
		  spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
		productService.dataDetailProject = data;
		$scope.projects = {};
		productService.dataListProject = {};
		console.log("goto detail: "+ data.CustomerId);
		$scope.ons.navigator.pushPage('detail.html');
		spinnerplugin.hide();
	}

	$http.get(serverUrl + 'getRoleUserSelect?userId=' + productService.userSelectDetail.ID).success(
		function(data, status, headers, config) {
			$scope.userRoles = data;
		}).error(function(data, status, headers, config) {
			console.log(data);
		});

       $scope.photoServer=photoSever+"/attachments/projects/";
		$http.get(serverUrl + 'getCurrentAssignProject?userId=' + productService.userSelectDetail.ID).success(
			function(data, status, headers, config) {
                
				$scope.userAssignProject = data;
			}).error(function(data, status, headers, config) {
				console.log(data);
			});

 $scope.gotoFeedbackDetails = function(projectId) {
        var employee = {};
        employee.Username = $scope.detailUser.Username;
        employee.Email = $scope.detailUser.Email;
        employee.avatar = $scope.detailUser.avatar;
        employee.ID = $scope.detailUser.ID;
        employee.projectId=projectId;
        window.sessionStorage.setItem("feedBackEmployeeDetailSession", JSON.stringify(employee));
        $scope.ons.navigator.pushPage('employee_feedback.html');
    }
		});
