app.component('project', {
  bindings: {
    tasks: '<',
    project: '<'
  },
  templateUrl: 'components/projects/project/project.tpl.html',
  controller: function($rootScope){
    this.user = $rootScope.user;
    this.progress = this.tasks.filter(function(item){
      return item.status == 1;
    });
    this.completed = this.tasks.filter(function(item){
      return item.status == 2;
    });
  }
});