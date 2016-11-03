const app = angular.module('taskTracker', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $stateProvider.state('signin', {
    url: '/signin',
    template: '<signin></signin>'
  })
  
  .state('projects', {
    url: '/',
    template: '<projects projects="projects"></projects>',
    resolve: {
      projects: function(ProjectsService){
        return ProjectsService.getAll();
      }
    },
    controller: function($scope, projects){
      $scope.projects = projects;
    }
  })
  
  .state('user', {
    url: '/user/:id',
    template: '<user user="user"></user>',
    resolve: {
      user: function($stateParams, UsersService){
        return UsersService.getUser($stateParams.id);
      }
    },
    controller: function($scope, user){
      $scope.user = user;
    }
  })
  
  .state('users', {
    url: '/users',
    template: '<users users="users"></users>',
    resolve: {
      users: function(UsersService){
        return UsersService.getAll();
      }
    },
    controller: function($scope, users){
      $scope.users = users;
    }
  })
  
  .state('project', {
    url: '/project/:id',
    template: '<project tasks="tasks" project="project"></project>',
    resolve: {
      tasks: function($stateParams, TasksService){
        return TasksService.getAll($stateParams.id);
      },
      project: function($stateParams, ProjectsService){
        return ProjectsService.getProject($stateParams.id);
      }
    },
    controller: function($scope, tasks, project){
      $scope.tasks = tasks;
      $scope.project = project;
    }
  })
  
  .state('task', {
    url: '/project/:projectId/task/:taskId',
    template: '<task task="task" project="project"></task>',
    resolve: {
      taskAuthorExecutor: function($stateParams, TasksService, UsersService){ // получаем сначала такс, потом автора таска, потом исполнителя таска
        return TasksService.getTask($stateParams.taskId).then(task => { // получаем таск
          let taskWithAuthor = UsersService.getUser(task.author_id).then(user => { // получаем автора таска
            return {
              task: task,
              author: user,
              executor: user // временно записываем автора сюда, т.к. вдруг он является исполнителем
            }
          });
          
          if(task.author_id == task.executor_id){ // если автор является и исполнителем, то возвращаем результат
            return taskWithAuthor;
          }else{
            return taskWithAuthor.then(obj => { // получаем исполнителя таска
              return UsersService.getUser(task.executor_id).then(executor => {
                obj.executor = executor;
                
                return obj;
              })
            })
          }
        });
      },
      project: function($stateParams, ProjectsService){
        return ProjectsService.getProject($stateParams.projectId);
      }
    },
    controller: function($scope, taskAuthorExecutor, project){
      $scope.task = taskAuthorExecutor;
      $scope.project = project;
    }
  })
  
  .state('signout', {
    url: '/signout',
    controller: function($state, AuthService){
      AuthService.signout().then(response => {
        $state.go('signin');
      });
    }
  });
  
  $urlRouterProvider.otherwise('/');
  
  $locationProvider.html5Mode(true);
})

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthRejector');
})

/*.run(function($rootScope, AuthService){
  if(!$rootScope.user){
    AuthService.getUser();
  }
});*/