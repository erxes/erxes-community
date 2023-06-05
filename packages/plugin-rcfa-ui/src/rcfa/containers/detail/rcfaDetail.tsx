import React from 'react';
import { __, withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import { queries } from '../../graphql';
import { jsPlumb } from 'jsplumb';
import {
  AutomationFormContainer,
  HeightedWrapper,
  RCFAEndPoint,
  BackButton
} from '../../../styles';
import {
  connectorHoverStyle,
  connectorPaintStyle,
  hoverPaintStyle
} from '../../components/utils';
import Icon from '@erxes/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import Button from '@erxes/ui/src/components/Button';

const plumb: any = jsPlumb;
let instance: any;

type Props = {
  history: any;
  queryParams: any;
  rcfaDetail?: any;
};

class rcfaDetail extends React.Component<Props, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.connectInstance();
  }

  connectInstance = () => {
    instance = plumb.getInstance({
      DragOptions: { cursor: 'pointer', zIndex: 2000 },
      PaintStyle: connectorPaintStyle,
      HoverPaintStyle: connectorHoverStyle,
      EndpointStyle: { radius: 10 },
      EndpointHoverStyle: hoverPaintStyle,
      Container: 'canvas'
    });
  };

  loadEndpoints = () => {
    let issues: any = null;

    if (!this.props.rcfaDetail.loading) {
      issues = this.props.rcfaDetail.rcfaDetail?.issues.map(
        (issue: { issue: string }, index: number) => (
          <RCFAEndPoint key={index} id={`control${index}`}>
            <p>{issue.issue}</p>
          </RCFAEndPoint>
        )
      );
    }

    return issues;
  };

  endPointInitialize = () => {
    if (!this.props.rcfaDetail.loading) {
      let count: number = this.props.rcfaDetail.rcfaDetail.issues.length || 0;

      for (let i = 0; i < count; i++) {
        instance.addEndpoint(`control${i}`, {
          endpoint: 'Dot',
          anchor: ['LeftMiddle', 'RightMiddle', 'Top', 'Bottom'],
          isSource: false
        });
        instance.draggable(`control${i}`, { containment: true });
      }

      for (let i = 0; i < this.props.rcfaDetail.rcfaDetail.issues.length; i++) {
        const issue = this.props.rcfaDetail.rcfaDetail.issues[i];

        if (issue.parentId) {
          const parentIssue = this.getIndexIssue(issue.parentId);
          instance.connect({
            source: `control${i}`,
            target: `control${parentIssue}`
          });
        }
      }
    }
  };

  getIndexIssue = (parentId: string) => {
    for (let i = 0; i < this.props.rcfaDetail.rcfaDetail.issues.length; i++) {
      if (this.props.rcfaDetail.rcfaDetail.issues[i]._id === parentId) {
        return i;
      }
    }
    return null;
  };

  render() {
    return (
      <>
        <div style={{ margin: '1rem', display: 'flex' }}>
          <Link to="/rcfa">
            <BackButton>
              <Icon icon="angle-left" size={20} />
            </BackButton>
          </Link>
          <Button onClick={this.endPointInitialize}>Load</Button>
        </div>

        <HeightedWrapper>
          <AutomationFormContainer>
            <div
              id="canvas"
              style={{ width: '100%', height: '500px', position: 'relative' }}
            >
              {this.loadEndpoints()}
            </div>
          </AutomationFormContainer>
        </HeightedWrapper>
      </>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfa), {
      name: 'rcfaDetail',
      options: (props: any) => ({
        variables: {
          _id: props.match.params.id
        }
      })
    })
  )(rcfaDetail)
);
