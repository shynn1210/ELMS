import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect, useState } from 'react';
import useFetch from '@hooks/useFetch';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import CourseForm from './courseForm';

const messages = defineMessages({
    objectName: 'course',
    home: 'Home',
    course: 'Course',
});

function CourseSavePage() {
    const { id } = useParams();
    const translate = useTranslate();

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.create,
            update: apiConfig.course.update,
        },
        options: {
            getListUrl: generatePath(routes.courseListPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });

    const {
        data: subjects,
        loading: getsubjectsLoading,
        execute: executeGetsubjects,
    } = useFetch(apiConfig.subject.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.subjectName })),
    });
    const {
        data: leaders,
        loading: getleadersLoading,
        execute: executeGetleaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });

    useEffect(() => {
        executeGetsubjects({
            params: {
            },
        });
    }, []);
    useEffect(() => {
        executeGetleaders({
            params: {
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.course),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseForm
                subjects={subjects}
                leaders={leaders}
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default CourseSavePage;
