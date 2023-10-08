import routes from '@routes';
import { IconCategory2 } from '@tabler/icons-react';
import React from 'react';
import { UserOutlined, FolderOpenOutlined, SettingOutlined } from '@ant-design/icons';
import { generatePath } from 'react-router-dom';
import { categoryKind } from './masterData';

const navMenuConfig = [
    {
        label: 'Account Management',
        key: 'account-management',
        icon: <UserOutlined size={16} />,
        children: [
            {
                label: 'Leader Management',
                key: 'department-leader',
                path: routes.leaderListPage.path,
                // permission: apiConfig.student.getList.baseURL,
            },
            {
                label: 'Student Management',
                key: 'department-student',
                path: routes.studentListPage.path,
                // permission: apiConfig.student.getList.baseURL,
            },
        ],
    },
    {
        label: 'Subject Management',
        key: 'subject-management',
        icon: <FolderOpenOutlined size={16} />,
        children: [
            {
                label: 'Subject',
                key: 'department-subject',
                path: routes.subjectListPage.path,
                // permission: apiConfig.student.getList.baseURL,
            },
            {
                label: 'Course',
                key: 'department-course',
                path: routes.courseListPage.path,
                // permission: apiConfig.student.getList.baseURL,
            },
        ],
    },
    {
        label: 'Setting',
        key: 'setting',
        icon: <SettingOutlined size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: categoryKind.service.title,
                key: 'department-category',
                path: generatePath(routes.categoryListPage.path, {
                    kind: categoryKind.service.value,
                }),
            },
        ],
    },
];

export default navMenuConfig;
