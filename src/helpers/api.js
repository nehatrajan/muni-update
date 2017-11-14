import axios from 'axios';
const basePath = 'http://webservices.nextbus.com/service/publicJSONFeed'
export const getMuniRouteConfig = () => {
  const queryParam = {
    command: 'routeConfig',
    a: 'sf-muni',
    t: new Date().valueOf() - 90000
  };
  return axios.get(basePath, { params: queryParam });
}

export const getMuniBusData = (route) => {
  const queryParamInside= {
    command: 'vehicleLocations',
    a: 'sf-muni',
    t: new Date().valueOf() - 90000,
    r: route
  }
  return axios.get(basePath, { params: queryParamInside });
}

