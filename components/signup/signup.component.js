app.component('signup', {
	templateUrl: 'components/signup/signup.tpl.html',
	controller: function($rootScope, $state, AuthService){
		if($rootScope.user){
			$state.go('projects');
		}

		this.signup = (name, date, email, password, conf_password) => {
			if(!name){
				this.formError = 'Name is required';
				return;
			}else if(!date){
				this.formError = 'Date is required';
				return;
			}else if(!email){
				this.formError = 'Email is required';
				return;
			}else if(!password){
				this.formError = 'Password is required';
				return;
			}else if(!conf_password){
				this.formError = 'Confirm password is required';
				return;
			}else if(password !== conf_password){
				this.formError = 'Passwords do not match';
				return;
			}

			AuthService.signup(email, name, date, password).then(data => {
				$state.go('projects');
			}).catch((e) => {
				this.formError = 'Such email is already registered!';
			});
		};
	}
});