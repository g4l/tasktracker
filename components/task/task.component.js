app.component('task', {
  bindings: {
    task: '<',
    project: '<'
  },
  templateUrl: 'components/task/task.tpl.html',
  controller: function($location){
    this.author = this.task.author;
    this.executor = this.task.executor;
    this.task = this.task.task;
    this.task.status = this.task.status == 1 ? 'in progress' : 'completed';
    this.disqusConfig = {
      disqus_shortname: 'angular-esy-es',
      disqus_title: this.task.name
    };
  }
});