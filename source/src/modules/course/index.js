import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions, stateOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React, { useState } from 'react';
import { Link, generatePath, useParams, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages, useIntl } from 'react-intl';

const message = defineMessages({
    objectName: 'course',
    name: 'Course Name',
    subjectName: 'Subject Name',
    leader: 'Leader',
    createdDate: 'Created Date',
    dateEnd: 'Date End',
    state: 'State',
    home: 'Home',
    course: 'Course',
});

function CourseListPage() {
    const { courseId } = useParams();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    //const stateValues = stateOptions.map((option) => option.label);
    const intl = useIntl();
    const navigate = useNavigate();
    const { courseName } = useParams();
    const [isCourseNameClicked, setIsCourseNameClicked] = useState(false);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.course,
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
                return generatePath(routes.courseSavePage.path, { courseId, id: dataRow.id });
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
                    registrationItem: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    handleCourseClick(dataRow.id);
                                    setIsCourseNameClicked(true);
                                }}
                                style={{ padding: 0 }}
                            >
                                <TeamOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
    });
    const handleCourseClick = (id) => {
        const pathToListRegistration = generatePath(routes.registrationListPage.path + `?courseId=${id}`);
        navigate(pathToListRegistration);
    };
    const { sortedData, onDragEnd, sortColumn } = useDrapDropTableItem({
        data,
        apiConfig: apiConfig.course.update,
        setTableLoading: () => {},
        indexField: 'rank',
        idField: 'courseId',
    });

    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'name',
        },
        {
            title: 'Subject',
            dataIndex: ['subject', 'subjectName'],
        },
        {
            title: 'Leader',
            dataIndex: ['leader', 'leaderName'],
        },
        {
            title: 'Created Date',
            width: 180,
            dataIndex: 'createdDate',
        },
        {
            title: 'Date End',
            width: 180,
            dataIndex: 'dateEnd',
        },
        // {
        //     title: translate.formatMessage(message.status),
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: 100,
        //     render(dataRow) {
        //         const status = statusValues.find((item) => item.value == dataRow);

        //         return <Tag color={status.color}>{status.label}</Tag>;
        //     },
        // },

        {
            title: translate.formatMessage(message.state),
            dataIndex: 'state',
            align: 'center',
            width: 80,
            render(dataRow) {
                const state = stateOptions.find((item) => item.value == dataRow);
                return <Tag color={state?.color}>{state?.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ registrationItem: true, edit: true, deleteItem: true }, { width: '180px' }),
    ];

    const searchFields = [
        {
            key: 'Name',
            placeholder: translate.formatMessage(message.objectName),
        },
        // {
        //     key: 'status',
        //     placeholder: translate.formatMessage(message.state),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.course) },
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

export default CourseListPage;
