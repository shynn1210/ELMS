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
import useTranslate from '@hooks/useTranslate';
import { useParams, useNavigate, generatePath, useLocation } from 'react-router-dom';
import qs from 'query-string';

const message = defineMessages({
    objectName: 'lecture',
    name: 'lectureName',
    home: 'Home', 
    subject: 'Subject',
    lecture: 'Lecture',
});

const LectureListPage = ({ lectureKind }) => {
    const translate = useTranslate();
    const { execute: executeUpdateNewsPin, loading: updateNewsPinLoading } = useFetch(apiConfig.lecture.update);
    const navigate = useNavigate();
    const location = useLocation();
    const currentParams = qs.parse(location.search);
    const { subjectId } = currentParams;
    const { setQueryParams, serializeParams } = useQueryParams();
    const [isSubjectNameClicked, setIsSubjectNameClicked] = useState(false);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.lecture,
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
                setQueryParams(serializeParams({ ...filter, subjectId }));
            };

            funcs.handleFilterSearchChange = (values) => {
                mixinFuncs.changeFilter({ ...values, subjectId });
            };

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    kind: lectureKind,
                };
            };
            funcs.getItemDetailLink = (dataRow) => {
                const path = generatePath(routes.lectureSavePage.path, { id: dataRow.id });
                return `${path}?subjectId=${currentParams.subjectId}`;
            };
            funcs.getCreateLink = () => {
                const path = generatePath(routes.lectureSavePage.path, { id: 'create' });
                return `${path}?subjectId=${currentParams.subjectId}`;
            };
        },
    });

    // const handleRowClick = (categoryId) => {
    //     const pathWithId = generatePath(routes.CategoryChildSavePage.path, { id: categoryId });
    //     navigate(pathWithId);
    // };

    const {
        execute: executeGetSubjects,
        data: subjects,
        loading: getSubjectLoading,
    } = useFetch(apiConfig.subject.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: String(item.id), label: item.subjectName })),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'lectureName',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            // width: 180,
            // align: 'center',
            // render: (dataRow) => (
            //     <Tag color="#108ee9">
            //         <div style={{ padding: '0 4px', fontSize: 14 }}>{dataRow}</div>
            //     </Tag>
            // ),
        },
        {
            title: 'Created Date',
            width: 180,
            dataIndex: 'createdDate',
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'lectureName',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject), path: routes.subjectListPage.path },
                { breadcrumbName: translate.formatMessage(message.lecture) },
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

export default LectureListPage;
