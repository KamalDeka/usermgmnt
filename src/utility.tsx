import { useDispatch } from "react-redux";
import { Checkbox } from "semantic-ui-react";
import { ACTIONS } from "./viewHelper/contants";

interface queryParams {
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


export const ToggleButton = ({isActive, customerId}: {isActive: boolean, customerId: string}) => {
    let dispatch = useDispatch();
    return <Checkbox toggle checked={isActive} onChange={()=>{
        dispatch({type: ACTIONS.CHANGE_ACTIVE_STATE, customerId: customerId})
    }}/>
}