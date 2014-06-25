angular.module('starter.controllers', ['ngSanitize'])
    .controller('ContractCtrl', function($scope, Constract, $ionicLoading) {
        $scope.contractList = Constract.reloadData();
        $scope.pullingFunc = function() {
            $ionicLoading.show({
              template: '正在加载，请稍后 ...'
            });
        }
        $scope.refreshData = function() {
            $scope.contractList = Constract.reloadData();
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        }
    }).controller('DetailsCtrl', function($scope, $stateParams, $filter, Constract, Attachment, PendingResult, $ionicLoading, $ionicPopup) {
        $scope.opinion = "";
        var contractList = Constract.allList();
        $scope.result = $filter('filter')(contractList, {
            PCONTRACT_NO: $stateParams.PCONTRACT_NO
        })[0];

        $scope.viewAttachement = function(url) {
            Attachment.show(url);
            $scope.attachment = 'attachment';
            // if (Attachment.fileurl!=null){
            //     $ionicLoading.show({
            //       template: '正在加载，请稍后 ...'
            //     });
            //     $scope.attachment = 'attachment';
            // } else {
            //     $ionicPopup.alert({
            //      title: '提示信息',
            //      template: '<span style="text-align:center;">附件不存在！</span>'
            //    });
            // }
        };
        $scope.submitForm = function(flag) {
            if ($scope.opinion.length<=0 && flag == 'Y'){
                $scope.opinion = '同意';
            }
            PendingResult.requestServer($scope.result, $scope.opinion, flag);
        };

    }).controller('AttachmentCtrl', function($scope, Attachment, $window, $sce, $ionicLoading) {
        $scope.frameHeight = $window.outerHeight;
        $scope.attachmentHtml = $sce.trustAsResourceUrl(Attachment.fileurl); 
        $ionicLoading.hide();
    });
