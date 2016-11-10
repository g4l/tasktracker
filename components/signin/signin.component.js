app.component('signin', {
  templateUrl: 'components/signin/signin.tpl.html',
  controller: function($rootScope, $state, AuthService){
    if($rootScope.user){
      $state.go('projects');
    }

    this.signin = (email, password) => {
      AuthService.signin(email, password).then(data => {
        $state.go('projects');
      }).catch((e) => {
        this.error = 'Incorrectly entered email and/or password!';
      });
    };
  }
});