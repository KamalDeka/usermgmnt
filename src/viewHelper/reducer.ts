import { ACTIONS } from "./contants";
import _ from "lodash";
import { getCustomerData } from "../utility";
import { Action } from "../interfaces";

let initialState = {};

export default function fetchReducer(state: any = initialState, action: Action = {type: Symbol()}): any{
    let newState = _.cloneDeep(state);
    switch(action.type) {
        case ACTIONS.CUSTOMERS_LIST_FETCHED:
            newState.customerList = action.data;
            return newState;
        case ACTIONS.CHANGE_ACTIVE_STATE:
            let customerData = getCustomerData(newState.customerList, action.customerId);
            if(customerData)
                customerData.isActive = !customerData.isActive;
            return newState;
        case ACTIONS.CUSTOMER_DIGEST_FETCHED:
            newState.digest = newState.digest || {};
            if(action.customerId)
                newState.digest[action.customerId] = action.data;
            return newState;
        case ACTIONS.SET_PAGE_INDEX:
            newState.pageIndex = action.pageIndex;
            return newState;
        case ACTIONS.SET_PAGE_SIZE:
            newState.pageSize = action.pageSize;
            return newState;
    };
    return state;
}