app.component('editProject', {
	bindings: {
		project: '<'
	},
	templateUrl: 'components/projects/edit-project/edit-project.tpl.html',
	controller: function(ProjectsService, $state){
		this.edit = () =>{
			ProjectsService.editProject(this.project).then((data) => {
				$state.go('project', {id: this.project.id});
			});
		};
	}
});