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
import jquery from 'jquery';
import { IAutomation, IAutomationNote, AutomationConstants } from './utils';
import {
  connection,
  connectorHoverStyle,
  connectorPaintStyle,
  createInitialConnections,
  deleteConnection,
  hoverPaintStyle,
  noEndPoint,
  sourceEndpoint,
  targetEndpoint,
  yesEndPoint
} from '../../components/utils';
import Icon from '@erxes/ui/src/components/Icon';
import { Link } from 'react-router-dom';

const plumb: any = jsPlumb;
let instance: any;

type Props = {
  rcfaDetail?: any;
  automation: IAutomation;
  automationNotes?: IAutomationNote[];
  save: (params: any) => void;
  saveLoading: boolean;
  id: string;
  history: any;
  queryParams: any;
  constants: AutomationConstants;
};

class rcfaDetail extends React.Component<Props, any> {
  private wrapperRef: any;
  private setZoom: any;

  constructor(props: any) {
    super(props);

    this.state = {
      name: 'rcfa name',
      actions: [],
      triggers: [],
      activeTrigger: {},
      activeId: '',
      currentTab: 'triggers',
      isActionTab: true,
      isActive: true,
      showNoteForm: false,
      showTemplateForm: false,
      showTrigger: false,
      showDrawer: false,
      showAction: false,
      isZoomable: false,
      zoomStep: 0.025,
      zoom: 1,
      percentage: 100,
      activeAction: {},
      automationNotes: []
    };
  }

  setWrapperRef = (node: any) => {
    this.wrapperRef = node;
  };

  componentDidMount() {
    this.connectInstance();
    document.addEventListener('click', this.handleClickOutside, true);
  }

  loadRcfaIssues = () => {
    let issues: any[] = [];

    // if (!this.props.rcfaDetail.loading) {
    //   issues = this.props.rcfaDetail.rcfaDetail?.issues;
    // }

    const endpoints = issues.map((issue, index) => (
      <RCFAEndPoint key={index} id={`control${index}`}>
        <p>{issue.issue}</p>
      </RCFAEndPoint>
    ));

    return endpoints;
  };

