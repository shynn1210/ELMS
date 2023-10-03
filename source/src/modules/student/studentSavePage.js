import React, { useEffect } from 'react';
import routes from './routes';
import useFetch from '@hooks/useFetch';
import { categoryKind } from '@constants';
import { STATUS_ACTIVE, UserTypes, DATE_FORMAT_VALUE, DEFAULT_TIME } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import StudentForm from './studentForm';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { formatDateString } from '@utils';
import moment from 'moment';
const message = defineMessages({
    objectName: 'student',
    home: 'Home',
    student: 'Student',
});

const StudentSavePage = () => {
    const translate = useTranslate();
    const { id } = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.student.getById,
            create: apiConfig.student.create,
            update: apiConfig.student.update,
        },
        options: {
            getListUrl: `/student`,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    status: STATUS_ACTIVE,
                    ...data,
                    birthday: data?.data?.birthday
                        ? moment(data?.data?.birthday, DATE_FORMAT_VALUE)
                        : moment(DEFAULT_TIME, DATE_FORMAT_VALUE),
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    avatarPath: data.avatar,
                    birthday: formatDateString(data.birthday, DATE_FORMAT_VALUE) + ' 00:00:00',
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });

    const {
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.getList, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: item.id, label: item.categoryName })),
    });
     
    // TODO:
    useEffect(() => {
        executeGetCategories({
            params: {
                kind: categoryKind.news,
            },
        });
    }, []);
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.student), path: routes.studentListPage.path },
                { breadcrumbName: title },
            ]}
        >
            <StudentForm
                categories={categories}
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default StudentSavePage;
