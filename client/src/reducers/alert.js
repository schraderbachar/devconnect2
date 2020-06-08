import {SET_ALERT, REMOVE_ALERT} from '../actions/types'
const initialState = [
    
]

export default function(state = initialState, action){
    const {type,payload} =action
    switch(type){
        case SET_ALERT:
            //adds new alert to the array and the payload has the alert obj- msg- type etc
            return [...state, payload]
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}