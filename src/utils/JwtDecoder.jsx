import {jwtDecode} from 'jwt-decode';

function isAdmin (token) {
    const decodedData = jwtDecode(token);
    return decodedData.user_name == "admin";
}

export default isAdmin;