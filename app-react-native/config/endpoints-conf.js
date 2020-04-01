import {REACT_APP_ROOT_ENDPOINT_URL, REACT_APP_ROOT_ENDPOINT_URL_ANDROID} from 'react-native-dotenv';
import {Platform} from 'react-native';

// Endpoints
let API_ROOT_URL = '';
if (Platform.OS === 'android' && REACT_APP_ROOT_ENDPOINT_URL_ANDROID) {
  API_ROOT_URL = REACT_APP_ROOT_ENDPOINT_URL_ANDROID;
} else if (REACT_APP_ROOT_ENDPOINT_URL) {
  API_ROOT_URL = REACT_APP_ROOT_ENDPOINT_URL;
}

export const API_CREATE_USER = API_ROOT_URL + '/api/users/create';
export const API_GET_USER = API_ROOT_URL + '/api/users/';
export const API_GET_VMS_DISTRIBUTIONS = API_ROOT_URL + '/api/vms/distributions/';
export const API_GET_VMS_SIZES = API_ROOT_URL + '/api/vms/sizes/';
export const API_GET_VMS_REGIONS = API_ROOT_URL + '/api/vms/regions/';
export const API_CREATE_VM = API_ROOT_URL + '/api/vms/';
export const API_GET_VMS = API_ROOT_URL + '/api/vms/';
export const API_DELETE_VM = API_ROOT_URL + '/api/vms/';
export const API_GET_PRODUCTS = API_ROOT_URL + '/api/products';
