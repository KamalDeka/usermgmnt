import { type } from "os";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Header, Image, Label, Segment, Tab, Table, TableCell } from "semantic-ui-react";
import { CustomerData, getCustomerData, getQueryParams, ToggleButton } from "../utility";
import { getCustomersList } from "../viewHelper/action";


function CustomerDetailsTable({ data }: { data: any }) {
    const keysToIgnore = ["isActive", "picture", "_id", "index", "guid", "name", "email"]
    let customerDetailsRows = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (keysToIgnore.includes(key))
                continue;
            if(key === "friends") {
                let listOfFriends = data[key].map((friend: { name: any; }) => friend.name);
                customerDetailsRows.push(<Table.Row>
                    <Table.Cell>{key.toUpperCase()}</Table.Cell>
                    <Table.Cell>{listOfFriends.join(", ")}</Table.Cell>
                </Table.Row>)
                continue;
            }
            if (typeof data[key] === "string" || typeof data[key] === "number") {
                let tableRow = <Table.Row key={key}>
                    <Table.Cell>{key.toUpperCase()}</Table.Cell>
                    <Table.Cell>{data[key]}</Table.Cell>
                </Table.Row>
                customerDetailsRows.push(tableRow)
            } else if (Array.isArray(data[key])) {
                let cellContent = undefined;
                if (typeof data[key][0] === "string" || typeof data[key][0] === "number")
                    cellContent = data[key].join(",");
                else
                    cellContent = <CustomerDetailsTable data={data[key]} />
                customerDetailsRows.push(<Table.Row>
                    <Table.Cell>{key.toUpperCase()}</Table.Cell>
                    <Table.Cell>{cellContent}</Table.Cell>
                </Table.Row>);
            } else {
                let tableRow = <Table.Row key={key}>
                    <Table.Cell>{key}</Table.Cell>
                    <Table.Cell><CustomerDetailsTable data={data[key]} /></Table.Cell>
                </Table.Row>
                customerDetailsRows.push(tableRow);
            }
        }
    }
    return (<Table celled striped>
        <Table.Body>
            {customerDetailsRows}
        </Table.Body>
    </Table>)
}

export default function CustomerDetails(props: any) {
    const customerList = useSelector((state: any): any => state?.customerList);
    const dispatch = useDispatch();
    const apiCalled = useRef(false);


    useEffect(() => {
        if (!customerList && !apiCalled.current) {
            //call API if we land on this page directly.
            dispatch(getCustomersList());
            apiCalled.current = true;
        }
    }, [customerList]);

    const queryParams = getQueryParams(props.location.search.substring(1));
    const customerData: CustomerData | undefined = getCustomerData(customerList, queryParams?.id);

    return (
        <Container fluid>
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column style={{textAlign:"right"}} width={2}>
                            <Image src={customerData?.picture} size="small" />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header as="h1">
                                {`${customerData?.name?.first} ${customerData?.name?.last} `}
                            </Header>
                            <Label>{customerData?.email}</Label>
                            <br/>
                            Active:<ToggleButton customerId={customerData?._id} isActive={!!customerData?.isActive} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                        <Grid.Column>
                            <CustomerDetailsTable data={customerData} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Container>
    )
}