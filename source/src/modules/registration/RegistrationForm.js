import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import { internOptions, issuedCertifyOptions, stateOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import useTranslate from '@hooks/useTranslate';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
    image: 'Image',
    name: 'Name',
    state: 'State',
    isIntern: 'Register for internship',
    isIissuedCertify: 'Certificate',
    studentId: 'Student',
});

const RegistrationForm = (props) => {
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, students } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const translate = useTranslate();
    //const statusValues = translate.formatKeys(statusOptions, ['label']);

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
            studentId: dataDetail?.student?.id,
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
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Student Name" />}
                            name="studentId"
                            options={students}
                        />
                    </Col>
                    <Col span={6}>
                        <SelectField
                            name="isIntern"
                            label={translate.formatMessage(messages.isIntern)}
                            allowClear={false}
                            options={internOptions}
                        />
                    </Col>
                    <Col span={6}>
                        <SelectField
                            name="isIssuedCertify"
                            label={translate.formatMessage(messages.isIissuedCertify)}
                            allowClear={false}
                            options={issuedCertifyOptions}
                        />
                    </Col>
                    <Col span={6}>
                        <SelectField
                            name="state"
                            label={translate.formatMessage(messages.state)}
                            allowClear={false}
                            options={stateOptions}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default RegistrationForm;
