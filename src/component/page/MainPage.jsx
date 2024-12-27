import React, {useEffect, useState, useRef} from 'react';
import { isCookie, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PostList from '../list/PostList';
import Button from '../ui/Button';
import data from '../../data.json';
import axios from 'axios';
import qs from 'qs';
import PostFaqList from '../list/PostFaqList';
import apiClient from '../../apiClient';

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    // & > * {
    //     :not(:last-child){
    //         margin-bottom: 16px;
    //     }
    // }
`;

const ContainerBtn = styled.div`
    width: 54%;
    display: flex;
    justify-content: space-between;
`;
const welcome = {
    display: "flex", alignItems: "baseline"
}

function MainPage(props){
    const {} = props;

    const navigate = useNavigate();

    const [useInfo, setUserInfo] = useState([]);

    const [fList, setFList] = useState([]);
    const isFetched = useRef(false); // 중복 호출 방지

    const [selectedDelFaqs, setSelectedDelFaqs] = useState([]);

    useEffect(() => {
        if(isFetched.current) return;
        isFetched.current = true;

        setUserInfo(JSON.parse(localStorage.getItem("loginInfo")));

        const apiFaqList = async () => {
            try {
                const params = {
                    faqItemCtgrList: [1, 2, 3],
                    psupSttsCdList: ["Y", "N"],
                    uperFixiSttsCdList: ["Y", "N"],
                    srchWord: "",
                    rgstFromDate: "20240717",
                    rgstToDate: "20241231"
                }
        
                const response = await apiClient.get("http://localhost:8080/faq/r-faqitems/admn", {
                    params,
                    paramsSerializer: (params) => {
                        return qs.stringify(params, {arrayFormat: "brackets"});
                    }
                });

                console.log("response : ", response);
                console.log("data : ", response.data.data.content);
                setFList(response.data.data.content || []); // 값이 없으면 [] 세팅
                
                // .get("http://localhost:8080/notice/noticeList")
        
                // .then((response) => {
                //     console.log("response : ", response);
                //     console.log("data : ", response.data.data.content);
                //     setFList(response.data.data.content || []);
                // })
                // .catch((error) => {
                //     console.log("error : ", error);
                // });

            } catch (error) {
                console.log("api 호출 오류 : ", error);
                if(error.response.data.status === 401 || error.response.data.status === 403){
                    alert(`권한이 없습니다.(${error.response.data.message})`);
                    navigate("/");
                }
            }
        }

        sessionStorage.setItem("faqItemSeqn", "");

        apiFaqList();
        
    }, []);

    const logout = () => {
        const refreshToken = localStorage.getItem("jwtToken");
        document.cookie = `refreshToken='${refreshToken}'; path=/;`;
        
        apiClient.post("http://localhost:8080/auth/logout", {
            withCredentials: true
        })
        .then((response) => {
            navigate("/");
        })
        .catch((error) => {
            alert("로그아웃에 실패하였습니다.");
        });
    }

    const delCheckboxHandler = (values) => {
        console.log("이거탐? delCheckboxHandler : ", values);
        setSelectedDelFaqs(values);
    }

    const deleteFaq = () => {
        console.log("deleteFaq : ", selectedDelFaqs);
    }

    return (
        <Wrapper>
            <ContainerBtn>
                <Button
                    title={"글 작성하기"}
                    onClick={() => {
                        // navigate("/post-write");
                        navigate("/post-faq-write");
                    }}
                />
                <Button 
                    title={"삭제"}
                    onClick={deleteFaq}
                    bgcolor={"red"}
                    color={"white"}
                />
                <div style={welcome}>
                    <div style={{marginRight: "10px"}}>
                        <b>{useInfo.staffName}</b>님 환영합니다!
                    </div>
                    <Button 
                        title={"로그아웃"}
                        onClick={logout}
                    />
                </div>

            </ContainerBtn>
            <Container>

                {/* <PostList
                    posts={data}
                    onClickItem={(item) => {
                        navigate(`/post/${item.id}`);
                    }}
                /> */}

                <PostFaqList
                    posts={fList}
                    onClickItem={(item) => {
                        navigate(`/post-faq/${item.faqItemSeqn}`);
                    }}
                    onChangeItem={delCheckboxHandler}
                />

            </Container>
        </Wrapper>
    );
}

export default MainPage;