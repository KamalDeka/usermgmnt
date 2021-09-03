import { BrowserRouter, Redirect, Route } from "react-router-dom";
import CustomerDetails from "./customerDetails";
import CustomersList from "./customersList";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Route exact path="/">
                <Redirect push={false} to="/customers"/>
            </Route>
            <Route exact path="/customers" component={CustomersList}/>
            <Route path="/customer" component={CustomerDetails}/>
        </BrowserRouter>
    )
}