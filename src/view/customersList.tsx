import React, { ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Header, Checkbox, Label, Loader, Container} from "semantic-ui-react";
import { ToggleButton } from "../utility";
import { getCustomersList } from "../viewHelper/action";
import { ACTIONS } from "../viewHelper/contants";
import DataTable from "./customerListTable";

const getCity = (address: string) : string => {
    let splitted = address.split(",");
    return splitted && splitted.length > 3 ? splitted[splitted.length - 3]: ""
}

const getState = (address: string) : string => {
    let splitted = address.split(",");
    return splitted && splitted.length > 2 ? splitted[splitted.length - 2]: ""
}

const columns = [
    {
        Header: "",
        disableSortBy: true,
        id: "isActive",
        accessor: (row: any): ReactElement => <ToggleButton isActive={!!row?.isActive} customerId={row?._id}/>
    },
    {
        Header: "First Name",
        id: "firstName",
        accessor: (row: any): string => row?.name?.first
    },
    {
        Header: "Last Name",
        id: "lastName",
        accessor: (row: any): string => row?.name?.last
    },
    {
        Header: "Company",
        id: "Company",
        accessor: (row: any): string => row?.company
    },
    {
        Header: "City",
        id: "City",
        accessor: (row: any): string => getCity(row?.address)
    },
    {
        Header: "State",
        id: "State",
        accessor: (row: any): string => getState(row?.address)
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
    })

    const activeUsers = customerList?.reduce((totalCount: number, current: any, ): number => {
        if(current.isActive)
            return totalCount + 1;
        return totalCount;
    }, 0);
    
    if(!customerList)
        return <Loader size="massive"/>

    return (
        <Container fluid>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h1">
                            User Management <Label>{`[${activeUsers} active users]`}</Label>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column><DataTable columns={columns} data={customerList}/></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}