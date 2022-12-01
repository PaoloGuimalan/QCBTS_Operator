import { createStore, combineReducers } from 'redux'
import { setauthdetails, setbusstopslist, setcompanydetails, setconversations, setmapmode, setmessages, setroutemakerlist, setroutepath, setroutestatusloader, setselectedmarker } from '../actions';

const combiner = combineReducers({
    authdetails: setauthdetails,
    companydetails: setcompanydetails,
    conversations: setconversations,
    messages: setmessages,
    busstopslist: setbusstopslist,
    mapmode: setmapmode,
    selectedmarker: setselectedmarker,
    routemakerlist: setroutemakerlist,
    routepath: setroutepath,
    routestatusloader: setroutestatusloader
});

const store = createStore(combiner);

export default store;