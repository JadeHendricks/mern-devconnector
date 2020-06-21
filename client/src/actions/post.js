import axios from 'axios';
import { setAlert } from './alert';

import { 
  GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST } from './types';


//Add post
export const addPost = formData => async dispatch => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }

    const res = await axios.post(`/api/post`, formData, config);
    
    dispatch({ 
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}

// Get post
export const getPost = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/post/${postId}`);
    dispatch({ 
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/post');
    dispatch({ 
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}

//Add like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/like/${postId}`);
    dispatch({ 
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}

//Remove like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/unlike/${postId}`);
    dispatch({ 
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}

//Delete post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/post/${postId}`);

    dispatch({ 
      type: DELETE_POST,
      payload: postId
    });
    dispatch(setAlert('Post Removed', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
}