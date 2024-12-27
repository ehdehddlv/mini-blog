import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
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

function Input(props){
    const {width, height, value, placeholder, onChange, name} = props;

    return (
        <StyledInput
            width={width}
            height={height}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            name={name}
        />
    );

}

export default Input;