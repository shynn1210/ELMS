import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import SubjectForm from './subjectForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'subject',
    home: 'Home',
    subject: 'Subject',
});

function SubjectSavePage() {
    const { restaurantId } = useParams();
    const translate = useTranslate();

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.subject.getById,
            create: apiConfig.subject.create,
            update: apiConfig.subject.update,
        },
        options: {
            getListUrl: generatePath(routes.subjectListPage.path),
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
                    subjectKind: 1,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.subject) },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <SubjectForm
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

export default SubjectSavePage;
