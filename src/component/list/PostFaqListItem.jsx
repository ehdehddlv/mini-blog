import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: calc(100% - 32px);
    padding: 16px;
    display: flex;
    // flex-direction: column;
    flex-direction: row;
    align-item: center;
    border: 1px solid grey;
    border-radius: 8px;
    cursor: pointer;
    background: white;
    // :hover{
    //     background: lightgrey;
    // }
    margin-bottom: 20px;
`;

const WrapperContent = styled.div`
    width: calc(100% - 32px);
    :hover{
        background: lightgrey;
    }
`;

const TitleText = styled.p`
    font-size: 20px;
    font-weight: 500;
`;

const CheckBox = styled.input.attrs({
    type: "checkbox"
})`
    margin-right: 20px;
`;

function PostFaqListItem(props){
    const {post, onClick, onChange} = props;
    // const {post} = props;

    const [checkedValues, setCheckedValues] = useState([]);

    const checkboxChangeHandler = (e) => {
        const {value, checked} = e.target;

        console.log("checkboxChangeHandler value : ", value);
        // if(checked){
        //     setCheckedValues(value);
        // }else{
        //     setCheckedValues(checkedValues.filter((item) => item !== value));
        // }

        // onChange(checkedValues);

        // 1.
        let updatedValues = [];
    
        if(checked){
            updatedValues.push(...checkedValues, value); // = [...checkedValues, value];
            console.log("체크한 updatedValues : ", updatedValues);
        }else{
            updatedValues = checkedValues.filter((item) => item !== value);
            console.log("체크해제한 updatedValues : ", updatedValues);
        }

        console.log("마지막 updatedValues : ", updatedValues);
        
        setCheckedValues(updatedValues);

        onChange(updatedValues);


        // 2.
        // setCheckedValues((preUpdateValues) => {
        //     let updatedValues;
    
        //     if(checked){
        //         updatedValues = [...preUpdateValues, value];
        //         console.log("체크한 updatedValues : ", updatedValues);
        //     }else{
        //         updatedValues = preUpdateValues.filter((item) => item !== value);
        //         console.log("체크해제한 updatedValues : ", updatedValues);
        //     }
    
        //     console.log("마지막 updatedValues : ", updatedValues);
            
        //     onChange(updatedValues);
            
        //     return updatedValues;
        // });
        
    };

    return (
        <Wrapper>
            <CheckBox value={post.faqItemSeqn} onChange={checkboxChangeHandler} />
            <WrapperContent onClick={onClick}>
                <TitleText>[{post.faqItemCtgrNm}] {post.faqItemTitl}</TitleText>

            </WrapperContent>
        </Wrapper>
    );
}

export default PostFaqListItem;