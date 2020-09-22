import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import {deleteComment} from '../../actions/post';

const commentItem = ({auth,postId,comment:{_id,text,date,name,user,avatar},deleteComment}) => {
    return (
        <div className='post bg-white p-1 my-1'>
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className='round-img'
                        src={avatar}
                        alt=''
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className='my-1'>{text}</p>
                <p>Posted on<Moment format='YYYY/MM/DD'>{date}</Moment></p>
                {!auth.loading && user===auth.user._id &&(
                    <button onClick={e=>deleteComment(postId,_id)} type='button' className='btn btn-danger' >
                        <i className='fas fa-times' />
                    </button>
                )}
            </div>
        </div>
    )
}

commentItem.propTypes = {
    postId:PropTypes.number.isRequired,
    auth:PropTypes.object.isRequired,
    comment:PropTypes.object.isRequired,
    deleteComment:PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps,{deleteComment})(commentItem);
