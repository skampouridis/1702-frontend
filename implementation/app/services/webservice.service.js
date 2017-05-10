angular.module('myApp')
  .factory('WebService', function(){
    var apiUrl = config.backendUrl;
    var service = {};
    service.Endpoint = function(_path) {
      return apiUrl + _path;
    }
    return service;
  });
