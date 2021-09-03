import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Label, Loader } from "semantic-ui-react";
import { ACTIONS } from "./viewHelper/contants";
import _ from "lodash";
import { ReactElement, useEffect } from "react";
import { getDigestValue } from "./viewHelper/action";

export interface Name {
	first: string,
	last: string
}

export interface Friend {
	id: number,
	name: string
}

export interface CustomerData {
	isActive: boolean,
	_id: string,
    index: number,
    guid: string,
    balance: string,
    picture: string,
    age: number,
	eyeColor: string,
	name: Name,
	company: string,
    email: string,
    phone: string,
    address: string,
    about: string,
    registered: string,
    latitude: string,
	longitude: string,
	tags: Array<string>,
	range: Array<number>,
	friends: Array<Friend>,
    greeting: string,
    favoriteFruit: string
}
export interface queryParams {
    [x:string]: string
}
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

export const Digest = ({firstLastName, customerId} : { firstLastName: string, customerId: string}): ReactElement => {
	let dispatch = useDispatch();
	let digestData = useSelector((state: any) => state?.digest);

	useEffect(()=>{
		if(!digestData || !digestData[customerId]) {
			dispatch(getDigestValue(firstLastName, customerId));
		}
	}, [digestData, customerId, firstLastName]);

	if(!digestData || !digestData[customerId]) {
		return <Loader size="tiny" />
	}

	return <Label>{digestData[customerId]?.Digest}</Label>
}