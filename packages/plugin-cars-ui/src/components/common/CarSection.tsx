import {
  Box,
  Icon,
  ModalTrigger,
  MainStyleButtonRelated as ButtonRelated,
  __,
  SectionBodyItem
} from '@erxes/ui/src';
import React from 'react';
import { ICar } from '../../types';
import { MainStyleModalFooter as ModalFooter, Button } from '@erxes/ui/src';
import Select from 'react-select-plus';
import { Link } from 'react-router-dom';
import EmptyState from '@erxes/ui/src/components/EmptyState';

type Props = {
  cars: ICar[];
  collapseCallback?: () => void;
  customerOfCarEdit: (values: any) => void;
  id: string;
  customerCar: ICar[];
};

type State = {
  carIds: string[];
};

class CarSection extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      carIds: []
    };
  }

  render() {
    const {
      customerCar,
      collapseCallback,
      customerOfCarEdit,
      cars
    } = this.props;

    const options = cars.map(g => ({
      value: g._id,
      label: g.plateNumber
    }));

    const onChange = values => {
      this.setState({
        carIds: values.map(v => v.value)
      });
    };

    const saveCustomer = closeModal => {
      customerOfCarEdit({
        carIds: this.state.carIds,
        cusId: this.props.id
      });
      closeModal();
    };

    const renderCarChooser = props => {
      const { closeModal } = props;

      return (
        <>
          <Select
            placeholder="Choose Cars"
            name="carId"
            options={options}
            onChange={onChange}
            value={this.state.carIds}
            multi={true}
          />
          <ModalFooter>
            <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
              Close
            </Button>

            <Button
              btnStyle="success"
              onClick={() => saveCustomer(closeModal())}
              icon="check-circle"
            >
              Save
            </Button>
          </ModalFooter>
        </>
      );
    };

    const quickButtons = (
      <ModalTrigger
        title="Associate"
        trigger={
          <button>
            <Icon icon="plus-circle" />
          </button>
        }
        content={renderCarChooser}
      />
    );
    const content = (
      <>
        {customerCar.map(car => (
          <SectionBodyItem>
            <Link to={`/erxes-plugin-car/details/${car._id}`}>
              <Icon icon="arrow-to-right" />
            </Link>
            <span>{car.plateNumber || 'Unknown'}</span>
          </SectionBodyItem>
        ))}
        {!customerCar?.length && <EmptyState icon="car" text="No car" />}
      </>
    );

    return (
      <Box
        title={__('Cars')}
        name="showCars"
        extraButtons={quickButtons}
        isOpen={true}
        callback={collapseCallback}
      >
        {content}
      </Box>
    );
  }
}
export default CarSection;
