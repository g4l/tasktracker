app.service('AuthService', function($http, $rootScope){
  var link = 'http://angular.esy.es/api.php';
  var isAuth = false;
  
  this.signin = (email, password) => {
    return $http.post(link, {"email": email, "password": password}).then(response => {
      $rootScope.user = response.data;
      isAuth = true;
      
      return response.data;
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
      isAuth = true;
      
      return response.data;
    });
  };
  
  this.isAuth = () => {
    if(isAuth) return true;
    
    return false;
  };
  
  this.auth = auth => isAuth = true;
})

.service('AuthRejector', function($injector, $q){
  this.responseError = function(responseError){
    if(responseError.status === 401){ 
      $injector.get('$state').go('signin');
    }
    
    return $q.reject(responseError);
  };
});