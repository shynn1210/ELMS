import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'Student',
    fullName: 'Full Name',
    birthday: 'Birthday',
    mssv: 'MSSV',
    phone: 'Phone',
    email: 'Email',
    home: 'Home',
    student: 'Student',
});

const StudentListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.student,
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
            title: translate.formatMessage(message.fullName),
            dataIndex: 'fullName',
        },
        {
            title: translate.formatMessage(message.birthday),
            dataIndex: 'birthday',
        },
        {
            title: translate.formatMessage(message.mssv),
            dataIndex: 'mssv',
        },
        {
            title: translate.formatMessage(message.phone),
            dataIndex: 'phone',
        },
        {
            title: translate.formatMessage(message.email),
            dataIndex: 'email',
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
    ];
    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(message.fullName),
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.student) },
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
export default StudentListPage;
