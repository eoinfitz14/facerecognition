import React from 'react';

// import './SignIn.css';
// Made sign in a smart component so it is now a Class
class SignIn extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    onSubmitSignIn = () => {
        // fetch does get request by default so add second param for post request
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json()) // usual way to get the response
            .then(user => { // data refers to the http message (can be found in the Network tab of console under the request)
                if(user){ // if we get a user back
                    this.props.loadUser(user); // entire app can use this so defining it in App.js hence, this.props before
                    this.props.onRouteChange('home');
                }
            })
        this.props.onRouteChange('home');
    }

    render(){
        //Form taken from tachyons
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-white w-100" 
                                    type="email" 
                                    name="email-address" 
                                    id="email-address" 
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input 
                                onClick={this.onSubmitSignIn}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={ () => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default SignIn; 