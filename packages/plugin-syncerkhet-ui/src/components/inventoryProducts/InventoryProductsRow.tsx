import React from 'react';

type Props = {
  product: any;
  history: any;
};

class Row extends React.Component<Props> {
  render() {
    const { product } = this.props;

    const onTrClick = () => {};

    const { name, code, barcode, category, unit_price, weight } = product;

    return (
      <tr onClick={onTrClick}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{barcode}</td>
        <td>{category}</td>
        <td>{unit_price}</td>
        <td>{weight}</td>
      </tr>
    );
  }
}

export default Row;
