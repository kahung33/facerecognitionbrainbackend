import React, {Component} from 'react';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

class Register extends Component{
    constructor(props){
        super();
        this.state = {
            username : '',
            password : '',
            email : '',
        }
    }

    onUsernameChange = (event) => {
        this.setState({username : event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({password : event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({email : event.target.value})
    }

    onSubmitRegister = () => {
        fetch(' https://salty-caverns-71107.herokuapp.com/register', {
            method : 'post',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                name : this.state.username,
                password : this.state.password,
                email : this.state.email,
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) {
                this.props.loadUser(user)
                this.props.onRouteChange('home')
            }
        })
    }

    render(){
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
                <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="name"  
                                id="name"
                                onChange = {this.onUsernameChange}
                                />
                    </div>
                    <div className ="mt3">
                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address"
                            onChange={this.onEmailChange}
                            />
                  </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="password"  
                                id="password"
                                onChange={this.onPasswordChange}
                                />
                    </div>
                    </fieldset>
                    <div className="">
                    <input 
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                    type="submit" 
                    value="Register"
                    onClick={this.onSubmitRegister}
                    />
                    </div>
                    <div className="lh-copy mt3">
                    </div>
                </div>
                </main>
            </article>
                );
            }
    }


export default Register;