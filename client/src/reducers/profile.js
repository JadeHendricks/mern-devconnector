import { 
  GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from '../actions/types';

const intialState = {
 profile: null,
 profiles: [],
 repos: [],
 loading: true,
 error: {}
};

export default function(state = intialState, action) {
  switch(action.type) {
    case GET_PROFILE: 
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case PROFILE_ERROR: 
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    default: 
      return state;
  }
}