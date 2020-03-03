import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {firebaseApp} from '../services';
import {AUTH_LOGOUT} from '../config/endpoints-conf';

export default function Logout({history}) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    firebaseApp.auth().signOut();
    dispatch({type: AUTH_LOGOUT, payload: null});
  }, [dispatch]);

  useEffect(() => {
    history.push('/');
  }, [user, history]);

  return null;
}
