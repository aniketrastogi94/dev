import React,{Fragment,useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {reset} from '../../actions/auth';
const Reset=({reset,isAuthenticated})=>{
    const [formData,setFormData]=useState({
        email:''
    });

    const {email}=formData;

    const onChange=e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const onSubmit=e=>{
        e.preventDefault();
        reset(email);
    }
    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Reset Password</h1>
            <p className="lead"><i className="fas fa-user"></i>Enter your Email address</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email"
                        value={email}
                        onChange={e=>onChange(e)} 
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
            <p className="my-1">Don't have an account? <Link to="/register">Sign Up</Link></p>
        </Fragment>
    );
}

Reset.prototypes={
    reset:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated:state.auth.isAuthenticated,
    }
}


export default connect(mapStateToProps,{reset})(Reset);