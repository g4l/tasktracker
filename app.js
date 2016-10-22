let app = angular.module('taskTracker', ['ui.router']);

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

.run(function($rootScope, AuthService){
  if(!$rootScope.user){
    AuthService.getUser();
  }
})

.service('UsersService', function($http){
  let link = 'http://angular.esy.es/api.php/task_users';
  
  this.getAll = () => {
    return $http.get(link + '?transform=1').then(response => response.data.task_users);
  };
  
  this.getUser = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_users[0]);
  };
})

.service('ProjectsService', function($http){
  let link = 'http://angular.esy.es/api.php/task_projects';
  
  this.getAll = () => {
    return $http.get(link + '?transform=1').then(response => response.data.task_projects);
  };
  
  this.getProject = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_projects[0]);
  };
})

.service('TasksService', function($http){
  let link = 'http://angular.esy.es/api.php/task_tasks';
  
  this.getAll = (projectId) => {
    return $http.get(link + '?filter=project_id,cs,' + projectId + '&transform=1').then(response => response.data.task_tasks);
  };
  
  this.getTask = (id) => {
    return $http.get(link + '?filter=id,cs,' + id + '&transform=1').then(response => response.data.task_tasks[0]);
  };
})

.service('AuthService', function($http, $rootScope){
  var link = 'http://angular.esy.es/api.php';
  var isAuth = false;
  
  this.signin = (email, password) => {
    return $http.post(link, {"email": email, "password": password}).then(response => {
      $rootScope.user = response.data;
      isAuth = true;
      
      return response.data;
    });
  };
  
  this.signout = () => {
    return $http.post(link, {"logout": "logout"}).then(response => {
      $rootScope.user = null;
      return response;
    });
  };
  
  this.getUser = () => {
    return $http.post(link, {"get_user": "user"}).then(response => {
      $rootScope.user = response.data;
      isAuth = true;
      
      return response.data;
    });
    debugger;
  };
  
  this.isAuth = () => {
    if(isAuth) return true;
    
    return false;
  };
  
  this.auth = auth => isAuth = true;
})

.service('AuthRejector', function($injector, $q){
  this.responseError = function(responseError){
    if(responseError.status === 401){ 
      $injector.get('$state').go('signin');
    }
    
    return $q.reject(responseError);
  };
})

/*.service('LoadingService', function(){
  this.load = () => {
    document.body.getElementsByTagName('ui-view')[0].innerHTML = '<loading></loading>';
  };
})*/

.component('user', {
  bindings: {
    user: '<'
  },
  templateUrl: 'components/user/user.tpl.html'
})

.component('users', {
  bindings: {
    users: '<'
  },
  templateUrl: 'components/users/users.tpl.html'
})

.component('projects', {
  bindings: {
    projects: '<'
  },
  templateUrl: 'components/projects/projects.tpl.html'
})

.component('project', {
  bindings: {
    tasks: '<',
    project: '<'
  },
  templateUrl: 'components/project/project.tpl.html',
  controller: function(){
    this.progress = this.tasks.filter(function(item){
      return item.status == 1;
    });
    this.completed = this.tasks.filter(function(item){
      return item.status == 2;
    });
  }
})

.component('task', {
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
})

.component('signin', {
  templateUrl: 'components/signin/signin.tpl.html',
  controller: function($state, AuthService){
    this.signin = (email, password) => {
      AuthService.signin(email, password).then(data => {
        $state.go('projects');
      }).catch((e) => {
        console.dir(e);
        this.error = 'Неверно введёно логин и/или пароль!';
      });
    };
  }
})

.component('dirDisqus', {
  bindings: {
    config: '='
  },
  template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink"></a>',
  controller: function($window, $location){
    var url = $location.absUrl();
    if (!$window.DISQUS) {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + this.config.disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    } else {
      $window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = url + '/angular-esy-es';
          this.page.url = url;
          this.page.title = this.config.disqus_title;
        }
      });
    }
  }
})

/*.component('loading', {
  templateUrl: '/components/loading/loading.tpl.html'
})*/