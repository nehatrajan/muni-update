import axios from 'axios';

const basePath = 'http://webservices.nextbus.com/service/publicJSONFeed'
export const getMuniRouteConfig = () => {
    const queryParam = {
        command: 'routeConfig',
        a: 'sf-muni',
        t: new Date().valueOf() - 90000
    };
    return axios.get(basePath, { params: queryParam });
};

export const getMuniBusData = (route) => {
    const queryParamInside = {
        command: 'vehicleLocations',
        a: 'sf-muni',
        t: new Date().valueOf() - 90000,
        r: route
    };
    return axios.get(basePath, { params: queryParamInside });
};

/**
 * could set up the basePath for the axios
 * not trasforming the data because it can be inconsistent where you dont pass in a query param and it
 * still returns a 200 with a different format
 */


