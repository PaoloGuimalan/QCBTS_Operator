import { createStore, combineReducers } from 'redux'
import { setauthdetails, setbusstopslist, setcompanydetails, setconversations, setmessages } from '../actions';

const combiner = combineReducers({
    authdetails: setauthdetails,
    companydetails: setcompanydetails,
    conversations: setconversations,
    messages: setmessages,
    busstopslist: setbusstopslist
});

const store = createStore(combiner);

export default store;