import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutes from '@modules/category/routes';
import studentRoutes from '@modules/student/routes';
import leaderRoutes from '@modules/leader/routes';
import courseRoutes from '@modules/course/routes';
import subjectRoutes from '@modules/subject/routes';
import lectureRoutes from '@modules/lecture/routes';
import registrationRoutes from '@modules/registration/routes';
import Dashboard from '@modules/dashboard';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    settingPage: {
        path: '/setting',
        component: Dashboard,
        auth: true,
        title: 'Setting',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    ...categoryRoutes,
    ...studentRoutes,
    ...leaderRoutes, 
    ...subjectRoutes,
    ...courseRoutes,
    ...lectureRoutes,
    ...registrationRoutes,
    // keep this at last
    
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
