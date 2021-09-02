import { BrowserRouter, Route } from "react-router-dom";
import CustomerDetails from "./customerDetails";
import CustomersList from "./customersList";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Route path="/customers" component={CustomersList}/>
            <Route path="/customer" component={CustomerDetails}/>
        </BrowserRouter>
    )
}