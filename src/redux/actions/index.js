import { SET_AUTH_DETAILS } from "../types"

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