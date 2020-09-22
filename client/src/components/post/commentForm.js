import React,{useState} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addComment} from '../../actions/post';

const commentForm = ({postId,addComment}) => {
    const [text,setText]=useState('');
    return (
        <div className='post-form' >
            <div className='bg-primary p' >
                <h3>Leave a comment...</h3>
                <form className='form my-1' onSubmit={e=>{
                    e.preventDefault();
                    addComment(postId,{text});
                    setText('');
                }}  >
                    <textarea
                        name='text'
                        cols='30'
                        rows='5'
                        placeholder='Mention a comment'
                        value={text}
                        onChange={e=>setText(e.target.value)}
                        required
                    />
                    <input type='submit' className='btn btn-dark my-1' value='submit' />
                </form>
            </div>
        </div>
    )
}

commentForm.propTypes = {
    addComment:PropTypes.func.isRequired,
}

export default connect(null,{addComment})(commentForm);
