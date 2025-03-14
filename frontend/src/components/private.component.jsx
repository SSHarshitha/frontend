import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App'; // Adjust the path based on your file structure

const PrivateRoute = ({ element }) => {
    const { userAuth } = useContext(UserContext);

    return userAuth && userAuth.access_token ? element : <Navigate to="/signin" />;
}

export default PrivateRoute;
