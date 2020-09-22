import React ,{Fragment, useEffect }from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getProfileById} from '../../actions/profile';
import Spinner from '../../components/layout/Spinner';
import ProfileTop from './profileTop.js';
import ProfileAbout from './profileAbout';
import ProfileExp from './profileExp';
import ProfileEdu from './profileEducation';
import ProfileGithub from './profilegit';

const Profile = ({match,profile:{profile,loading},auth,getProfileById}) => {
    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById,match.params.id]);
    return (
        <Fragment>
            {profile===null || loading ? <Spinner/> : <Fragment>
                <Link to='/profiles' className='btn btn-light' >Back to profiles</Link>
                {auth.isAuthenticated && 
                auth.loading===false && 
                auth.user._id===profile.user._id &&
                (<Link to='/edit-profile' className='btn btn-dark' >Edit Profile</Link>) }
                <div className='profile-grid my-1' >
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />
                    <div className='profile-exp bg-white p-2' >
                        <h2 className='text-primary' >Experience</h2>
                        {profile.experience.length>0 ? (
                            <Fragment>{
                                profile.experience.map((exp)=>(
                                    <ProfileExp key={exp._id} experience={exp} />
                            ))
                            }</Fragment>
                            
                        ) : <h4>No Experience Credentials</h4>}
                    </div>
                    <div className='profile-edu bg-white p-2' >
                        <h2 className='text-primary' >Education</h2>
                        {profile.education.length>0 ? (
                            <Fragment>{
                                profile.education.map((exp)=>(
                                    <ProfileEdu key={exp._id} education={exp} />
                            ))
                            }</Fragment>
                            
                        ) : <h4>No Education Credentials</h4>}
                    </div>
                    {
                        profile.githubusername && (<ProfileGithub username={profile.githubusername} />)
                    }
                </div>
            </Fragment> }
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile,
        auth:state.auth
    }
}

export default connect(mapStateToProps,{getProfileById})(Profile);
