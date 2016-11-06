app.component('addProject', {
	templateUrl: 'components/projects/add-project/add-project.tpl.html',
	controller: function(ProjectsService, $state){
		this.add = (name) =>{
			ProjectsService.addProject(name).then((data) => {
				$state.go('project', {id: data});
			});
		};
	}
});