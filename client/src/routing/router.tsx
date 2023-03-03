import {createBrowserRouter} from "react-router-dom";
import {Home} from "../pages/Home";
import {Clients} from "../pages/Clients";
import {Orders} from "../pages/Orders";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Clients/>
    },
    {
        path: '/orders',
        element: <Orders/>
    }
])

export default router