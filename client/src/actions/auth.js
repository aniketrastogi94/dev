import axios from 'axios';
import {setAlert} from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    RESET_PASSWORD,
    LOGOUT,
    CLEAR_PROFILE,
    NEW_PASSWORD,
    LOGINWITHGOOGLE
} from './types';
import setAuthToken from '../utilis/setAuthToken';


export const loadUser=()=>async dispatch=>{
    if(localStorage.token) setAuthToken(localStorage.token);
    try {
        const res=await axios.get('/api/auth');
        dispatch({
            type:USER_LOADED,
            payload:res.data
        });

    } catch (err) {
        dispatch({
            type:AUTH_ERROR
        });
    }
}

export const loginwithgoogle=(tokenID)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    };
    const body=JSON.stringify({tokenID});
    try{
        const res=await axios.post('/api/auth/loginwithgoogle',body,config);
        dispatch({
            type:LOGINWITHGOOGLE,
            payload:res.data
        });
        dispatch(loadUser());
    }catch(err){
        console.log(err.message);
    }
}

export const reset=(email)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    };
    const body=JSON.stringify({email});
    try {
        const res=await axios.post('/api/users/reset',body,config);
        console.log(res.data);
        dispatch({
            type:RESET_PASSWORD,
            payload:res.data
        });
        dispatch(setAlert('Please check your email','success'));
    } catch (err) {
        console.log(err.message);
    }
}

export const newPassword=(password,token)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    };
    const body=JSON.stringify({password,token});
    try{
        const res=await axios.post('/api/users/new-password',body,config);
        dispatch({
            type:NEW_PASSWORD,
            payload:res.data
        });
        dispatch(setAlert('Password changed,please go back to login','success'));
    }catch(err){
        console.log(err.message);
    }
}

export const register=({name,email,password})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body=JSON.stringify({name,email,password});
    try {
        const res=await axios.post('/api/users',body,config);
        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:REGISTER_FAIL
        });
        console.error(err.message);
    }
}


export const login=(email,password)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body=JSON.stringify({email,password});
    try {
        const res=await axios.post('/api/auth',body,config);
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors=err.response.data.errors;
        if(errors) errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        dispatch({
            type:LOGIN_FAIL
        });
        console.error(err.message);
    }
}

export const logout=()=>dispatch=>{
    dispatch({type:CLEAR_PROFILE});
    dispatch({type:LOGOUT});
}
