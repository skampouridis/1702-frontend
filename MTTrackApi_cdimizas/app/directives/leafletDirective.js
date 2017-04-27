(function () {
  angular.module('MTTrackingApi').directive('dirLeaflet', [
         'LeafletService',
      function (LeafletService) {
        return {
          replace: true,
          template: '<div></div>',
          link: function (scope, element, attributes) {
            LeafletService.resolve(element[0]);
          }
        };
      }
      ]);

})();
