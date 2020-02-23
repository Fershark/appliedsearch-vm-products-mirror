import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {doSignOut} from '../actions/authenticate';

export default function Logout({history}) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    doSignOut(dispatch);
  }, [dispatch]);

  useEffect(() => {
    history.push('/');
  }, [user, history]);

  return null;
}
