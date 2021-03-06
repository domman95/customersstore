import React, { Component } from 'react';
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux'
import { createVisit, deleteCustomer } from '../../store/actions/customerAction'
import CustomerVisit from '../visits/CustomerVisit';
import DeleteCustomer from './DeleteCustomer';
import AddVisit from '../visits/AddVisit';
import { Redirect } from 'react-router-dom';

class CustomerDetails extends Component {
    state = {
        components: {
            addVisit: false,
            deleteCustomer: false
        }
    };


    closeChild = (e) => {
        this.setState({
            components: !this.state.components
        })
    }

    onButtonClick = (e) => {
        this.setState({
            components: {
                [e.target.parentNode.id]: true,
                [e.target.id]: true
            }
        })
    }

    render() {
        const { customer, auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin' />
        if (customer) {
            return (
                <div className="customerDetails">
                    <div className="customerNameAndBackBtn">
                        <button className="material-icons" onClick={() => { this.props.history.push('/customers') }} style={{ cursor: 'pointer' }} >arrow_back</button>
                        <p>{`${customer.fullName.split(' ').reverse().toString().replace(',', ' ')}`}</p>
                    </div>
                    <div className="customerDetailsHeader">
                        <div className="phoneCustomer">
                            <i className="material-icons">phone</i>
                            <a href={`tel:+48${customer.phoneNumber}`}>{customer.phoneNumber}</a>
                        </div>
                        <div className="btnsPanel">
                            <button className="material-icons btn" id="addVisit" onClick={this.onButtonClick} style={{ cursor: 'pointer' }}>add <span>Dodaj wizytę</span></button>
                            <button className="material-icons btn" id="deleteCustomer" onClick={this.onButtonClick} style={{ cursor: 'pointer' }}>delete <span>Usuń klienta</span></button>
                        </div>
                    </div>

                    <CustomerVisit id={this.props.match.params.id} addVisit={this.onButtonClick} customer={this.props.customer} />
                    {this.state.components.addVisit ? <AddVisit onClose={this.closeChild} id={this.props.match.params.id} /> : this.state.components.deleteCustomer ? <DeleteCustomer onClose={this.closeChild} customer={customer} id={this.props.match.params.id} props={this.props} /> : null}
                </div>
            )
        } else if (customer === undefined) {
            this.props.history.goBack();
            return (
                <div className="customerDetails">
                    <div className="customerHasBeenDeleted">
                        <p>Klient został usunięty.</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="customerDetails">
                    <div className="loadingCustomerDetailsPage">
                        <p>Wczytuję</p>
                    </div>
                </div>
            )
        }

    }


}

const mapDispatchToProps = (dispatch) => {
    return {
        createVisit: (id) => dispatch(createVisit(id)),
        deleteCustomer: (id) => dispatch(deleteCustomer(id))
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id
    const customers = state.firestore.data.customers
    const customer = customers ? customers[id] : null
    return {
        customer,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'customers' }
    ])
)(CustomerDetails)