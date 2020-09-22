import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import {getPosts} from '../../actions/post';
import PostItem from './postitem';
import PostForm from './postForm';

const Posts = ({getPosts,post:{posts,loading}}) => {
    useEffect(() => {
        getPosts()
    }, [getPosts]);
    return loading ? <Spinner/> : <Fragment>
        <h1 className='large text-primary' >Posts</h1>
        <p className='lead' >
            <i className='fas fa-user' />Welcome to the community
        </p>
        <PostForm/>
        <div className='posts' >
        {posts.map(post=>(
            <PostItem key={post._id} post={post}/>
        ))}
        </div>
        
    </Fragment>;
}

Posts.propTypes = {
    getPosts:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    return {
        post: state.post
    }
}

export default connect(mapStateToProps,{getPosts})(Posts);
