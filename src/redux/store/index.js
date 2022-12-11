import { createStore, combineReducers } from 'redux'
import { setauthdetails, setbusstopinfo, setbusstopslist, setcompanydetails, setconversations, setmapmode, setmessages, setpublicroutelist, setroutelist, setroutemakerlist, setroutepath, setroutestatusloader, setsavedroutepath, setselectedmarker } from '../actions';

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
    savedroutepath: setsavedroutepath,
    publicroutelist: setpublicroutelist,
    busstopinfo: setbusstopinfo
});

const store = createStore(combiner);

export default store;