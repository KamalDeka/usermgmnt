import { ACTIONS } from "./contants";

let initialState = {};

interface Action {
    type: Symbol,
    data?: any,
    customerId?: string
};

export default function fetchReducer(state: any = initialState, action: Action = {type: Symbol()}): any{
    let newState = {...state}
    switch(action.type) {
        case ACTIONS.CUSTOMERS_LIST_FETCHED:
            newState.customerList = action.data;
            return newState;
    };
    return state;
}