app.component('signin', {
  templateUrl: 'components/signin/signin.tpl.html',
  controller: function($state, AuthService){
    this.signin = (email, password) => {
      AuthService.signin(email, password).then(data => {
        $state.go('projects');
      }).catch((e) => {
        this.error = 'Incorrectly entered email and/or password!';
      });
    };
  }
});