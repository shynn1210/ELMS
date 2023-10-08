import React, { useEffect } from 'react';
import routes from './routes';
import useFetch from '@hooks/useFetch';
import { categoryKind } from '@constants';
import { STATUS_ACTIVE, UserTypes, DATE_FORMAT_VALUE, DEFAULT_TIME } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { formatDateString } from '@utils';
import moment from 'moment';
import LeaderForm from './leaderForm';
const message = defineMessages({
    objectName: 'leader',
    home: 'Home',
    leader: 'Leader',
});

const LeaderSavePage = () => {
    const translate = useTranslate();
    const { id } = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.leader.getById,
            create: apiConfig.leader.create,
            update: apiConfig.leader.update,
        },
        options: {
            getListUrl: `/leader`,
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

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.leader), path: routes.leaderListPage.path },
                { breadcrumbName: title },
            ]}
        >
            <LeaderForm
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
export default LeaderSavePage;
