import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';
import useFetch from '@hooks/useFetch';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';  
import { defineMessages, FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import apiConfig from '@constants/apiConfig';

const message = defineMessages({
    leaderName: 'Leader Name',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
});

const LeaderForm = ({
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
}) => {
    const translate = useTranslate();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError, setImageUrl) => {
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
        return mixinFuncs.handleSubmit({
            ...values,
            avatar: avatarUrl,
            pinTop: Number(values.pinTop),
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setAvatarUrl(dataDetail.avatar);
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="big">
            <Card>
                <Row gutter={10}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="categoryImage"
                            imageUrl={avatarUrl && `${AppConstants.contentRootUrl}${avatarUrl}`}
                            aspect={1 / 1}
                            uploadFile={(...args) => uploadFile(...args, setAvatarUrl)}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.leaderName)} name="leaderName" required />
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

export default LeaderForm;
