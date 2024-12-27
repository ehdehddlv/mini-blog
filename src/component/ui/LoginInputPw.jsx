import React from 'react';
import styled from 'styled-components';

const StyledLoginInputPw = styled.input.attrs({
    type: "password"
})`
    ${(props) => 
        props.width &&
        `width: ${props.width}px;`
    }
    ${(props) =>
        props.height &&
        `height: ${props.height}px;`
    }
    padding: 16px;
    font-size: 16px;
    line-height: 20px;
`;

function LoginInputPw(props){
    const {width, height, value, onChange} = props;

    return (
        <StyledLoginInputPw 
            width={width}
            height={height}
            value={value}
            onChange={onChange}
        />
    );
}

export default LoginInputPw;