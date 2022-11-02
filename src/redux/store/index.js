import { createStore, combineReducers } from 'redux'
import { setauthdetails, setcompanydetails } from '../actions';

const combiner = combineReducers({
    authdetails: setauthdetails,
    companydetails: setcompanydetails
});

const store = createStore(combiner);

export default store;