  connectInstance = () => {
    instance = plumb.getInstance({
      DragOptions: { cursor: 'pointer', zIndex: 2000 },
      PaintStyle: connectorPaintStyle,
      HoverPaintStyle: connectorHoverStyle,
      EndpointStyle: { radius: 10 },
      EndpointHoverStyle: hoverPaintStyle,
      Container: 'canvas'
    });

    const { triggers, actions } = this.state;

    instance.bind('ready', () => {
      instance.bind('connection', info => {
        this.onConnection(info);
      });

      instance.bind('connectionDetached', info => {
        this.onDettachConnection(info);
      });

      for (const action of actions) {
        this.renderControl('action', action, this.onClickAction);
      }

      for (const trigger of triggers) {
        this.renderControl('trigger', trigger, this.onClickTrigger);
      }

      // create connections ===================
      createInitialConnections(triggers, actions, instance);

      // delete connections ===================
      deleteConnection(instance);
    });

    console.log('test', this.props.rcfaDetail);

    // instance.addEndpoint('control0', {
    //   endpoint: 'Dot',
    //   anchor: ['LeftMiddle', 'RightMiddle', 'Top', 'Bottom'],
    //   isSource: true
    // });
    // instance.draggable('control0', { containment: true });

    // instance.addEndpoint('control2', {
    //   endpoint: 'Dot',
    //   anchor: ['LeftMiddle', 'RightMiddle', 'Top', 'Bottom'],
    //   isTarget: true
    // });
    // instance.draggable('control2', { containment: true });

    // hover action control ===================
    jquery('#canvas .control').hover(event => {
      event.preventDefault();

      jquery(`div#${event.currentTarget.id}`).toggleClass('show-action-menu');

      this.setState({ activeId: event.currentTarget.id });
    });

    // delete control ===================
    // jquery('#canvas').on('click', '.delete-control', (event) => {
    //   event.preventDefault();

    //   const item = event.currentTarget.id;
    //   const splitItem = item.split('-');
    //   const type = splitItem[0];

    //   instance.remove(item);

    //   if (type === 'action') {
    //     return this.setState({
    //       actions: actions.filter((action) => action.id !== splitItem[1])
    //     });
    //   }

    //   if (type === 'trigger') {
    //     return this.setState({
    //       triggers: triggers.filter((trigger) => trigger.id !== splitItem[1])
    //     });
    //   }
    // });

    // add note ===================
    jquery('#canvas').on('click', '.add-note', event => {
      event.preventDefault();

      this.handleNoteModal();
    });
  };

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.isActionTab
    ) {
      this.setState({ showDrawer: false });
    }
  };

  onConnection = info => {
    const { triggers, actions } = this.state;
    connection(triggers, actions, info, info.targetId.replace('action-', ''));
    this.setState({ triggers, actions });
  };

  onDettachConnection = info => {
    const { triggers, actions } = this.state;
    connection(triggers, actions, info, undefined);
    this.setState({ triggers, actions });
  };

  renderControl = (key: string, item: any, onClick: any) => {
    const idElm = `${key}-${item.id}`;

    jquery('#canvas').append(`
      <div class="${key} control" id="${idElm}" style="${item.style}">
        <div class="trigger-header">
          <div class='custom-menu'>
            <div>
              <i class="icon-notes add-note" title=${__('Write Note')}></i>
              <i class="icon-trash-alt delete-control" id="${idElm}" title=${__(
      'Delete control'
    )}></i>
            </div>
          </div>
          <div>
            <i class="icon-${item.icon}"></i>
            ${item.label} ${this.renderCount(item)}
          </div>
        </div>
        <p>${item.description}</p>
        ${this.renderNotes(idElm)}
      </div>
    `);

    jquery('#canvas').on('dblclick', `#${idElm}`, event => {
      event.preventDefault();
      onClick(item);
    });

    jquery('#canvas').on('click', `.note-badge-${idElm}`, event => {
      event.preventDefault();
      this.onClickNote(event.currentTarget.id);
    });

    if (key === 'trigger') {
      instance.addEndpoint(idElm, sourceEndpoint, {
        anchor: [1, 0.5]
      });

      if (instance.getSelector(`#${idElm}`).length > 0) {
        instance.draggable(instance.getSelector(`#${idElm}`), {
          cursor: 'move',
          stop(params) {
            item.style = jquery(`#${idElm}`).attr('style');
          }
        });
      }
    }

    if (key === 'action') {
      if (item.type === 'if') {
        instance.addEndpoint(idElm, targetEndpoint, {
          anchor: ['Left']
        });

        instance.addEndpoint(idElm, yesEndPoint);
        instance.addEndpoint(idElm, noEndPoint);
      } else {
        instance.addEndpoint(idElm, targetEndpoint, {
          anchor: ['Left']
        });

        instance.addEndpoint(idElm, sourceEndpoint, {
          anchor: ['Right']
        });
      }

      instance.draggable(instance.getSelector(`#${idElm}`), {
        cursor: 'move',
        stop(params) {
          item.style = jquery(`#${idElm}`).attr('style');
        }
      });
    }
  };

  onClickTrigger = (trigger: any) => {
    const config = trigger && trigger.config;
    const selectedContentId = config && config.contentId;

    this.setState({
      showTrigger: true,
      showDrawer: true,
      showAction: false,
      currentTab: 'triggers',
      selectedContentId,
      activeTrigger: trigger ? trigger : ({} as any)
    });
  };

  onClickAction = (action: any) => {
    this.setState({
      showAction: true,
      showDrawer: true,
      showTrigger: false,
      currentTab: 'actions',
      activeAction: action ? action : ({} as any)
    });
  };

  handleNoteModal = (item?: any) => {
    this.setState({
      showNoteForm: !this.state.showNoteForm,
      editNoteForm: item ? true : false
    });
  };

  onClickNote = (activeId: any) => {
    this.setState({ activeId }, () => {
      this.handleNoteModal(activeId);
    });
  };

  renderCount(item: any) {
    const {
      constants: { triggerTypesConst }
    } = this.props;

    if (item.count && triggerTypesConst.includes(item.type)) {
      return `(${item.count})`;
    }

    return '';
  }

  checkNote = (activeId: string) => {
    const item = activeId.split('-');
    const type = item[0];

    return (this.state.automationNotes || []).filter(note => {
      if (type === 'trigger' && note.triggerId !== item[1]) {
        return null;
      }

      if (type === 'action' && note.actionId !== item[1]) {
        return null;
      }

      return note;
    });
  };

  renderNotes(key: string) {
    const noteCount = (this.checkNote(key) || []).length;

    if (noteCount === 0) {
      return ``;
    }

    return `
      <div class="note-badge note-badge-${key}" title=${__(
      'Notes'
    )} id="${key}">
        <i class="icon-notes"></i>
        <h1>hello world</h1>
      </div>
    `;
  }

  render() {
    return (
      <>
        <div style={{ margin: '1rem' }}>
          <Link to="/rcfa">
            <BackButton>
              <Icon icon="angle-left" size={20} />
            </BackButton>
          </Link>
        </div>

        <HeightedWrapper>
          <AutomationFormContainer>
            <div
              id="canvas"
              style={{ width: '100%', height: '500px', position: 'relative' }}
            >
              {this.loadRcfaIssues()}

              {/* <RCFAEndPoint id="control1">
                <p>control 1</p>
              </RCFAEndPoint>
              <RCFAEndPoint id="control2">
                <p>control 2</p>
              </RCFAEndPoint> */}
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
