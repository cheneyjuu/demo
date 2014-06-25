angular.directive('iFrame', function(){
    var linkFn = function(scope, element, attrs) {
        alert(0);
        element.find('iframe').bind('load', function (event) {
          alert(1);
        });
    };
    return {
        scope: {
            src : '@src',
            width : '@width',
            height : '@height'
        },
        restrict: 'EA',
        template: '<iframe class="frame" height="{{height}}" width="{{width}}" frameborder="0" border="0" marginwidth="0" marginheight="0" src="{{src}}"></iframe>',
        link: linkFn
    };
});
