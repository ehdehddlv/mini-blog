import React from 'react';
import styled from 'styled-components';
import PostFaqListItem from './PostFaqListItem';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    // & > * {
    //     :not(:last-child){
    //         margin-bottom: 16px;
    //     }
    // }
`;

function PostFaqList(props){
    const {posts, onClickItem, onChangeItem} = props;
    // const {posts} = props;

    console.log("PostFaqList -> posts : ", posts);

    return (
        <Wrapper>
            {posts.map((post, index) => {
                return (
                    <PostFaqListItem
                        key={post.faqItemSeqn}
                        post={post}
                        onClick={() => {
                            onClickItem(post);
                        }}
                        onChange={onChangeItem}
                    />
                );
            })}
        </Wrapper>
    );

}

export default PostFaqList;