angular.module('starter.controllers', [])
    .controller('ContractCtrl', function($scope, Constract) {
        $scope.contractList = Constract.allList(); 
    }).controller('DetailsCtrl', function($scope, $stateParams, Constract, $filter){
        var contractList = Constract.allList();
        console.log($stateParams);
        $scope.result = $filter('filter')(contractList, {PCONTRACT_NO : $stateParams.PCONTRACT_NO})[0];
    });