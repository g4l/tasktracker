app.component('signin', {
  templateUrl: 'components/signin/signin.tpl.html',
  controller: function($state, AuthService){
    this.signin = (email, password) => {
      AuthService.signin(email, password).then(data => {
        $state.go('projects');
      }).catch((e) => {
        this.error = 'Неверно введёно логин и/или пароль!';
      });
    };
  }
});