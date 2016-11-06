app.service('TasksService', function($http){
  let link = 'http://angular.esy.es/api.php/task_tasks';
  
  this.getAll = (projectId) => {
    return $http.get(link + '?filter=project_id,cs,' + projectId + '&transform=1').then(response => response.data.task_tasks);
  };
  
  this.getTask = (id) => {
    return $http.get(link + '/' + id).then(response => response.data);
    // '?filter=id,cs,' + id + '&transform=1'
  };

  this.addTask = (name, description, date, priority, author_id, executor_id, project_id) => {
    return $http.post(link, {
      "name": name,
      "description": description,
      "status": "1",
      "date": date,
      "priority": priority,
      "author_id": author_id,
      "executor_id": executor_id,
      "project_id": project_id
    }).then(response => response.data);
  };

  this.deleteTask = (id) => {
    return $http.delete(link + '/' + id).then(response => response);
  };

  this.editTask = (task) => {
    return $http.put(link + '/' + task.id, task).then(response => response);
  };
});