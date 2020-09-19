import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE
} from '../actions/types';

const intialState={
    profile:null,
    profiles:[],
    repos:[],
    loading:true,
    error:{}
};

export default function(state=intialState,action){
    const {type,payload}=action;
    switch(type){
        case GET_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error:payload,
                loading:false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                laoding:false
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            }
        default:
            return state;
    }
}