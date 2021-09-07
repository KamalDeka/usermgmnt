import React, { ReactElement, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Grid, Header, Label } from "semantic-ui-react";
import { CityState } from "../interfaces";
import { Digest, getActiveUserCount, getCityState, PageLoaderWrapper, ToggleButton, useCustomerList } from "../utility";
import { ACTIONS } from "../viewHelper/contants";
import DataTable from "./customerListTable";

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
        id: "company",
        accessor: (row: any): string => row?.company
    },
    {
        Header: "City, State",
        id: "city",
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

const CustomersList = React.memo(()=>{
    const customerList = useCustomerList();
    const activeUsers = getActiveUserCount(customerList);
    const dispatch = useDispatch();

    const handleSort = useCallback((sortBy: any) => {
        dispatch({type: ACTIONS.SORT_DATA, sortBy: sortBy});
    },[dispatch]);

    return (
        <PageLoaderWrapper verification={customerList}>
            <Grid style={{marginTop: "15px"}}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h1" style={{marginLeft: "10px"}}>
                            User Management <Label className="activeUserCount">{`[${activeUsers} active users]`}</Label>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column className="customerList">
                        <DataTable columns={columns} 
                            data={customerList} 
                            pageSizes={[10, 15, 30, 40, 50]} 
                            initialPageSize={15}
                            handleSort={handleSort}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLoaderWrapper>
    )
});

export default CustomersList;