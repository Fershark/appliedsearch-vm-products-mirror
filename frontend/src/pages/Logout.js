import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {firebaseApp} from '../services';
import {saveUser} from '../store/auth';

export default function Logout({history}) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    firebaseApp.auth().signOut();
    dispatch(saveUser(null));
  }, [dispatch]);

  useEffect(() => {
    history.push('/');
  }, [user, history]);

  return null;
}
