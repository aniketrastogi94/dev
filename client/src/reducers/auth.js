import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, DELETE_ACCOUNT,
    RESET_PASSWORD,
    NEW_PASSWORD,
    LOGINWITHGOOGLE
} from '../actions/types';

const intialState={
    token:localStorage.getItem('token'),
    isAuthenticated:null,
    loading:true,
    user:null
};

export default function(state=intialState,action){
    const {type,payload}=action;
    switch(type){
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
        case LOGINWITHGOOGLE:
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated:true,
                loading:false
            };
        case RESET_PASSWORD:
            return {
                ...state,
                ...payload,
                loading:false
            };
        case NEW_PASSWORD:
            return {
                ...state,
                ...payload,
                loading:false
            }
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return {
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false
            };
        default:
            return state;
    }
}