import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import { lectureKind } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import useTranslate from '@hooks/useTranslate';
import { lectureOptions } from '@constants/masterData';
import { FormattedMessage, defineMessages } from 'react-intl';
const messages = defineMessages({
    lectureKind: 'Kind',
});
const LectureForm = (props) => {
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            kind: lectureKind,
        });
    }, [dataDetail]);

    return (
        <Form
            style={{ width: '70%' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Lecture Name" />}
                            name="lectureName"
                        />
                    </Col>
                    
                    <Col span={12}>
                        <SelectField
                            name="lectureKind"
                            label={translate.formatMessage(messages.lectureKind)}
                            allowClear={false}
                            options={lectureOptions}
                        />
                    </Col>
                    {/* <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Kind" />} name="lectureKind" />
                    </Col> */}
                    <Col span={24}>
                        <TextField required label={<FormattedMessage defaultMessage="Document" />} name="urlDocument" />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Description" />}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default LectureForm;
