import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Container, Loader } from "semantic-ui-react";
import { ACTIONS } from "./viewHelper/contants";
import _ from "lodash";
import { ReactElement, useEffect, useRef } from "react";
import { getCustomersList, getDigestValue } from "./viewHelper/action";
import { CityState, CustomerData, queryParams, sortinfo } from "./interfaces";


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
	let customerList = useSelector((state: any) => state?.customerList);

	useEffect(()=>{
		let customerData = getCustomerData(customerList, customerId);
		if(!customerData?.digest && !customerData?.digestFetchInitiated) {
			dispatch(getDigestValue(firstLastName, customerId));
		}
	}, [customerList, customerId, firstLastName, dispatch]);

	const customerData = getCustomerData(customerList, customerId);

	if(!customerData?.digest) {
		return <Loader size="small" active inline />
	}

	let disabledClass = customerData?.isActive ? "": "disabledPage";

	return <span className={disabledClass}>{customerData?.digest}</span>
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

export const SortData = (customerList: Array<CustomerData>, sortBy: Array<sortinfo> | undefined) => {
	if(sortBy && sortBy.length > 0 ) {
		let sortId = sortBy[0].id,	
			desc = sortBy[0].desc;
		return customerList.sort((rowA: CustomerData, rowB: CustomerData) : number => {
			let rowASmaller: boolean = true;
			if(sortId === "firstName") {
				rowASmaller = `${rowA?.name?.first} ${rowA?.name?.last}` < `${rowB?.name?.first} ${rowB?.name?.last}`;
			} else if(sortId === "company") {
				rowASmaller = rowA.company < rowB.company;
			} else if(sortId === "city") {
				let cityAndState: CityState = getCityState(rowA?.address);
				let cityAndStateA = cityAndState.City + ", " + cityAndState.State;
				cityAndState = getCityState(rowB?.address);
				let cityAndStateB = cityAndState.City + ", " + cityAndState.State;
				rowASmaller = cityAndStateA < cityAndStateB;
			}

			if(rowASmaller) {
				return desc ? 1 : -1;
			} else {
				return desc ? -1 : 1;
			}

		});
	}
	return customerList;
}