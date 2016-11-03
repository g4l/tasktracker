app.service('UsersService', function($http){
  let link = 'http://angular.esy.es/api.php/task_users';
  
  this.getAll = () => {
    return $http.get(link + '?transform=1').then(response => response.data.task_users);
  };
  
  this.getUser = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_users[0]);
  };
});