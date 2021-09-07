import { useHistory } from "react-router-dom";
import { Button, Grid, Header, Image, Label, Segment, Table } from "semantic-ui-react";
import { CustomerData } from "../interfaces";
import { getCustomerData, getQueryParams, PageLoaderWrapper, ToggleButton, useCustomerList } from "../utility";


function CustomerDetailsTable({ data }: { data: any }) {
    const keysToIgnore = ["isActive", "picture", "_id", "index", "guid", "name", "email", "digestFetchInitiated", "digest"]
    let customerDetailsRows = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (keysToIgnore.includes(key))
                continue;
            let content:any = "";
            if(key === "friends") {
                let listOfFriends = data[key].map((friend: { name: any; }) => friend.name);
                content = listOfFriends.join(", ");
                continue;
            }
            if (typeof data[key] === "string" || typeof data[key] === "number") {
                content = data[key];
            } else if (Array.isArray(data[key])) {
                if (typeof data[key][0] === "string" || typeof data[key][0] === "number")
                    content = data[key].join(",");
                else
                    content = <CustomerDetailsTable data={data[key]} />
            } else {
                content = <CustomerDetailsTable data={data[key]} />
            }

            customerDetailsRows.push(<Table.Row key={key}>
                <Table.Cell>{key.toUpperCase()}</Table.Cell>
                <Table.Cell>{content}</Table.Cell>
            </Table.Row>);
        }
    }
    return (<Table celled striped>
        <Table.Body>
            {customerDetailsRows}
        </Table.Body>
    </Table>)
}

export default function CustomerDetails(props: any) {
    const customerList = useCustomerList();
    const history = useHistory();

    const queryParams = getQueryParams(props.location.search.substring(1));
    const customerData: CustomerData | undefined = getCustomerData(customerList, queryParams?.id);
    const goBack = () => {
        history.goBack();
    }

    return (
        <PageLoaderWrapper verification={customerList}>
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column style={{textAlign:"right"}} width={2}>
                            <Image src={customerData?.picture} size="medium" bordered/>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Header as="h1" style={{marginBottom: "0", marginTop: "5px"}}>
                                {`${customerData?.name?.first} ${customerData?.name?.last} `}
                            </Header>
                            <Label style={{marginTop: "5px", marginBottom: "10px"}}>{customerData?.email}</Label>
                            <br/>
                            <ToggleButton customerId={customerData?._id} isActive={!!customerData?.isActive} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                        <Grid.Column>
                            <CustomerDetailsTable data={customerData} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button content="Back" primary onClick={goBack}></Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </PageLoaderWrapper>
    )
}