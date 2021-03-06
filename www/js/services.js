angular.module('open311.services', [])

.factory('API', function($http, $httpParamSerializer, $q) {

  var SERVER_PATH = 'http://52.34.144.221:80/v1';
  var recentCasesData = [];

  var getRequests = function(lat, long) {

    var params = $httpParamSerializer({
      lat: lat,
      lng: long
    });

    return $http.get(SERVER_PATH + '/requests.json?' + params)
      .then(function(response) {
        recentCasesData = response.data;
        return response;
      }, function(response) {
        console.log('HTTP ERROR: ' + response.status + ' for ' + SERVER_PATH);
        return response;
      });
  };

  var getCase = function(caseID) {
    for (var i = 0; i < recentCasesData.length; i++) {
      if (recentCasesData[i].service_request_id === parseInt(caseID)) {
        return $q.resolve(recentCasesData[i]);
      }
    }
    return $http.get(SERVER_PATH + '/requests/' + caseID + '.json').then(function(response) {
      return response.data[0];
    });
  };

  var getCategories = function(lat, lng) {
    var params = $httpParamSerializer({
      lat: lat,
      lng: lng
    });

    return $http.get(SERVER_PATH + '/services.json?' + params).then(function(response) {
      return response;
    });
  };

  var postRequest = function (request) {
    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return $http.post(SERVER_PATH + '/requests.json', request, config).then(function successCallback(response) {
      console.log('success', response);
      return response;
    }, function failureCallback(response) {
      console.log('error', response);
    });
  }

  return {
    getRequests: getRequests,
    getCase: getCase,
    getCategories: getCategories,
    postRequest: postRequest
  };
})

// App level global variables
  .factory('App', function () {
    var defaultIssue = function () {
      return {
        'image': 'img/default-placeholder.png'
      }
    };

    var issueObject;

    return {
      getIssue: function () {
        if (!issueObject) {
          issueObject = defaultIssue();
        }
        return issueObject;
      },
      setIssue: function (obj) {
        issueObject = obj;
      }
    }
  });
