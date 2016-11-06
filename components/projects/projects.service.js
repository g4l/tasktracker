app.service('ProjectsService', function($http, $rootScope){
  let link = 'http://angular.esy.es/api.php/task_projects';
  
  this.getAll = () => {
    return $http.get(link + '?transform=1').then(response => response.data.task_projects);
  };
  
  this.getProject = (id) => {
    return $http.get(link + '/' + id).then(response => response.data);
  };

  this.addProject = (name) => {
    return $http.post(link, {
      "name": name,
      "author_id": $rootScope.user.id
    }).then(response => response.data);
  };

  this.editProject = (project) => {
    return $http.put(link + '/' + project.id, project).then(response => response);
  };
});