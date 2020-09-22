import axios from 'axios';
import {setAlert} from './alert';
import {ADD_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES,ADD_COMMENT,REMOVE_COMMENT} from './types';


//get posts

export const getPosts=()=>async dispatch=>{
    try {
        const res=await axios.get('/api/posts');
        dispatch({
            type:GET_POSTS,
            payload:res.data
        });

    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
};
export const addLike=postId=>async dispatch=>{
    try {
        const res=axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId,likes:res.data}
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}
export const removeLike=postId=>async dispatch=>{
    try {
        const res=axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId,likes:res.data}
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const deletePost=id=>async dispatch=>{
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({
            type:DELETE_POST,
            payload:id
        });
        dispatch(setAlert('Post removed','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const addPost=formdata=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    };
    try {  
        const res=await axios.post('/api/posts',formdata,config);
        dispatch({
            type:ADD_POST,
            payload:res.data
        });
        dispatch(setAlert('Post created','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const getPost=(id)=>async dispatch=>{
    try {
        const res=await axios.get(`/api/posts/${id}`);
        dispatch({
            type:GET_POST,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const addComment=(postId,formdata)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    };
    try {
        const res=await axios.post(`/api/posts/comment/${postId}`,formdata,config);
        dispatch({
            type:ADD_COMMENT,
            payload:res.data
        });
        dispatch(setAlert('Comment Added','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

export const deleteComment=(postId,commentId)=>async dispatch=>{
    
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type:REMOVE_COMMENT,
            payload:commentId
        });
        dispatch(setAlert('Comment Deleted','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}