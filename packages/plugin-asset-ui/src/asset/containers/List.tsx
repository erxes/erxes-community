import React from 'react';
import * as compose from 'lodash.flowright'
import { withProps } from '@erxes/ui/src/utils/core';
import List from '../components/List';
type Props = {

}


class FormContainer extends React.Component<Props>{
    constructor(props){
        super(props);
    }

    render() {
        return <List/>
    }
}

export default withProps<Props>(
    compose(

    )(FormContainer)
)