import {
  AvatarImg,
  FeedActions,
  HeaderFeed,
  // LikeCommentShare,
  NewsFeedLayout,
  TextFeed
} from '../../styles';

import Icon from '../../../common/Icon';
import LoadMore from '../../../common/LoadMore';
import React from 'react';
import dayjs from 'dayjs';
import { getUserAvatar } from '../../../utils';

type Props = {
  list: any;
  totalCount: number;
  limit: number;
};

export default function WelcomeList({ list, totalCount, limit }: Props) {
  const renderItem = (item: any) => {
    const createdUser = item.createdUser || {};

    return (
      <div key={item._id}>
        <HeaderFeed>
          <FeedActions>
            <AvatarImg
              alt={
                (createdUser &&
                  createdUser.details &&
                  createdUser.details.fullName) ||
                'author'
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
                {dayjs(item.createdAt).format('MM/DD/YYYY h:mm A')}{' '}
                <b>#{item.contentType}</b>
              </p>
            </div>
          </FeedActions>
        </HeaderFeed>
        <TextFeed>
          <b dangerouslySetInnerHTML={{ __html: item.title }} />
          <p dangerouslySetInnerHTML={{ __html: item.description }} />
        </TextFeed>
        {/* <LikeCommentShare>
          <b>{item.likeCount} Like</b>
          <b>{item.commentCount} Comments</b>
          <b>Share</b>
        </LikeCommentShare> */}
      </div>
    );
  };

  const renderList = () => {
    const datas = list || [];

    const showList = (items) => {
      return items.map((filteredItem) => renderItem(filteredItem));
    };

    return <>{showList(datas)}</>;
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
