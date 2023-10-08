import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import ListPage from '@components/common/layout/ListPage';
import { Avatar, Tag, Table, Typography } from 'antd';
import useListBase from '@hooks/useListBase';
import useQueryParams from '@hooks/useQueryParams';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import routes from '@routes';
import { statusOptions, stateOptions, internOptions, issuedCertifyOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { useParams, useNavigate, generatePath, useLocation } from 'react-router-dom';
import qs from 'query-string';

const message = defineMessages({
    objectName: 'registration',
    home: 'Home',
    course: 'Course',
    state: 'State',
    registration: 'Registration',
    name: 'Registration',
    isIntern: 'Register for internship',
    isIssuedCertify: 'Certificate',
});

const RegistrationListPage = () => {
    const translate = useTranslate();
    const { execute: executeUpdateNewsPin, loading: updateNewsPinLoading } = useFetch(apiConfig.registration.update);
    const navigate = useNavigate();
    const location = useLocation();
    const currentParams = qs.parse(location.search);
    const { courseId } = currentParams;
    const { setQueryParams, serializeParams } = useQueryParams();
    const [isCourseNameClicked, setIsCourseNameClicked] = useState(false);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.registration,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };

            funcs.changeFilter = (filter) => {
                setQueryParams(serializeParams({ ...filter, courseId }));
            };

            funcs.handleFilterSearchChange = (values) => {
                mixinFuncs.changeFilter({ ...values, courseId });
            };

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                };
            };
            funcs.getItemDetailLink = (dataRow) => {
                const path = generatePath(routes.registrationSavePage.path, { id: dataRow.id });
                return `${path}?courseId=${currentParams.courseId}`;
            };
            funcs.getCreateLink = () => {
                const path = generatePath(routes.registrationSavePage.path, { id: 'create' });
                return `${path}?courseId=${currentParams.courseId}`;
            };
        },
    });

    const {
        execute: executeGetCourses,
        data: course,
        loading: getCourseLoading,
    } = useFetch(apiConfig.course.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: String(item.id), label: item.courseName })),
    });

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentInfo', 'fullName'],
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule',
        },
        {
            title: translate.formatMessage(message.isIntern),
            dataIndex: 'isIntern',
            align: 'center',
            width: 80,
            render(dataRow) {
                const isIntern = internOptions.find((item) => item.value == dataRow);
                return <Tag>{isIntern?.label}</Tag>;
            },
        },

        {
            title: 'Created Date',
            width: 180,
            dataIndex: 'createdDate',
        },
        {
            title: translate.formatMessage(message.isIssuedCertify),
            dataIndex: 'isIssuedCertify',
            align: 'center',
            width: 180,
            render(dataRow) {
                const isIssuedCertify = issuedCertifyOptions.find((item) => item.value == dataRow);
                return <Tag color={isIssuedCertify?.color}>{isIssuedCertify?.label}</Tag>;
            },
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'studentName',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.course), path: routes.courseListPage.path },
                { breadcrumbName: translate.formatMessage(message.registration) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                        onChange={mixinFuncs.changePagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default RegistrationListPage;
