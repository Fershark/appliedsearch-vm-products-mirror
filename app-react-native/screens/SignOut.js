import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {firebaseApp} from '../services';
import {saveUser} from '../store/auth';

export default function SignOut() {
  const dispatch = useDispatch();

  useEffect(() => {
    firebaseApp.auth().signOut();
    dispatch(saveUser(null));
  }, [dispatch]);

  return null;
};
