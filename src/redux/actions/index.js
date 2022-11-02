import { SET_AUTH_DETAILS, SET_COMPANY_DETAILS } from "../types"

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