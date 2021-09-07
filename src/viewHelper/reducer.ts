import { ACTIONS } from "./contants";
import _ from "lodash";
import { getCustomerData, SortData } from "../utility";
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
            let custData = getCustomerData(newState.customerList, action.customerId);
            if(custData) {
                custData.digest = action.data?.Digest;
            }
            return newState;
        case ACTIONS.SET_PAGE_INDEX:
            newState.pageIndex = action.pageIndex;
            return newState;
        case ACTIONS.SET_PAGE_SIZE:
            newState.pageSize = action.pageSize;
            return newState;
        case ACTIONS.SORT_DATA:
            newState.customerList = SortData(newState.customerList, action.sortBy);
            return newState;
        case ACTIONS.CUSTOMER_DIGEST_FETCH_INITIATED:
            let data = getCustomerData(newState.customerList, action.customerId);
            if(data)
                data.digestFetchInitiated = true;
            return newState;
    };
    return state;
}