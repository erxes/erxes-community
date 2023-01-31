import {
  Box,
  Icon,
  ModalTrigger,
  MainStyleButtonRelated as ButtonRelated,
  __,
  SectionBodyItem,
  Chooser
} from '@erxes/ui/src';
import React from 'react';
import { ICar } from '../../types';
import { Link } from 'react-router-dom';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import CarForm from '../../containers/CarForm';

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
  perPage: number;
  searchValue: string;
};

class CarSection extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      carIds: props.carsOnCustomerOrCompany.map(e => e._id) || [],
      perPage: 20,
      searchValue: ''
    };
  }

  search = (value: string, reload?: boolean) => {};

  carAddForm(props) {
    return <CarForm {...props} />;
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

    const onSelect = (datas: any) => {
      this.setState({ carIds: datas.map(data => data._id) }, () => {
        saveCustomerOrCompany();
      });
    };

    const saveCustomerOrCompany = () => {
      if (type === 'contact') {
        carsEditOnCustomer({
          carIds: this.state.carIds,
          customerId: id
        });
      } else {
        carsEditOnCompany({
          carIds: this.state.carIds,
          companyId: id
        });
      }
    };

    const selected = cars.filter(car => carIds.includes(car._id));

    const renderCarChooser = props => {
      const { closeModal } = props;

      return (
        <>
          <Chooser
            title="car"
            datas={cars}
            data={{ name: 'car', datas: selected }}
            search={this.search}
            clearState={() => this.search('', true)}
            renderForm={this.carAddForm}
            onSelect={onSelect}
            closeModal={() => closeModal()}
            renderName={car => car.plateNumber}
            perPage={5}
            limit={10}
          />
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
        size="lg"
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
