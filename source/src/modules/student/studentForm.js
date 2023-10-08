import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import apiConfig from '@constants/apiConfig';

const message = defineMessages({
    fullName: 'Full Name',
    birthday: 'Birth Day',
    university: 'University',
    mssv: 'MSSV',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
    studyClass: 'Study Class',
    universityId: 'University',
    studyClassId: 'Study Class',
});

const StudentForm = ({
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    universities,
    isEditing,
    studyClasses,
}) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setIsChangedFormValues(true);
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
            universityId: dataDetail?.university?.id,
            studyClassId: dataDetail?.studyClass?.id,
        });
        console.log(dataDetail);
    }, [dataDetail]);
    
    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="big">
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.fullName)} name="fullName" required />
                    </Col>
                    <Col span={4}>
                        <DatePicker placeholder="Birth Day" name="birthday" />
                    </Col>
                    <Col span={8}>
                        <TextField label={translate.formatMessage(message.phone)} type="number" name="phone" required />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Study Class" />}
                            name="studyClassId"
                            allowClear={false}
                            options={studyClasses}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="University" />}
                            name="universityId"
                            allowClear={false}
                            options={universities}
                        />
                    </Col>
                    <Col span={6}>
                        <TextField label={translate.formatMessage(message.mssv)} type="number" name="mssv" required />
                    </Col>
                    <Col span={11}>
                        <TextField label={translate.formatMessage(message.email)} type="email" name="email" required />
                    </Col>
                    <Col span={7}>
                        <TextField
                            label={translate.formatMessage(message.password)}
                            type="password"
                            name="password"
                            required
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default StudentForm;
