import { gql } from '@apollo/client';
import { IFieldGroup } from '@erxes/ui-forms/src/settings/properties/types';
import { queries as fieldQueries } from '@erxes/ui-forms/src/settings/properties/graphql';
import client from '@erxes/ui/src/apolloClient';
import {
  Button,
  CollapseContent,
  ControlLabel,
  FormControl,
  FormGroup,
  Tip
} from '@erxes/ui/src/components';
import { FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { MainStyleModalFooter as ModalFooter } from '@erxes/ui/src/styles/eindex';
import { isEnabled } from '@erxes/ui/src/utils/core';
import { IConfigsMap } from '../../types';
import { FIELDS_GROUPS_CONTENT_TYPES } from '@erxes/ui-forms/src/settings/properties/constants';
import { GroupWrapper } from '@erxes/ui-segments/src/styles';

type Props = {
  configsMap: IConfigsMap;
  config: any;
  currentConfigKey: string;
  save: (configsMap: IConfigsMap) => void;
  delete: (currentConfigKey: string) => void;
};

type State = {
  config: any;
  rules: any[];
  hasOpen: boolean;
  fieldGroups: IFieldGroup[];
};

class PerSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      config: props.config,
      rules: props.config.rules || [],
      hasOpen: false,
      fieldGroups: []
    };

    if (isEnabled('forms')) {
      client
        .query({
          query: gql(fieldQueries.fieldsGroups),
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.PRODUCT
          }
        })
        .then(({ data }) => {
          this.setState({
            fieldGroups: data ? data.fieldsGroups : [] || []
          });
        });
    }
  }

  onSave = e => {
    e.preventDefault();
    const { configsMap, currentConfigKey } = this.props;
    const { config, rules } = this.state;
    const key = config.codeMask;
    const similarityGroup = { ...configsMap.similarityGroup };

    delete similarityGroup[currentConfigKey];
    similarityGroup[key] = { ...config, rules };
    this.props.save({ ...configsMap, similarityGroup });
  };

  onDelete = e => {
    e.preventDefault();

    this.props.delete(this.props.currentConfigKey);
  };

  onChange = e => {
    const { config } = this.state;

    const name = e.target.name;
    const value = e.target.value;
    this.setState({ config: { ...config, [name]: value } });
  };

  renderInput = (key: string, title?: string, description?: string) => {
    const { config } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{title || key}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          name={key}
          defaultValue={config[key]}
          onChange={this.onChange}
          required={true}
        />
      </FormGroup>
    );
  };

  addRule = () => {
    const { rules } = this.state;
    this.setState({ rules: [...rules, { id: Math.random().toString() }] });
  };

  renderRules() {
    const { rules, fieldGroups } = this.state;
    const onRemove = id => {
      this.setState({ rules: rules.filter(c => c.id !== id) });
    };

    const editRule = (id, rule) => {
      const updated = (rules || []).map(r =>
        r.id === id ? { ...r, ...rule } : r
      );
      this.setState({ rules: updated });
    };

    const onChangeControl = (id, e) => {
      const name = e.target.name;
      const value = e.target.value;
      editRule(id, { [name]: value });
    };

    return (rules || []).map(rule => (
      <GroupWrapper key={rule.id}>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl
                name="title"
                value={rule.title}
                onChange={onChangeControl.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Field Group</ControlLabel>
              <FormControl
                name="groupId"
                componentClass="select"
                options={[
                  { value: '', label: 'Empty' },
                  ...(fieldGroups || []).map(fg => ({
                    value: fg._id,
                    label: `${fg.code} - ${fg.name}`
                  }))
                ]}
                value={rule.groupId}
                onChange={onChangeControl.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Field</ControlLabel>
              <FormControl
                name="fieldId"
                componentClass="select"
                options={[
                  { value: '', label: 'Empty' },
                  ...(
                    (
                      (
                        (fieldGroups || []).find(
                          fg => fg._id === rule.groupId
                        ) || {}
                      ).fields || []
                    ).filter(f =>
                      [
                        'input',
                        'textarea',
                        'select',
                        'check',
                        'radio',
                        'customer',
                        'product',
                        'branch',
                        'department',
                        'map'
                      ].includes(f.type)
                    ) || []
                  ).map(f => ({
                    value: f._id,
                    label: `${f.code} - ${f.text}`
                  }))
                ]}
                value={rule.fieldId}
                onChange={onChangeControl.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <Tip text={'Delete'}>
          <Button
            btnStyle="simple"
            size="small"
            onClick={onRemove.bind(this, rule.id)}
            icon="times"
          />
        </Tip>
      </GroupWrapper>
    ));
  }

  render() {
    const { config } = this.state;
    return (
      <CollapseContent
        title={__(config.title)}
        open={
          this.props.currentConfigKey === 'newSimilarityGroup' ? true : false
        }
      >
        <FormWrapper>
          <FormColumn>{this.renderInput('title', 'Title', '')}</FormColumn>
          <FormColumn>
            {this.renderInput('codeMask', 'Code Mask', '')}
          </FormColumn>
        </FormWrapper>
        {this.renderRules()}
        <ModalFooter>
          <Button
            btnStyle="primary"
            onClick={this.addRule}
            icon="plus"
            uppercase={false}
          >
            Add Rule
          </Button>
          <Button
            btnStyle="simple"
            icon="cancel-1"
            onClick={this.onDelete}
            uppercase={false}
          >
            Delete
          </Button>

          <Button
            btnStyle="primary"
            icon="check-circle"
            onClick={this.onSave}
            uppercase={false}
            disabled={config.codeMask ? false : true}
          >
            Save
          </Button>
        </ModalFooter>
      </CollapseContent>
    );
  }
}
export default PerSettings;
