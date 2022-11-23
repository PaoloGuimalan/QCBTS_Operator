import { createStore, combineReducers } from 'redux'
import { setauthdetails, setcompanydetails, setconversations } from '../actions';

const combiner = combineReducers({
    authdetails: setauthdetails,
    companydetails: setcompanydetails,
    conversations: setconversations
});

const store = createStore(combiner);

export default store;