import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React, { useState } from 'react';
import { Link, generatePath, useParams, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { defineMessages, useIntl } from 'react-intl';

const message = defineMessages({
    objectName: 'subject',
    subjectName: 'Subject Name',
    subjectCode: 'Subject Code',
    status: 'Status',
    home: 'Home',
    subject: 'Subject',
});

function SubjectListPage() {
    const { restaurantId } = useParams();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const intl = useIntl();
    const navigate = useNavigate();
    const { subjectName } = useParams();
    const [isSubjectNameClicked, setIsSubjectNameClicked] = useState(false);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.subject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getItemDetailLink = (dataRow) => {
                return generatePath(routes.subjectSavePage.path, { restaurantId, id: dataRow.id });
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    deleteItem: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(dataRow._id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined />
                            </Button>
                        );
                    },
                };
            };

            
        },
    });

    const handleSubjectClick = (id) => {
        const pathToListLecture = generatePath(routes.lectureListPage.path + `?subjectId=${id}`);
        navigate(pathToListLecture);
    };
    const { sortedData, onDragEnd, sortColumn } = useDrapDropTableItem({
        data,
        apiConfig: apiConfig.subject.update,
        setTableLoading: () => {},
        indexField: 'rank',
        idField: 'subjectId',
    });

    const columns = [
        {
            title: translate.formatMessage(message.subjectName),
            dataIndex: 'subjectName',
            render: (subjectName, dataRow) => (
                <span
                    onClick={() => {
                        handleSubjectClick(dataRow.id);
                        setIsSubjectNameClicked(true);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'blue',
                    }}
                >
                    {subjectName}
                </span>
            ),
        },
        // {
        //     title: translate.formatMessage(message.subjectCode),
        //     dataIndex: 'subjectCode',
        // },
        {
            title: 'Created Date',
            width: 180,
            dataIndex: 'createdDate',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);
                return <Tag color={status?.color}>{status?.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, deleteItem: true }, { width: '90px' }),
    ];

    const searchFields = [
        {
            key: 'subjectName',
            placeholder: translate.formatMessage(message.objectName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                        onDragEnd={onDragEnd}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={sortedData}
                        columns={columns}
                        // rowKey={(record) => record._id}
                    />
                }
            />
        </PageWrapper>
    );
}

export default SubjectListPage;
