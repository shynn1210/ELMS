import apiConfig from '@constants/apiConfig';
import LectureListPage from '.';
import LectureSavePage from './lectureSavePage';
export default {
    lectureListPage: {
        path: '/subject/lecture',
        title: 'Lecture',
        auth: true,
        component: LectureListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    lectureSavePage: {
        path: '/subject/lecture/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSavePage,
        permissions: [apiConfig.lecture.getById.baseURL],
    },
};
