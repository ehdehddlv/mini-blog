import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    padding: 8px 16px;
    font-size: 16px;
    border-width: 1px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 16px;
    ${(props) => 
        props.$bgcolor &&
        `background-color: ${props.$bgcolor};`
    }
    ${(props) => 
        props.color &&
        `color: ${props.color};`
    }
`;

function Button(props){
    const {title, onClick, bgcolor, color} = props;

    return (
        <StyledButton 
            onClick={onClick} 
            $bgcolor={bgcolor} // bgcolor는 DOM 표준속성이 아니기 때문에 접두사 $로
                                // Styled-components 내부에서만 사용(DOM 전달X)
            color={color}
        >{title || "button"}</StyledButton>
    );
}

export default Button; 