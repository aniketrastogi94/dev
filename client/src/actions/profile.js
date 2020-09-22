import axios from 'axios';
import {setAlert} from './alert';
import {GET_REPOS,CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE,PROFILE_ERROR,UPDATE_PROFILE,GET_PROFILES} from './types';

export const getCurrentProfile=()=>async dispatch=>{
    try {
        const res=await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        console.error(err.message);
    }
}


export const createProfile=(formData,history,edit=false)=>async dispatch=>{
    try {
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        };
        const res=await axios.post('/api/profile',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created' ));

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {

        const errors=err.response.data.errors;
        if(errors) errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}
export const addExperience=(formdata,history)=>async dispatch=>{
    try {
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        };
        const res=axios.put('/api/profile/experience',formdata,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience added','success'));
        history.push('/dashboard');
    } catch (err) {
        const errors=err.response.data.errors;
        if(errors) errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const addEducation=(formdata,history)=>async dispatch=>{
    try {
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        };
        const res=axios.put('/api/profile/education',formdata,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Education added','success'));
        history.push('/dashboard');
    } catch (err) {
        const errors=err.response.data.errors;
        if(errors) errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}


export const deleteExperience=id=>async dispatch=>{
    try {
        const res=await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience removed','success'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const deleteEducation=id=>async dispatch=>{
    try {
        const res=await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Education removed','success'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const deleteAccount=()=>async dispatch=>{
    if(window.confirm('Are you sure? This cannot be undone')){
        try {
            await axios.delete('/api/profile');
            dispatch({
                type:CLEAR_PROFILE
            });
            dispatch({
                type:DELETE_ACCOUNT                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
            });
            dispatch(setAlert('Your account has been deleted','success'));
        } catch (err) {
            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            }); 
        }        
    }
}

//get all profiles
export const getProfiles=()=>async dispatch=>{
    dispatch({
        type:'CLEAR_PROFILE'
    });
    try {
        const res=await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//get profile by id
export const getProfileById=userId=>async dispatch=>{
    try {
        const res=await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:'PROFILE_ERROR',
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const getGithubRepos=(username)=>async dispatch=>{
    try {
        const res=await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:'PROFILE_ERROR',
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}