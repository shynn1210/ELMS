import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';

const message = defineMessages({
    fullName: 'Full Name',
    birthday: 'Birth Day',
    university: 'University',
    mssv: 'MSSV',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
});

const StudentForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, categories, isEditing }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing && categories?.length > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
                categoryId: categories?.[0].value,
            });
        }
    }, [isEditing, categories]);
    console.log(categories);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="big">
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.fullName)} name="fullName" />
                    </Col>
                    <Col span={4}>
                        <DatePicker placeholder="Birth Day" name="birthday" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="University" />}
                            name="categoryId"
                            options={categories}
                        />
                    </Col>

                    <Col span={8}>
                        <TextField label={translate.formatMessage(message.mssv)} type="number" name="mssv" required />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.phone)} type="number" name="phone" required />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.email)} type="email" name="email" required />
                    </Col>
                    <Col span={12}>
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
