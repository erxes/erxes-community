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
import { Link } from 'react-router-dom';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import SelectWithSearch from '@erxes/ui/src/components/SelectWithSearch';
import { queries } from '../../graphql';

type Props = {
  id: string;
  type: string;
  cars: ICar[];
  carsOnCustomerOrCompany: ICar[];
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
      carIds: props.carsOnCustomerOrCompany.map(e => e._id) || []
    };
  }

  render() {
    const {
      id,
      type,
      cars,
      carsOnCustomerOrCompany,
      collapseCallback,
      carsEditOnCustomer,
      carsEditOnCompany
    } = this.props;
    const { carIds } = this.state;

    const onSelect = carIds => {
      this.setState({
        carIds
      });
    };

    const options = () => {
      return cars.map((car: ICar) => {
        return { value: car._id, label: car.plateNumber || '' };
      });
    };

    const saveCustomerOrCompany = closeModal => {
      if (type === 'contact') {
        carsEditOnCustomer({
          carIds: carIds,
          customerId: id
        });
        closeModal();
      } else {
        carsEditOnCompany({
          carIds: this.state.carIds,
          companyId: id
        });
      }
      closeModal();
    };

    const renderCarChooser = props => {
      const { closeModal } = props;

      return (
        <>
          <SelectWithSearch
            label="Choose Cars"
            queryName="cars"
            name="carId"
            customQuery={queries.cars}
            onSelect={onSelect}
            generateOptions={options}
            initialValue={this.state.carIds}
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
        {carsOnCustomerOrCompany.map(car => (
          <SectionBodyItem>
            <Link to={`/erxes-plugin-car/details/${car._id}`}>
              <Icon icon="arrow-to-right" />
            </Link>
            <span>{car.plateNumber || 'Unknown'}</span>
          </SectionBodyItem>
        ))}
        {!carsOnCustomerOrCompany?.length && (
          <EmptyState icon="car" text="No car" />
        )}
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
