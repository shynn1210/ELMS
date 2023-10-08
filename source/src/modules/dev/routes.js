import apiConfig from '@constants/apiConfig';
import LeaderListPage from '.';
import LeaderSavePage from './leaderSavePage';

export default {
    leaderListPage: {
        path: '/leader',
        title: 'Leader',
        auth: true,
        component: LeaderListPage,
        // permissions: apiConfig.student.getById.baseURL,
    },
    leaderSavePage: {
        path: '/leader/:id',
        title: 'Leader Save Page',
        auth: true,
        component: LeaderSavePage,
        // permissions: [ apiConfig.category.getById.baseURL ],
    },
};
