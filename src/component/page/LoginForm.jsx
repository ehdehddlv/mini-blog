import React, {useState} from 'react';
import styled from 'styled-components';
import LoginInputId from '../ui/LoginInputId';
import LoginInputPw from '../ui/LoginInputPw';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // border: 1px solid grey;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    // border: 1px solid red;

    & > * {
        :not(:last-child){
            margin-bottom: 16px;
        }
    }
`;

const ContentDiv = styled.div`
    display: flex;
    align-items: flex-end;
`;

const TitleDiv = styled.div`
    width: 100px;
    margin-right: 30px;
`;

function LoginForm(props){
    const [loginId, setLoginId] = useState("");
    const [loginPw, setLoginPw] = useState("");
    const navigate = useNavigate();
    
    const submit = async () => {
        console.log("loginId : "+loginId+" / loginPw : "+loginPw);
    
        if(loginId == ""){
            alert("아이디를 입력해주세요.");
            return;
        }else if(loginPw == ""){
            alert("비밀번호를 입력해주세요.");
            return;
        }

        axios.post("http://localhost:8080/auth/login", {
            logInId: loginId,
            password: loginPw
        })
        .then((response) => {
            console.log("LoginForm response : ", response);

            if(response.data == "") {
                alert("사용자 정보가 없습니다.");
                return;
            }
            const loginInfo = response.data.staffDto;
            localStorage.setItem("loginInfo", JSON.stringify(loginInfo));

            const jwtToken = response.headers.authorization;
            localStorage.setItem("jwtToken", jwtToken);
            
            navigate("/main");


        })
        .catch((error) => {
            console.log("api 호출 실패 : ", error);
            alert("api 호출 실패 : ", error);
        });


    
    }


    return (
        // <form onSubmit={submit}>
            <Wrapper>
                <Container>
                        <div>
                            <img 
                                style={{width: `100%`}}
                                src='https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2Fnb3xlbnwwfHwwfHx8MA%3D%3D' />
                        </div>
                    <ContentDiv>
                        <TitleDiv>
                            <label>아이디</label>
                        </TitleDiv>
                        <LoginInputId
                            width={500}
                            height={10}
                            value={loginId}
                            onChange={(e) => {
                                setLoginId(e.target.value);
                            }}
                        />
                    </ContentDiv>
                    <ContentDiv>
                        <TitleDiv>
                            <label>비밀번호</label>
                        </TitleDiv>
                        <LoginInputPw 
                            width={500}
                            height={10}
                            value={loginPw}
                            onChange={(e) => {
                                setLoginPw(e.target.value)
                            }}
                        />
                    </ContentDiv>

                    {/* <Button title={"로그인"} type="submit" /> */}
                    <Button title={"로그인"} onClick={submit} />

                </Container>
            </Wrapper>
        // </form>
    );
}

export default LoginForm;