import React from 'react';
import dayjs from 'dayjs';
// erxes
import TextInfo from '@erxes/ui/src/components/TextInfo';
import Spinner from '@erxes/ui/src/components/Spinner';
import { FlexContent, FlexItem } from '@erxes/ui/src/layout/styles';

type Props = {
  loading: boolean;
  detail: any;
};

export default function RowModalContent(props: Props) {
  const { loading = false, detail } = props;

  const renderTransactionItems = () => {
    return (
      <>
        <TextInfo hugeness="big">Product</TextInfo>
        <br />
        {((detail && detail.branch) || {}).title || 'Branch'}
        <br />
        <br />
        <TextInfo hugeness="big">Department</TextInfo>
        <br />
        {((detail && detail.department) || {}).title || 'Department'}
        <br />
        <br />
        <TextInfo hugeness="big">Content Type</TextInfo>
        <br />
        {detail && detail.contentType}
        <br />
        <br />
        <TextInfo hugeness="big">Created Date</TextInfo>
        <br />
        {dayjs(detail.createdAt).format('ll') || 'Created at'}
        <br />
        <br />
      </>
    );
  };

  if (loading) <Spinner />;

  return (
    <FlexContent>
      <FlexItem>
        <TextInfo hugeness="big">Branch</TextInfo>
        <br />
        {((detail && detail.branch) || {}).title || 'Branch'}
        <br />
        <br />
        <TextInfo hugeness="big">Department</TextInfo>
        <br />
        {((detail && detail.department) || {}).title || 'Department'}
        <br />
        <br />
        <TextInfo hugeness="big">Content Type</TextInfo>
        <br />
        {detail && detail.contentType}
        <br />
        <br />
        <TextInfo hugeness="big">Created Date</TextInfo>
        <br />
        {dayjs(detail.createdAt).format('ll') || 'Created at'}
        <br />
        <br />
      </FlexItem>
      <FlexItem>
        <TextInfo hugeness="big">Transaction Items</TextInfo>
        {renderTransactionItems()}
      </FlexItem>
    </FlexContent>
  );
}
