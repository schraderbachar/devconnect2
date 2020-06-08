import { SET_ALERT,REMOVE_ALERT } from "./types";
import uuid from 'uuid'


export const setAlert = (msg,alertType) => dispatch => {
    //random universal id
    const id = uuid.v4()
    dispatch({
        type: SET_ALERT,
        payload: {msg,alertType,id}
    })
}