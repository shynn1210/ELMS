import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import routes from '@routes';
import { lectureKind } from '@constants';
import LectureForm from './lectureForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useLocation } from 'react-router-dom';
import qs from 'query-string';

const message = defineMessages({
    objectName: 'lecture',
    home: 'Home',
    subject: 'Subject',
    lecture: 'Lecture',
});

const LectureSavePage = ({ getListUrl }) => {
    const translate = useTranslate();
    const location = useLocation();
    const currentParams = qs.parse(location.search);
    const { subjectId } = currentParams;

    const { getDetail, handleFetchDetail, detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } =
        useSaveBase({
            apiConfig: {
                getById: apiConfig.lecture.getById,
                create: apiConfig.lecture.create,
                update: apiConfig.lecture.update,
            },
            options: {
                getListUrl: generatePath(routes.lectureListPage.path),
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.prepareUpdateData = (data) => {
                    return {
                        ...data,
                        status: 1,
                        // getDetail: detail,
                        id: detail.id,
                        subjectId: subjectId,
                    };
                };
                funcs.prepareCreateData = (data) => {
                    return {
                        ...data,
                        kind: lectureKind,
                        ordering: 0,
                        subjectId: subjectId,
                    };
                };
            },
        });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject), path: routes.subjectListPage.path },
                { breadcrumbName: translate.formatMessage(message.lecture), path: routes.lectureListPage.path },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <LectureForm
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

export default LectureSavePage;
