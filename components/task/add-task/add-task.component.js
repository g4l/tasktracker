app.component('addTask', {
  bindings: {
    project: '<',
    users: '<'
  },
  templateUrl: 'components/task/add-task/add-task.tpl.html',
  controller: function(TasksService, $rootScope, $state){
    this.add = (name, description, date, priority, executor) => {
      if(!name){
        this.formError = "Name is required";
        return;
      }else if(!description){
        this.formError = "Description is required";
        return;
      }else if(!date){
        this.formError = "Date is required";
        return;
      }else if(!priority){
        this.formError = "Priority is required";
        return;
      }else if(!executor){
        this.formError = "Executor is required";
        return;
      }

      this.formError = "";

      TasksService.addTask(name, description, date, priority, $rootScope.user.id, executor.id, this.project).then((id) => {
        $state.go("task", {projectId: this.project, taskId: id});
      });
    };
  }
});