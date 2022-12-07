import { SET_AUTH_DETAILS, SET_BUS_STOPS_LIST, SET_COMPANY_DETAILS, SET_CONVERSATIONS, SET_MAP_MODE, SET_MESSAGES, SET_ROUTE_LIST, SET_ROUTE_MAKER_LIST, SET_ROUTE_PATH, SET_ROUTE_STATUS_LOADER, SET_SAVED_ROUTE_PATH, SET_SELECTED_MARKER } from "../types"

export const authDetailsState = {
    userID: "",
    fullname: "",
    email: "",
    status: null
}

export const setauthdetails = (state = authDetailsState, action) => {
    switch(action.type){
        case SET_AUTH_DETAILS:
            return action.authdetails;
        default:
            return state;
    }
}

export const companyDetailsState = {
    companyAddress: "",
    companyID: "",
    companyName: "...",
    companyNumber: "",
    dateRegistered: "",
    email: "",
    preview: "none"
}

export const setcompanydetails = (state = companyDetailsState, action) => {
    switch(action.type){
        case SET_COMPANY_DETAILS:
            return action.companydetails;
        default:
            return state;
    }
}

export const conversationsState = {
    conversations: [],
    profiles: []
}

export const setconversations = (state = conversationsState, action) => {
    switch(action.type){
        case SET_CONVERSATIONS:
            return action.conversations;
        default:
            return state;
    }
}

export const messagesState = {
    conversation: [],
    userDetails: {
        preview: "none",
        userDisplayName: "",
        userID: "",
        userType: ""
    }
}

export const setmessages = (state = messagesState, action) => {
    switch(action.type){
        case SET_MESSAGES:
            return action.messages;
        default:
            return state;
    }
}

export const setbusstopslist = (state = [], action) => {
    switch(action.type){
        case SET_BUS_STOPS_LIST:
            return action.busstopslist;
        default:
            return state;
    }
}

export const setmapmode = (state = "none", action) => {
    switch(action.type){
        case SET_MAP_MODE:
            return action.mapmode;
        default:
            return state;
    }
}

export const setselectedmarker = (state = null, action) => {
    switch(action.type){
        case SET_SELECTED_MARKER:
            return action.selectedmarker;
        default:
            return state;
    }
}

export const setroutemakerlist = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_MAKER_LIST:
            return action.routemakerlist;
        default:
            return state;
    }
}

export const setroutepath = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_PATH:
            return action.routepath;
        default:
            return state;
    }
}

export const routestatusloaderState = {
    loading: false,
    percent: 0,
}

export const setroutestatusloader = (state = routestatusloaderState, action) => {
    switch(action.type){
        case SET_ROUTE_STATUS_LOADER:
            return action.routestatusloader;
        default:
            return state;
    }
}

export const setroutelist = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_LIST:
            return action.routelist;
        default:
            return state;
    }
}

export const savedroutepathState = {
    routeID: null,
    routeName: null,
    stationList: [],
    routePath: [],
    status: null
}

export const setsavedroutepath = (state = savedroutepathState, action) => {
    switch(action.type){
        case SET_SAVED_ROUTE_PATH:
            return action.savedroutepath;
        default:
            return state;
    }
}