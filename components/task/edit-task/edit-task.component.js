app.component('editTask', {
  bindings: {
    project: '<',
    users: '<',
    task: '<'
  },
  templateUrl: 'components/task/edit-task/edit-task.tpl.html',
  controller: function(TasksService, $rootScope, $state){
    this.edit = () => {
      if(!this.task.name){
        this.formError = "Name is required";
        return;
      }else if(!this.task.description){
        this.formError = "Description is required";
        return;
      }else if(!this.task.date){
        this.formError = "Date is required";
        return;
      }else if(!this.task.priority){
        this.formError = "Priority is required";
        return;
      }else if(!this.executor && !this.task.executor_id){
        this.formError = "Executor is required";
        return;
      }

      this.formError = "";
      if(this.executor) this.task.executor_id = this.executor.id;

      TasksService.editTask(this.task).then((data) => {
        $state.go("task", {projectId: this.project, taskId: this.task.id});
      });
    };
  }
});