import { createStore, combineReducers } from 'redux'
import { setauthdetails, setbusstopslist, setcompanydetails, setconversations, setmapmode, setmessages, setroutelist, setroutemakerlist, setroutepath, setroutestatusloader, setsavedroutepath, setselectedmarker } from '../actions';

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
    routestatusloader: setroutestatusloader,
    routelist: setroutelist,
    savedroutepath: setsavedroutepath
});

const store = createStore(combiner);

export default store;