import axios from 'axios';
import {setAlert} from './alert';
import {GET_PROFILE,PROFILE_ERROR,UPDATE_PROFILE} from './types';

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