import {
  Attachments,
  AvatarImg,
  FeedActions,
  HeaderFeed,
  LikeCommentShare,
  NavItem,
  NewsFeedLayout,
  TextFeed,
  AttachmentContainer,
  MoreAttachment,
  EventInfo,
} from "../../styles";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "../../../common/DropdownToggle";
import Form from "../../containers/feed/Form";
import Icon from "../../../common/Icon";
import LoadMore from "../../../common/LoadMore";
import ModalTrigger from "../../../common/ModalTrigger";
import React from "react";
import dayjs from "dayjs";
import { getUserAvatar } from "../../../utils";
import { readFile } from "../../../common/utils";
import withCurrentUser from "../../../auth/containers/withCurrentUser";
import { IUser } from "../../../types";
import AttachmentWithPreview from "../../../common/AttachmentWithPreview";
import Comments from "../../containers/feed/comment";

type Props = {
  list: any;
  totalCount: number;
  deleteItem: (_id: string) => void;
  pinItem: (_id: string) => void;
  handleHearted: (_id: string) => void;
  limit: number;
};

type FinalProps = {
  currentUser: IUser;
} & Props;

function List({
  list,
  deleteItem,
  pinItem,
  totalCount,
  limit,
  currentUser,
  handleHearted,
}: FinalProps) {
  const editItem = (item) => {
    const trigger = (
      <span>
        <a>Edit</a>
      </span>
    );

    const content = (props) => {
      const { closeModal } = props;

      return (
        <Form
          contentType={item.contentType}
          item={item}
          transparent={true}
          isEdit={true}
          closeModal={closeModal}
          {...props}
        />
      );
    };

    return (
      <ModalTrigger
        title="Edit"
        size="lg"
        trigger={trigger}
        content={content}
      />
    );
  };

  const renderItem = (item: any) => {
    const createdUser = item.createdUser || {};

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let links = [];
    let updatedDescription = "";

    if (item.description) {
      const matches = item.description.match(urlRegex);

      if (matches) {
        updatedDescription = matches.reduce(
          (prevDescription, link) => prevDescription.replace(link, ""),
          item.description
        );

        links = matches;
      } else {
        updatedDescription = item.description;
      }
    }

    const renderImages = () => {
      if (item.images.length === 1) {
        return (
          <AttachmentWithPreview
            attachment={item.images[0]}
            attachments={item.images}
          />
        );
      }

      if (item.images.length === 2) {
        return (
          <>
            <AttachmentWithPreview
              attachment={item.images[0]}
              attachments={item.images}
            />
            <AttachmentWithPreview
              attachment={item.images[1]}
              attachments={item.images}
            />
          </>
        );
      }

      return (
        <>
          <AttachmentWithPreview
            attachment={item.images[0]}
            attachments={item.images}
          />
          <div>
            <AttachmentWithPreview
              attachment={item.images[1]}
              attachments={item.images}
            />
            <AttachmentWithPreview
              attachment={item.images[2]}
              attachments={item.images}
            />
            {item.images.length > 3 && (
              <MoreAttachment>+ {item.images.length - 3} more</MoreAttachment>
            )}
          </div>
        </>
      );
    };

    const renderEventInfo = () => {
      const { eventData } = item;

      return (
        <EventInfo>
          <div>
            <Icon icon="wallclock" />
            {dayjs(eventData.startDate).format("MM/DD/YYYY h:mm A")} ~{" "}
            {dayjs(eventData.endDate).format("MM/DD/YYYY h:mm A")}
          </div>
          <div>
            <Icon icon="users" />
            <b>{eventData.goingUserIds.length}</b> Going •{" "}
            <b>{eventData.interestedUserIds.length}</b> Interested
          </div>
          <div>
            <Icon icon="user" />
            Event by{" "}
            {item.createdUser.details?.fullName ||
              item.createdUser.username ||
              item.createdUser.email}
          </div>
          <div>
            <Icon icon="location-point" />
            {eventData.where}
          </div>
        </EventInfo>
      );
    };

    return (
      <div key={item._id}>
        <HeaderFeed>
          <FeedActions>
            <AvatarImg
              alt={
                (createdUser &&
                  createdUser.details &&
                  createdUser.details.fullName) ||
                "author"
              }
              src={getUserAvatar(createdUser)}
            />
            <div>
              <b>
                {createdUser &&
                  ((createdUser.details && createdUser.details.fullName) ||
                    createdUser.username ||
                    createdUser.email)}
              </b>
              {item.department ? (
                <p>
                  <Icon icon="building" size={16} />
                  {item.department}
                </p>
              ) : null}
              <p>
                {dayjs(item.createdAt).format("MM/DD/YYYY h:mm A")}{" "}
                <b>#{item.contentType}</b>
              </p>
            </div>
          </FeedActions>
          <FeedActions showPin={item.isPinned}>
            <Icon icon="map-pin-alt" size={18} />
            {currentUser._id === createdUser._id && (
              <NavItem>
                <Dropdown alignRight={true}>
                  <Dropdown.Toggle as={DropdownToggle} id="comment-settings">
                    <Icon icon="ellipsis-h" size={14} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <li>
                      <Icon icon="edit" size={15} />
                      {editItem(item)}
                    </li>
                    <li>
                      <Icon icon="trash" size={15} />
                      <a onClick={() => deleteItem(item._id)}>Delete</a>
                    </li>
                    <li>
                      <Icon icon="map-pin-alt" size={15} />
                      <a onClick={() => pinItem(item._id)}>
                        {item.isPinned ? "UnPin" : "Pin"}
                      </a>
                    </li>
                  </Dropdown.Menu>
                </Dropdown>
              </NavItem>
            )}
          </FeedActions>
        </HeaderFeed>
        <TextFeed>
          <b dangerouslySetInnerHTML={{ __html: item.title }} />
          <p dangerouslySetInnerHTML={{ __html: updatedDescription }} />
          {item.contentType === "event" && renderEventInfo()}
          {links.map((link, index) => {
            return (
              <iframe
                key={index}
                width="640"
                height="390"
                src={String(link)
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "youtube.com/embed/")
                  .replace("share/", "embed/")}
                title="Video"
                allowFullScreen={true}
              />
            );
          })}
        </TextFeed>
        {(item.attachments || []).map((a, index) => {
          return (
            <a key={index} href={readFile(a.url)}>
              <Attachments>
                <b>
                  {a.name} <Icon icon="external-link-alt" />
                </b>
              </Attachments>
            </a>
          );
        })}
        {item.images.length > 0 && (
          <AttachmentContainer attachmentLength={item.images.length}>
            {renderImages()}
          </AttachmentContainer>
        )}
        <LikeCommentShare>
          <b onClick={() => handleHearted(item._id)}>
            <Icon color={`${item.isHearted && "red"}`} icon="heart-2" />{" "}
            {item.heartCount}
          </b>
          <ModalTrigger
            title="Comment"
            size="lg"
            trigger={
              <b>
                <Icon icon="comment-1" /> {item.commentCount}
              </b>
            }
            content={(props) => <Comments contentId={item._id} {...props} />}
          />
          {/* <b>Share</b> */}
        </LikeCommentShare>
      </div>
    );
  };

  const renderList = () => {
    const datas = list || [];
    const pinnedList = datas.filter(
      (data) =>
        data.isPinned &&
        ((data.eventData?.visibility === "private" &&
          data.recipientIds.includes(currentUser._id)) ||
          data.eventData?.visibility === "public")
    );
    const normalList = datas.filter(
      (data) =>
        !data.isPinned &&
        ((data.eventData?.visibility === "private" &&
          data.recipientIds.includes(currentUser._id)) ||
          data.eventData?.visibility === "public")
    );

    const showList = (items) => {
      return items.map((filteredItem) => renderItem(filteredItem));
    };

    return (
      <>
        {showList(pinnedList)}
        {showList(normalList)}
      </>
    );
  };

  return (
    <NewsFeedLayout>
      {renderList()}
      <LoadMore
        perPage={limit}
        all={totalCount}
        history={undefined}
        location={undefined}
        match={undefined}
      />
    </NewsFeedLayout>
  );
}

const WithCurrentUser = withCurrentUser(List);

export default (props: Props) => {
  return <WithCurrentUser {...props} />;
};
