// Endpoints
export const API_ROOT_URL = process.env.REACT_APP_ROOT_ENDPOINT_URL ? process.env.REACT_APP_ROOT_ENDPOINT_URL : "";
export const API_CREATE_USER = API_ROOT_URL + "/api/users/create";
export const API_GET_USER = API_ROOT_URL + "/api/users/";
export const API_GET_VMS_DISTRIBUTIONS = API_ROOT_URL + "/api/vms/distributions/";
export const API_GET_VMS_SIZES = API_ROOT_URL + "/api/vms/sizes/";
export const API_GET_VMS_REGIONS = API_ROOT_URL + "/api/vms/regions/";
export const API_CREATE_VM = API_ROOT_URL + "/api/vms/";
export const API_GET_VMS = API_ROOT_URL + "/api/vms/";
export const API_DELETE_VM = API_ROOT_URL + "/api/vms/";
export const API_GET_PRODUCTS = API_ROOT_URL + "/api/products";
export const API_CREATE_ACTION = API_ROOT_URL + "/api/actions";
