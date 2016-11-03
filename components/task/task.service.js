app.service('TasksService', function($http){
  let link = 'http://angular.esy.es/api.php/task_tasks';
  
  this.getAll = (projectId) => {
    return $http.get(link + '?filter=project_id,cs,' + projectId + '&transform=1').then(response => response.data.task_tasks);
  };
  
  this.getTask = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_tasks[0]);
  };
});