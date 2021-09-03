import React, { ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Header, Label, Loader, Container, Segment} from "semantic-ui-react";
import { Digest, ToggleButton } from "../utility";
import { getCustomersList } from "../viewHelper/action";
import DataTable from "./customerListTable";

interface CityState {
    City: string,
    State: string
}

const getCityState = (address: string) : CityState => {
    let splitted = address.split(",");
    let cityAndState = {
        City: "",
        State: ""
    }
    cityAndState.City = splitted && splitted.length > 3 ? splitted[splitted.length - 3]: "";
    cityAndState.State = splitted && splitted.length > 2 ? splitted[splitted.length - 2]: "";
    return cityAndState;
}

const columns = [
    {
        Header: "Active",
        disableSortBy: true,
        id: "isActive",
        accessor: (row: any): ReactElement => <ToggleButton isActive={!!row?.isActive} customerId={row?._id}/>
    },
    {
        Header: "First, Last Name",
        id: "firstName",
        accessor: (row: any): string => row?.name?.first + " " + row?.name?.last
    },
    {
        Header: "Company",
        id: "Company",
        accessor: (row: any): string => row?.company
    },
    {
        Header: "City, State",
        id: "City",
        accessor: (row: any): string => {
            let cityAndState: CityState = getCityState(row?.address);
            return cityAndState.City + ", " + cityAndState.State;
        }
    },
    {
        Header: "Digetst Value",
        id: "digest",
        disableSortBy: true,
        accessor: (row: any) => {
            let firstLastName = row?.name?.first + row?.name?.last;
            return <Digest firstLastName={firstLastName} customerId={row?._id} />
        }
    }
]

export default function CustomersList(props: any) {
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
    }, [customerList]);

    const activeUsers = customerList?.reduce((totalCount: number, current: any, ): number => {
        if(current.isActive)
            return totalCount + 1;
        return totalCount;
    }, 0);
    
    if(!customerList)
        return <Loader size="massive"/>

    return (
        <Container fluid className="panel">
            <Grid style={{marginTop: "15px"}}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h1" style={{marginLeft: "10px"}}>
                            User Management <Label className="activeUserCount">{`[${activeUsers} active users]`}</Label>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column className="customerList"><DataTable columns={columns} data={customerList}/></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}