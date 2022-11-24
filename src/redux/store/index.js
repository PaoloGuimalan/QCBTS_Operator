import { createStore, combineReducers } from 'redux'
import { setauthdetails, setcompanydetails, setconversations, setmessages } from '../actions';

const combiner = combineReducers({
    authdetails: setauthdetails,
    companydetails: setcompanydetails,
    conversations: setconversations,
    messages: setmessages
});

const store = createStore(combiner);

export default store;