app.component('task', {
  bindings: {
    task: '<',
    project: '<'
  },
  templateUrl: 'components/task/task.tpl.html',
  controller: function($location, TasksService, $state, $rootScope){
    this.user = $rootScope.user;
    this.author = this.task.author;
    this.executor = this.task.executor;
    this.task = this.task.task;
    this.status = this.task.status;
    this.task.status = this.task.status == 1 ? 'in progress' : 'completed';
    this.disqusConfig = {
      disqus_shortname: 'angular-esy-es',
      disqus_title: this.task.name
    };

    this.delete = () => {
      TasksService.deleteTask(this.task.id).then(data => data);

      $state.go('project', {id: this.project.id});
    };

    this.complete = () => {
      this.task.status = 2;
      TasksService.editTask(this.task);

      $state.go('project', {id: this.project.id});
    };

    this.reopen = () => {
      this.task.status = 1;
      TasksService.editTask(this.task);

      $state.go('project', {id: this.project.id});
    };
  }
});