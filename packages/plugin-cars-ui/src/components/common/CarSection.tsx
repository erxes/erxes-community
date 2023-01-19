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
  id: string;
  cars: ICar[];
  carsOnCustomer: ICar[];
  collapseCallback?: () => void;
  carsEditOnCustomer: (values: any) => void;
  carsEditOnCompany: (values: any) => void;
};

type State = {
  carIds: string[];
};

class CarSection extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      carIds: props.carsOnCustomer.map(e => e._id) || []
    };
  }

  render() {
    const {
      id,
      cars,
      carsOnCustomer,
      collapseCallback,
      carsEditOnCustomer,
      carsEditOnCompany
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

    const saveCustomerOrCompany = closeModal => {
      carsEditOnCustomer({
        carIds: this.state.carIds,
        customerId: id
      });
      closeModal();
    };

    const saveCompany = closeModal => {
      carsEditOnCompany({
        carIds: this.state.carIds,
        companyId: id
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
              onClick={() => saveCustomerOrCompany(closeModal())}
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
        {carsOnCustomer.map(car => (
          <SectionBodyItem>
            <Link to={`/erxes-plugin-car/details/${car._id}`}>
              <Icon icon="arrow-to-right" />
            </Link>
            <span>{car.plateNumber || 'Unknown'}</span>
          </SectionBodyItem>
        ))}
        {!carsOnCustomer?.length && <EmptyState icon="car" text="No car" />}
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
