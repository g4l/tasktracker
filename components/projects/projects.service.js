app.service('ProjectsService', function($http){
  let link = 'http://angular.esy.es/api.php/task_projects';
  
  this.getAll = () => {
    return $http.get(link + '?transform=1').then(response => response.data.task_projects);
  };
  
  this.getProject = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_projects[0]);
  };
});