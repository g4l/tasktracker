app.service('AuthService', function($http, $rootScope){
  var link = 'http://angular.esy.es/api.php';
  
  this.signin = (email, password) => {
    return $http.post(link, {"email": email, "password": password}).then(response => {
      $rootScope.user = response.data;
      
      return response.data;
    });
  };

  this.signup = (email, name, date, password) => {
    return $http.post(link + '/task_users', {
      "email": email,
      "name": name,
      "date": date,
      "img": "http://vebmastak.ru/Fail/Veb/noavatar.gif",
      "password": password
    }).then((response) => {
      return this.signin(email, password);
    });
  };
  
  this.signout = () => {
    return $http.post(link, {"logout": "logout"}).then(response => {
      $rootScope.user = null;
      return response;
    });
  };
  
  this.getUser = () => {
    return $http.post(link, {"get_user": "user"}).then(response => {
      $rootScope.user = response.data;
      
      return response.data;
    });
  };
});

app.service('AuthRejector', function($injector, $q){
  this.responseError = function(responseError){
    if(responseError.status === 401){
      $injector.get('$state').go('signin');
    }
    
    return $q.reject(responseError);
  };
});