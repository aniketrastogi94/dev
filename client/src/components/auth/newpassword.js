import React,{Fragment,useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newPassword} from '../../actions/auth';
import { Redirect } from 'react-router-dom';

const NewPassword=({newPassword,match})=>{
    const [formData,setFormData]=useState({
        password:'',
        confirmPassword:''
    });
    const newToken=match.params.token;
    const {password,confirmPassword}=formData;

    const onChange=e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const onSubmit=e=>{
        e.preventDefault();
        if(password===confirmPassword){
            newPassword(password,newToken);
            return <Redirect to='/login'/>
        }
        
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i>Login To Your Account</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e=>onChange(e)}
                        minLength="6"
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Reset" />
            </form>
        </Fragment>
    );
}

NewPassword.prototypes={
    newPassword:PropTypes.func.isRequired,
}




export default connect(null,{newPassword})(NewPassword);