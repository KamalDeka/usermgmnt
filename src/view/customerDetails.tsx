import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueryParams } from "../utility";
import { getCustomersList } from "../viewHelper/action";
import _ from "lodash";


export default function CustomerDetails(props: any) {
    const customerList = useSelector((state: any): any => state?.customerList);
    const dispatch = useDispatch();
    const apiCalled = useRef(false);

    //call API if we land on this page directly.
    useEffect(()=>{
        if(!customerList && !apiCalled.current) {
            dispatch(getCustomersList());
            apiCalled.current = true;
        }
    });

    const queryParams = getQueryParams(props.location.search.substring(1));
    const customerData = _.find(customerList, (customerObj) => customerObj._id === queryParams?.id);
    return (
        <div>{JSON.stringify(customerData)}</div>
    )
}