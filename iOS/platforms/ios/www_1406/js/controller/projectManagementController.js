'use strict';
angular.module('app').controller('projectManagementController', function($scope, productService, $http, $sce) {
    $scope.tabbar.setTabbarVisibility(true);
    $scope.detailFeedbackProject = productService.dataDetailProject;

    
    $scope.checkedAssigns = [];
    $scope.checkedMain = 0;

    $http.get(serverUrl + 'getMainAssigned?projectid=' + productService.CustomerId).success(
        function(data, status, headers, config) {
            $scope.assigned = data;
        }).error(function(data, status, headers, config) {
        console.log(data);
    });

    $scope.initSales = function() {
        $http.get(serverUrl + 'tiendoduan?projectid=' + productService.CustomerId + '&status=0').success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].SDateTimeSince = timeSince(new Date(data[i].SDate).getTime() / 1000);
                    data[i].SDate = data[i].SDate.split(" ")[0];
                    if (i <= data[i].start_at_slide) {
                        data[i].timeline = 1;
                    } else {
                        data[i].timeline = 0;
                    }
                }
                $scope.salesData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.initDesign = function() {
        $http.get(serverUrl + 'tiendoduan?projectid=' + productService.CustomerId + '&status=1').success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].SDateTimeSince = timeSince(new Date(data[i].SDate).getTime() / 1000);
                    data[i].SDate = data[i].SDate.split(" ")[0];
                    if (i <= data[i].start_at_slide) {
                        data[i].timeline = 1;
                    } else {
                        data[i].timeline = 0;
                    }
                }
                $scope.designsData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    $scope.initConstruct = function() {
        $http.get(serverUrl + 'tiendoduan?projectid=' + productService.CustomerId + '&status=2').success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].SDate = data[i].SDate.split(" ")[0];
                    if (i <= data[i].start_at_slide) {
                        data[i].timeline = 1;
                    } else {
                        data[i].timeline = 0;
                    }
                }
                $scope.constructsData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    $scope.initMaintain = function() {
        $http.get(serverUrl + 'baotri?projectid=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].TgHoanThanh = data[i].SDate.split(" ")[0];
                }
                $scope.maintainsData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    $scope.initBooking = function() {
        $http.get(serverUrl + 'dathang?projectid=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].TgDatHangDuration = timeSince(new Date(data[i].TgDatHang).getTime() / 1000);
                    data[i].TgDatHang = data[i].TgDatHang.split(" ")[0];
                    data[i].TgGiaoHang = data[i].TgGiaoHang.split(" ")[0];
                    data[i].TgTienHanh = data[i].TgTienHanh.split(" ")[0];
                }

                $scope.orderData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }


    $scope.initAssign = function() {
        $http.get(serverUrl + 'getEmployees?projectid=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Picture == null || data[i].Picture == '') {
                        data[i].Picture = 'img/avatar.jpg';
                        
                    }
                    data[i].projectId=productService.CustomerId;
                }
                $scope.employeesData = data;
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    $scope.initEditSales = function() {
        $http.get(photoSever + '/service/salesusers?projectId=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Role === 1) {
                        $scope.checkedMain = data[i].UserId;
                    }
                }
                $scope.salesUsers = data;
                console.log(data);
            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    $scope.initEditDesign = function() {
        $http.get(photoSever + '/service/designusers?projectId=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Role === 2) {

                        $scope.checkedAssigns.push(data[i].UserId);
                    } else if (data[i].Role === 1) {
                        $scope.checkedMain = data[i].UserId;
                    }
                }
                $scope.designUsers = data;

            }).error(function(data, status, headers, config) {
            //  console.log(data);      
        });
    }
    
     $scope.initEditConstruct = function() {
        $http.get(photoSever + '/service/implementusers?projectId=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Role === 2) {

                        $scope.checkedAssigns.push(data[i].UserId);
                    } else if (data[i].Role === 1) {
                        $scope.checkedMain = data[i].UserId;
                    }
                }
                $scope.constructUsers = data;
                console.log(data);

            }).error(function(data, status, headers, config) {
            //  console.log(data);      
        });
    }
     
     $scope.initEditOrder = function() {
        $http.get(photoSever + '/service/bookingusers?projectId=' + productService.CustomerId).success(
            function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Role === 2) {

                        $scope.checkedAssigns.push(data[i].UserId);
                    } else if (data[i].Role === 1) {
                        $scope.checkedMain = data[i].UserId;
                    }
                }
                $scope.orderUsers = data;
                console.log(data);

            }).error(function(data, status, headers, config) {
            //  console.log(data);      
        });
    }


    $scope.feedBackEmployee = function(employee) {
        console.log("click on porject==="+employee.projectId);
        window.sessionStorage.setItem("feedBackEmployeeDetailSession", JSON.stringify(employee));
        $scope.ons.navigator.pushPage('employee_feedback.html');
    }
 $scope.initFeedbackDetails= function() {
     
    
    if (typeof(window.sessionStorage.feedBackEmployeeDetailSession) != "undefined") {
        // Load last feedback of this user and append to message
        $scope.feedBackEmployeeDetail = JSON.parse(window.sessionStorage.feedBackEmployeeDetailSession);

        $http.get(serverUrl + 'getFeedbackEmployee?userId=' + $scope.feedBackEmployeeDetail.ID+ "&projectId="+  $scope.feedBackEmployeeDetail.projectId).success(
            function(data, status, headers, config) {
                data.comment = $sce.trustAsHtml(data.comment);
                $scope.lastcomment = data;

            }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
 }

    $scope.sendCommentEmployee = function(message, user) {
        if (typeof(message) != 'undefined') {
            if (message.data != '') {
                spinnerplugin.show();
                var userSend=JSON.parse(window.sessionStorage.userSessionInfo);
                var project = JSON.parse(window.sessionStorage.feedBackEmployeeDetailSession);
                var dataSend = {};
                dataSend.message = message;
                dataSend.user = user;
                dataSend.customerId=project.projectId;
                dataSend.userSend = userSend;
                $http.post(serverUrl + 'saveFeedbackEmployee', JSON.stringify(dataSend)).success(
                    function(data, status, headers, config) {
                        message.data = '';
                        data.comment = $sce.trustAsHtml(data.comment);
                        $scope.lastcomment = data;
                        spinnerplugin.hide();
                        // append to message format Format: <d/m/y h:i Sender: message>
                    }).error(function(data, status, headers, config) {
                    console.log(data);
                });

                ons.notification.alert({
                    message: 'Gửi feedback thành công'
                });
            } else {
                ons.notification.alert({
                    message: 'Vui lòng nhập đánh giá nhân viên'
                });
            }
        } else {
            ons.notification.alert({
                message: 'Vui lòng nhập đánh giá nhân viên'
            });
        }
    }




    $scope.listphotos = function(CustomerId) {
        productService.CustomerId = CustomerId;
        $scope.ons.navigator.pushPage('photos.html');
    };


    $scope.order = function() {
        $scope.ons.navigator.pushPage('orders.html');
    }

    $scope.customerdetail = function() {
        $scope.ons.navigator.pushPage('customer_detail.html');
    }

    $scope.sales = function() {
        $scope.ons.navigator.pushPage('sales.html');
    }


    $scope.design = function() {
        $scope.ons.navigator.pushPage('design.html');
    }

    $scope.construct = function() {
        $scope.ons.navigator.pushPage('construct.html');
    }

    $scope.maintain = function() {
        $scope.ons.navigator.pushPage('maintain.html');
    }

    $scope.employees = function() {
        $scope.projectId=productService.CustomerId;
        $scope.ons.navigator.pushPage('employees.html');
    }

    $scope.addOrder = function() {
        $scope.ons.navigator.pushPage('add_orders.html');
    }
    $scope.addSales = function() {
        $scope.ons.navigator.pushPage('add_sales.html');
    }

    $scope.addDesign = function() {

        $scope.ons.navigator.pushPage('add_design.html');
    }
    $scope.addConstruction = function() {
        $scope.ons.navigator.pushPage('add_construction.html');
    }


    $scope.updateDesign = function() {
        var dataSend = {};
        dataSend.projectId = parseInt(productService.CustomerId);
        dataSend.mainAssignedId = $scope.checkedMain;
        dataSend.assignedUsers = $scope.checkedAssigns;
        //console.log(JSON.stringify(dataSend));
        $.ajax({
            url: photoSever + "/service/UpdateDesign",
            contentType: 'application/json',
            data: JSON.stringify(dataSend),
            type: "POST",
            success: function(res) {
                console.log(res);
                $scope.ons.navigator.pushPage('design.html');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }

        });
    }

    $scope.updateConstruct = function() {
        var dataSend = {};
        dataSend.projectId = parseInt(productService.CustomerId);
        dataSend.mainAssignedId = $scope.checkedMain;
        dataSend.assignedUsers = $scope.checkedAssigns;
        //console.log(JSON.stringify(dataSend));
        $.ajax({
            url: photoSever + "/service/UpdateImplement",
            contentType: 'application/json',
            data: JSON.stringify(dataSend),
            type: "POST",
            success: function(res) {
                console.log(res);
                $scope.ons.navigator.pushPage('construct.html');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }

        });
    }
     $scope.updateOrder = function() {
        var dataSend = {};
        dataSend.projectId = parseInt(productService.CustomerId);
        dataSend.mainAssignedId = $scope.checkedMain;
        dataSend.assignedUsers = $scope.checkedAssigns;
        //console.log(JSON.stringify(dataSend));
        $.ajax({
            url: photoSever + "/service/UpdateBooking",
            contentType: 'application/json',
            data: JSON.stringify(dataSend),
            type: "POST",
            success: function(res) {
                console.log(res);
                $scope.ons.navigator.pushPage('orders.html');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }

        });
    }
    $scope.updateSales = function() {
        var dataSend = {};
        dataSend.projectId = parseInt(productService.CustomerId);
        dataSend.mainAssignedId = $scope.checkedMain;
       // dataSend.assignedUsers = $scope.checkedAssigns;
        //console.log(JSON.stringify(dataSend));
        $.ajax({
            url: photoSever + "/service/UpdateSales",
            contentType: 'application/json',
            data: JSON.stringify(dataSend),
            type: "POST",
            success: function(res) {
                console.log(res);
                $scope.ons.navigator.pushPage('sales.html');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }

        });
    }
    
    
    $scope.assignChecked = function(selected_user) {

        if ($scope.checkedAssigns.indexOf(selected_user.UserId) === -1) {
            $scope.checkedAssigns.push(selected_user.UserId);
        } else {
            $scope.checkedAssigns.splice($scope.checkedAssigns.indexOf(selected_user.UserId), 1);
        }
        console.log("checked list ---" + $scope.checkedAssigns.length);
    };
    $scope.mainChecked = function(selected_user) {

        console.log("main before user ---" + $scope.checkedMain);
        $scope.checkedMain = selected_user.UserId;

        console.log("main checked user ---" + $scope.checkedMain);
    };

});