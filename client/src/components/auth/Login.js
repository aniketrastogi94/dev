import React,{Fragment,useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login,loginwithgoogle} from '../../actions/auth';
import GoogleLogin from 'react-google-login';


const Login=({login,isAuthenticated,loginwithgoogle})=>{
    const [formData,setFormData]=useState({
        email:'',
        password:''
    });

    const {email,password}=formData;
    const responseSuccess=(response)=>{
        loginwithgoogle(response.tokenId);
      }
      const responseError=(response)=>{
        console.log(response);
      }

    const onChange=e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const onSubmit=e=>{
        e.preventDefault();
        login(email,password);
    }
    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i>Login To Your Account</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email"
                        value={email}
                        onChange={e=>onChange(e)} 
                    />
                    {/* <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small> */}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e=>onChange(e)}
                        minLength="6"
                    />
                </div>
                <p className="my-1"><Link to="/reset">Forget Password</Link></p>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <GoogleLogin
                clientId="403380080270-6rpdj7ll4gkvlrvi4s03imtk3e487nuo.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseSuccess}
                onFailure={responseError}
                cookiePolicy={'single_host_origin'}
            />
            <p className="my-1">Don't have an account? <Link to="/register">Sign Up</Link></p>
            
        </Fragment>
    );
}

Login.prototypes={
    login:PropTypes.func.isRequired,
    loginwithgoogle:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated:state.auth.isAuthenticated,
    }
}


export default connect(mapStateToProps,{login,loginwithgoogle})(Login);