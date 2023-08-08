import { CustomRangeContainer, UploadItems } from '../../styles';
import { IButtonMutateProps, IFormProps } from '../../../common/types';
import React, { useState } from 'react';
import { description, getDepartmentOptions, title } from '../../utils';

import ControlLabel from '../../../common/form/Label';
import DateControl from '../../../common/form/DateControl';
import { Form } from '../../../common/form';
import FormControl from '../../../common/form/Control';
import GenerateFields from '../GenerateFields';
import Select from 'react-select-plus';
import SelectTeamMembers from '../../../common/team/containers/SelectTeamMembers';
import Uploader from '../../../common/Uploader';

type Props = {
  item?: any;
  closeModal?: () => void;
  renderButton: (props: IButtonMutateProps) => any;
  fields: any[];
  departments: any[];
  branches: any[];
  units: any[];
};

export default function EventForm(props: Props) {
  const { item = {}, fields, departments, branches, units } = props;

  const [attachments, setAttachment] = useState(item.attachments || []);
  const [images, setImages] = useState(item.images || []);
  const [recipientIds, setRecipientIds] = useState(item.recipientIds || []);
  const [customFieldsData, setCustomFieldsData] = useState(
    item.customFieldsData || []
  );
  const itemEventData = item.eventData || {};

  const [eventData, setEventData] = useState({
    visibility: itemEventData.visibility || 'public',
    where: itemEventData.where || '',
    startDate: itemEventData.startDate,
    endDate: itemEventData.endDate
  });

  const [departmentIds, setDepartmentIds] = useState(item?.departmentIds || []);
  const [branchIds, setBranchIds] = useState(item?.branchIds || []);
  const [unitId, setUnitId] = useState(item?.unitId || '');

  const onChangeDepartment = (option: any) => {
    setDepartmentIds(option.map((data) => data.value) || []);
  };

  const onChangeBranch = (option: any) => {
    setBranchIds(option.map((data) => data.value) || []);
  };

  const onChangeUnit = (option: any) => {
    setUnitId(option?.value || '');
  };

  const onChangeEventData = (key, value) => {
    setEventData({ ...eventData, [key]: value });
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    const { renderButton, closeModal } = props;

    return (
      <>
        <span>
          <FormControl
            componentClass="radio"
            name="visibility"
            checked={eventData.visibility === 'public'}
            value="public"
            onChange={(e: any) =>
              onChangeEventData('visibility', e.target.value)
            }
          >
            Public
          </FormControl>
          <FormControl
            componentClass="radio"
            name="visibility"
            value="private"
            checked={eventData.visibility === 'private'}
            onChange={(e: any) =>
              onChangeEventData('visibility', e.target.value)
            }
          >
            Private
          </FormControl>
        </span>
        {eventData.visibility === 'private' && (
          <>
            <SelectTeamMembers
              label="Who"
              name="recipientIds"
              initialValue={recipientIds}
              onSelect={setRecipientIds}
            />
            <br />
          </>
        )}
        <CustomRangeContainer>
          <DateControl
            value={eventData.startDate}
            required={false}
            name="startDate"
            onChange={(date) => onChangeEventData('startDate', date)}
            placeholder={'Start date'}
            dateFormat={'YYYY-MM-DD HH:mm:ss'}
            timeFormat={true}
          />
          <DateControl
            value={eventData.endDate}
            required={false}
            name="endDate"
            placeholder={'End date'}
            onChange={(date) => onChangeEventData('endDate', date)}
            dateFormat={'YYYY-MM-DD HH:mm:ss'}
            timeFormat={true}
          />
        </CustomRangeContainer>

        {title(formProps, item)}
        {description(formProps, item)}

        <FormControl
          placeholder="Where"
          componentClass="textarea"
          value={eventData.where}
          onChange={(e: any) => onChangeEventData('where', e.target.value)}
        />
        <Select
          placeholder="Choose department"
          name="departmentId"
          value={departmentIds}
          onChange={onChangeDepartment}
          multi={true}
          options={getDepartmentOptions(departments)}
        />

        <Select
          placeholder="Choose branch"
          name="branchIds"
          value={branchIds}
          onChange={onChangeBranch}
          multi={true}
          options={getDepartmentOptions(branches)}
        />

        <Select
          placeholder="Choose unit"
          name="unitId"
          value={unitId}
          onChange={onChangeUnit}
          multi={false}
          options={getDepartmentOptions(units)}
        />

        <GenerateFields
          fields={fields}
          customFieldsData={customFieldsData}
          setCustomFieldsData={setCustomFieldsData}
        />
        <UploadItems>
          <div>
            <Uploader
              defaultFileList={attachments || []}
              onChange={setAttachment}
            />
            <ControlLabel>Add attachments:</ControlLabel>
          </div>
        </UploadItems>
        <UploadItems>
          <div>
            <Uploader defaultFileList={images || []} onChange={setImages} />
            <ControlLabel>Add images:</ControlLabel>
          </div>
        </UploadItems>
        {renderButton({
          values: {
            title: values.title,
            description: values.description ? values.description : null,
            contentType: 'event',
            attachments,
            images,
            recipientIds,
            customFieldsData,
            eventData,
            departmentIds,
            branchIds,
            unitId
          },
          isSubmitted,
          callback: closeModal
        })}
      </>
    );
  };

  return <Form renderContent={renderContent} />;
}
