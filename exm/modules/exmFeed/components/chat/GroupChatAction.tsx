import React, { useState } from "react";
// erxes

// local
import ModalTrigger from "../../../common/ModalTrigger";
import Icon from "../../../common/Icon";
import { ParticipantItemWrapper } from "../../styles";
import FormGroup from "../../../common/form/Group";
import FormControl from "../../../common/form/Control";
import Button from "../../../common/Button";
import Uploader from "../../../common/Uploader";
import { ModalFooter } from "../../../styles/main";

type Props = {
  chat?: any;
  editChat: (_id: string, name?: any[], featuredImage?: string) => void;
};

const GroupChat = (props: Props) => {
  const { chat, editChat } = props;

  const [name, setName] = useState(chat.name || "");
  const [featuredImage, setFeaturedImage] = useState(chat.featuredImage || []);

  const handleSubmit = (callback) => {
    editChat(chat._id, name, featuredImage);
    callback();
  };

  const changeName = (p) => {
    return (
      <>
        <FormGroup>
          <FormControl
            placeholder="Title"
            type="text"
            name="name"
            onChange={(e: any) => setName(e.target.value)}
            defaultValue={name}
          />
        </FormGroup>
        <ModalFooter>
          <Button onClick={() => handleSubmit(p.closeModal)}>Save</Button>
          <Button btnStyle="simple" onClick={p.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </>
    );
  };

  const changeImage = (p) => {
    return (
      <>
        <Uploader
          defaultFileList={featuredImage}
          onChange={setFeaturedImage}
          btnText="Cover Image"
          btnIcon="image"
          single={true}
          btnIconSize={30}
        />
        <ModalFooter>
          <Button onClick={() => handleSubmit(p.closeModal)}>Save</Button>
          <Button btnStyle="simple" onClick={p.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </>
    );
  };

  return (
    <>
      <ModalTrigger
        title="Change group chat name"
        trigger={
          <ParticipantItemWrapper>
            <a href="#">
              <Icon icon="edit" size={13} color="black" />
              Change group chat name
            </a>
          </ParticipantItemWrapper>
        }
        content={(p) => changeName(p)}
        isAnimate={true}
      />

      <ModalTrigger
        title="Change group chat image"
        trigger={
          <ParticipantItemWrapper>
            <a href="#">
              <Icon icon="image-edit" size={13} color="black" />
              Change group chat image
            </a>
          </ParticipantItemWrapper>
        }
        content={(p) => changeImage(p)}
        isAnimate={true}
      />
    </>
  );
};

export default GroupChat;
