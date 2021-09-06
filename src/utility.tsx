import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Container, Loader } from "semantic-ui-react";
import { ACTIONS } from "./viewHelper/contants";
import _ from "lodash";
import { ReactElement, useEffect, useRef } from "react";
import { getCustomersList, getDigestValue } from "./viewHelper/action";
import { CityState, CustomerData, queryParams } from "./interfaces";


export function getQueryParams(queryString: string): queryParams {
    let allParams:queryParams = {},
		params = queryString.split("&");
	for (let i = 0; i < params.length; i++) {
        let pair = params[i].split("=");
		allParams[pair[0]] = decodeURIComponent(pair[1]);
	}
	return allParams;
}

export const ToggleButton = ({isActive, customerId}: {isActive: boolean, customerId: string | undefined}) => {
    let dispatch = useDispatch();
    return <Checkbox toggle checked={isActive} onChange={()=>{
        dispatch({type: ACTIONS.CHANGE_ACTIVE_STATE, customerId: customerId})
    }}/>
}

export const getCustomerData = (customerList: Array<CustomerData>, customerId: string | undefined): CustomerData | undefined => {
	let customerData: CustomerData | undefined = _.find(customerList, (customerObj) => customerObj._id === customerId);

	return customerData;
}

export const Digest = React.memo(({firstLastName, customerId} : { firstLastName: string, customerId: string}): ReactElement => {
	let dispatch = useDispatch();
	let digestData = useSelector((state: any) => state?.digest);
	let customerList = useSelector((state: any) => state?.customerList);
	let apiCalled = useRef(false);

	useEffect(()=>{
		if((!digestData || !digestData[customerId]) && !apiCalled.current) {
			dispatch(getDigestValue(firstLastName, customerId));
			apiCalled.current = true;
		}
	}, [digestData, customerId, firstLastName, dispatch]);

	if(!digestData || !digestData[customerId]) {
		return <Loader size="small" active inline />
	}

	const customerData = getCustomerData(customerList, customerId);

	let disabledClass = customerData?.isActive ? "": "disabledPage";

	return <span className={disabledClass}>{digestData[customerId]?.Digest}</span>
});

export const useCustomerList = () => {
	const customerList = useSelector((state: any): any => state?.customerList);
    const dispatch = useDispatch();
    const apiCalled = useRef(false);

    useEffect(()=>{
        if(!customerList && !apiCalled.current) {
            dispatch(getCustomersList());
            apiCalled.current = true;
        }
        return () => { //do nothing
        }
    }, [customerList, dispatch]);

	return customerList;
}

export const PageLoaderWrapper = ({verification, children}: {verification: any, children: ReactElement}) => {
	let content = children;
	
	if(!verification) {
		content = <Loader size="massive" active inline className="centerLoader" />;
	}
	
	return  <Container fluid className="panel height_100">{content}</Container>
}

export const getCityState = (address: string) : CityState => {
    let splitted = address.split(",");
    let cityAndState = {
        City: "",
        State: ""
    }
    cityAndState.City = splitted && splitted.length > 3 ? splitted[splitted.length - 3]: "";
    cityAndState.State = splitted && splitted.length > 2 ? splitted[splitted.length - 2]: "";
    return cityAndState;
}

export const getActiveUserCount = (customerList : Array<CustomerData>) => {
	const activeUsers = customerList?.reduce((totalCount: number, current: any, ): number => {
        if(current.isActive)
            return totalCount + 1;
        return totalCount;
    }, 0);

	return activeUsers;
}