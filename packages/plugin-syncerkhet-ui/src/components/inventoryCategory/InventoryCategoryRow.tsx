import React from 'react';

type Props = {
  category: any;
  history: any;
  action: string;
};

class Row extends React.Component<Props> {
  render() {
    const { category, action } = this.props;

    const onTrClick = () => {};

    const { name, code } = category;

    return (
      <tr onClick={onTrClick}>
        <td>{code}</td>
        <td>{name}</td>
        {action === 'UPDATE' ? <td>false</td> : <td></td>}
      </tr>
    );
  }
}

export default Row;
