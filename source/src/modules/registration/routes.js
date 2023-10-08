import apiConfig from '@constants/apiConfig';
import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';
export default {
    registrationListPage: {
        path: '/course/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    registrationSavePage: {
        path: '/course/registration/:id',
        title: 'Registration Page',
        auth: true,
        component: RegistrationSavePage,
        permissions: [apiConfig.registration.getById.baseURL],
    },
};
