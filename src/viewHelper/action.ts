import { ACTIONS } from "./contants";
import axios, { AxiosResponse } from "axios";

export function getCustomersList(): (dispatch: (x:any) => void) => void {
    return (dispatch: (x:any)=> void ): void => {
        axios.get("https://run.mocky.io/v3/93a7ac54-14e7-43a0-8a8d-8e3821cf74d0/customers")
            .then((response: AxiosResponse)=>{
                dispatch({
                    type: ACTIONS.CUSTOMERS_LIST_FETCHED,
                    data: response.data
                })
            }).catch((err)=>{

            });
    }
}

export function getDigestValue(firstLastName: string, customerId: string): (dispatch: (x:any)=>void) => void {
    return (dispatch: (x:any) => void): void => {

        dispatch({type: ACTIONS.CUSTOMER_DIGEST_FETCH_INITIATED, customerId: customerId});

        let params = {
            value: firstLastName
        }
        axios.get("https://api.hashify.net/hash/md4/hex", {params: params})
            .then((response: AxiosResponse)=>{
                dispatch({
                    type: ACTIONS.CUSTOMER_DIGEST_FETCHED,
                    data: response.data,
                    customerId: customerId
                })
            })
    }
}