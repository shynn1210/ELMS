import { createAction } from '@store/utils';

export const showAppLoading = createAction('app/SHOW_LOADING');
export const hideAppLoading = createAction('app/HIDE_LOADING');
export const toggleActionLoading = createAction('app/ACTION_LOADING');
export const changeLanguage = createAction('app/CHANGE_LANGUAGE');
export const uploadFile = createAction('app/UPLOAD_FILE');
export const setRestaurantTenantId = createAction('app/SET_RESTAURANT_TENANT_ID');
export const getRestaurantListByCustomer = createAction('app/GET_RESTAURANT_LIST_BY_CUSTOMER');

export const actions = {
    showAppLoading,
    hideAppLoading,
    toggleActionLoading,
    changeLanguage,
    uploadFile,
    setRestaurantTenantId,
    getRestaurantListByCustomer,
};
