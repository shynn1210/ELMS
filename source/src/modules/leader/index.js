import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'Leader',
    leaderName: 'Leader Name',
    phone: 'Phone',
    email: 'Email',
    createdDate: 'Created date',
    home: 'Home',
    leader: 'Leader',
});

const LeaderListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.leader,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                console.log(response);
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });
    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(message.leaderName),
            dataIndex: 'leaderName',
        },
        {
            title: translate.formatMessage(message.phone),
            dataIndex: 'phone',
        },
        {
            title: translate.formatMessage(message.email),
            dataIndex: 'email',
        },
        {
            title: translate.formatMessage(message.createdDate),
            dataIndex: 'createdDate',
            width: '230px',
            // render: (createdDate) => convertUtcToTimezone(createdDate),
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
    ];
    const searchFields = [
        {
            key: 'leaderName',
            placeholder: translate.formatMessage(message.leaderName),
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.leader) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default LeaderListPage;
