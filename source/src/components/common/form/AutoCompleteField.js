import useFetch from '@hooks/useFetch';
import useFormField from '@hooks/useFormField';
import { Form, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SelectField from './SelectField';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

function AutoCompleteField({
    label,
    name,
    placeholder,
    rules,
    required,
    fromItemProps,
    allowClear,
    fieldProps,
    apiConfig,
    mappingOptions,
    initialSearchParams,
    searchParams,
    optionsParams = {},
    maxOptions = 5,
    debounceTime = 600,
    onChange,
    disabled,
}) {
    const { placeholder: _placeholder, rules: _rules } = useFormField({
        placeholder,
        rules,
        required,
    });
    const [fetching, setFetching] = useState(false);
    const [_options, setOptions] = useState();
    const { execute } = useFetch(apiConfig);
    const form = useFormInstance();
    const haveInitialValue = useRef(false);

    const handleFetchOptions = useCallback(
        ({ searchText, onCompleted, onError }) => {
            execute({
                params: {
                    size: maxOptions,
                    page: 0,
                    ...optionsParams,
                    ...(searchParams ? searchParams(searchText) : {}),
                },
                onCompleted: (res) => {
                    onCompleted(res.data?.content?.map(mappingOptions));
                },
                onError,
            });
        },
        [maxOptions, searchParams, mappingOptions, optionsParams],
    );

    const handleOnSearch = useMemo(() => {
        const onCompleted = (options) => {
            setFetching(false);
            if (options) {
                setOptions(options);
            }
        };

        const onError = () => {
            setFetching(false);
        };

        const loadOptions = (searchText) => {
            if (!searchText || !mappingOptions) return;
            setOptions([]);
            setFetching(true);
            handleFetchOptions({ searchText, onCompleted, onError });
        };

        return debounce(loadOptions, debounceTime);
    }, [handleFetchOptions, mappingOptions, debounceTime]);

    const getInitialOptions = useCallback(() => {
        execute({
            params: {
                page: 0,
                size: maxOptions,
                ...initialSearchParams,
                id: form?.getFieldValue(name),
            },
            onCompleted: (res) => {
                setOptions(res.data?.content?.map(mappingOptions) || []);
            },
        });
    }, [form?.getFieldValue(name)]);

    // form?.getFieldValue(name) don't get value immediately, we don't know when to get all or get one option
    // so first we get all options, if field have a value we get one option
    useEffect(() => {
        if (!form?.getFieldValue(name) || haveInitialValue.current) return;
        haveInitialValue.current = true;

        getInitialOptions();
    }, [form?.getFieldValue(name)]);

    useEffect(() => {
        getInitialOptions();
    }, []);

    return (
        <SelectField
            fieldProps={fieldProps}
            fromItemProps={fromItemProps}
            label={label}
            name={name}
            rules={_rules}
            disabled={disabled}
            showSearch
            allowClear={allowClear}
            options={_options?.slice(0, maxOptions)}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small" /> : undefined}
            onSearch={handleOnSearch}
            placeholder={_placeholder}
            onChange={onChange}
            onClear={() => handleOnSearch('')}
        />
    );
}

export default AutoCompleteField;
