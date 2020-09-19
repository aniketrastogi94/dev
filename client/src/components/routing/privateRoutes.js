import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route,Redirect} from 'react-router-dom';

const privateRoutes = ({component:Component,auth:{isAuthenticated,loading},...rest}) => (
    <Route
        {...rest} 
        render={props=>!isAuthenticated && !loading ? (<Redirect to='/login' />) : (<Component {...props} />) }
    />
);

privateRoutes.propTypes = {
    auth:PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(privateRoutes);