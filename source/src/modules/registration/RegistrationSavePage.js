import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect, useState } from 'react';
import routes from '@routes';
import RegistrationForm from './RegistrationForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useLocation } from 'react-router-dom';
import qs from 'query-string';
import useFetch from '@hooks/useFetch';

const message = defineMessages({
    objectName: 'registration',
    home: 'Home',
    course: 'Course',
    registration: 'Registration',
});

const RegistrationSavePage = ({ getListUrl }) => {
    const translate = useTranslate();
    const location = useLocation();
    const currentParams = qs.parse(location.search);
    const { courseId } = currentParams;

    const { getDetail, handleFetchDetail, detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } =
        useSaveBase({
            apiConfig: {
                getById: apiConfig.registration.getById,
                create: apiConfig.registration.create,
                update: apiConfig.registration.update,
            },
            options: {
                getListUrl: generatePath(routes.registrationListPage.path),
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.prepareUpdateData = (data) => {
                    return {
                        ...data,
                        status: 1,
                        // getDetail: detail,
                        id: detail.id,
                        courseId: courseId,
                    };
                };
                funcs.prepareCreateData = (data) => {
                    return {
                        ...data,
                        //kind: lectureKind,
                        ordering: 0,
                        courseId: courseId,
                    };
                };
            },
        });

    const {
        data: students,
        loading: getstudentsLoading,
        execute: executeGetstudents,
    } = useFetch(apiConfig.student.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.fullName })),
    });
    useEffect(() => {
        executeGetstudents({
            params: {},
        });
    }, []);
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.course), path: routes.courseListPage.path },
                {
                    breadcrumbName: translate.formatMessage(message.registration),
                    path: routes.registrationListPage.path,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <RegistrationForm
                students={students}
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default RegistrationSavePage;
