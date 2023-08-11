import { CustomRangeContainer, UploadItems } from "../../styles";
import { IButtonMutateProps, IFormProps } from "../../../common/types";
import React, { useState } from "react";
import { description, getDepartmentOptions, title } from "../../utils";

import ControlLabel from "../../../common/form/Label";
import DateControl from "../../../common/form/DateControl";
import { Form, FormGroup } from "../../../common/form";
import FormControl from "../../../common/form/Control";
import GenerateFields from "../GenerateFields";
import Select from "react-select-plus";
import SelectTeamMembers from "../../../common/team/containers/SelectTeamMembers";
import Uploader from "../../../common/Uploader";
import { CreateFormContainer, CreateInput, FlexRow } from "../../styles";
import ModalTrigger from "../../../common/ModalTrigger";
import NameCard from "../../../common/nameCard/NameCard";
import { __ } from "../../../../utils";

type Props = {
  item?: any;
  closeModal?: () => void;
  renderButton: (props: IButtonMutateProps) => any;
  fields: any[];
  departments: any[];
  isEdit?: boolean;
};

export default function EventForm(props: Props) {
  const { item = {}, fields, departments } = props;

  const [attachments, setAttachment] = useState(item.attachments || []);
  const [images, setImages] = useState(item.images || []);
  const [recipientIds, setRecipientIds] = useState(item.recipientIds || []);
  const [customFieldsData, setCustomFieldsData] = useState(
    item.customFieldsData || []
  );
  const itemEventData = item.eventData || {};

  const [eventData, setEventData] = useState({
    visibility: itemEventData.visibility || "public",
    where: itemEventData.where || "",
    startDate: itemEventData.startDate,
    endDate: itemEventData.endDate,
  });

  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  const onChangeDepartment = (option: any) => {
    setSelectedDepartment(option);
  };

  const onChangeEventData = (key, value) => {
    setEventData({ ...eventData, [key]: value });
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    const { renderButton, closeModal } = props;

    return (
      <>
        <FormGroup>
          <FormControl
            componentClass="radio"
            name="visibility"
            checked={eventData.visibility === "public"}
            value="public"
            onChange={(e: any) =>
              onChangeEventData("visibility", e.target.value)
            }
          >
            Public
          </FormControl>
          <FormControl
            componentClass="radio"
            name="visibility"
            value="private"
            checked={eventData.visibility === "private"}
            onChange={(e: any) =>
              onChangeEventData("visibility", e.target.value)
            }
          >
            Private
          </FormControl>
        </FormGroup>
        {eventData.visibility === "private" && (
          <>
            <SelectTeamMembers
              label="Invite people"
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
            onChange={(date) => onChangeEventData("startDate", date)}
            placeholder={"Start date"}
            dateFormat={"YYYY-MM-DD HH:mm:ss"}
            timeFormat={true}
          />
          <DateControl
            value={eventData.endDate}
            required={false}
            name="endDate"
            placeholder={"End date"}
            onChange={(date) => onChangeEventData("endDate", date)}
            dateFormat={"YYYY-MM-DD HH:mm:ss"}
            timeFormat={true}
          />
        </CustomRangeContainer>

        <FormGroup>{title(formProps, item)}</FormGroup>
        <FormGroup>{description(formProps, item)}</FormGroup>

        <FormGroup>
          <FormControl
            placeholder="Where"
            componentClass="textarea"
            value={eventData.where}
            onChange={(e: any) => onChangeEventData("where", e.target.value)}
          />
        </FormGroup>
        <Select
          placeholder="Choose one department"
          name="departmentId"
          value={selectedDepartment}
          onChange={onChangeDepartment}
          multi={false}
          options={getDepartmentOptions(departments)}
        />

        <FormGroup>
          <GenerateFields
            fields={fields}
            customFieldsData={customFieldsData}
            setCustomFieldsData={setCustomFieldsData}
          />
        </FormGroup>
        <FormGroup>
          <UploadItems>
            <div>
              <ControlLabel>Add attachments:</ControlLabel>
              <Uploader
                defaultFileList={attachments || []}
                onChange={setAttachment}
              />
            </div>
          </UploadItems>
        </FormGroup>
        <UploadItems>
          <div>
            <ControlLabel>Add images:</ControlLabel>
            <Uploader defaultFileList={images || []} onChange={setImages} />
          </div>
        </UploadItems>
        {renderButton({
          values: {
            title: values.title,
            description: values.description ? values.description : null,
            contentType: "event",
            attachments,
            images,
            recipientIds,
            customFieldsData,
            eventData,
            department: selectedDepartment ? selectedDepartment.label : null,
          },
          isSubmitted,
          callback: closeModal,
        })}
      </>
    );
  };

  const content = (datas?) => <Form {...datas} renderContent={renderContent} />;

  if(props.isEdit) {
    return content();
  }

  return (
    <CreateFormContainer>
      <FlexRow>
        <NameCard.Avatar user={{}} size={45} />
        <ModalTrigger
          dialogClassName="create-post"
          size="lg"
          title="Create post"
          trigger={<CreateInput>{__("Create new event")}</CreateInput>}
          content={content}
        />
      </FlexRow>
    </CreateFormContainer>
  );
}
