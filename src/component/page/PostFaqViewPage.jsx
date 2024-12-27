import React, {useEffect, useState, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import axios from 'axios';
import qs from 'qs';
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

    & > * {
        :not(:last-child){
            margin-bottom: 16px;
        }
    }
`;

const PostContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
`;

const TitleText = styled.p`
    font-size: 28px;
    font-weight: 500;
`;

const ContentText = styled.p`
    font-size: 20px;
    line-height: 32px;
    white-space: pre-wrap;
`;



function PostFaqViewPage(props){
    const naigate = useNavigate();

    const {faqSeqn} = useParams();
    const [faqItem, setFaqItem] = useState({});
    const isFetched = useRef(false);

    const [delFaqItemSeqn, setDelFaqItemSeqn] = useState([]);


    useEffect(() => {
        if(isFetched.current) return;
        isFetched.current = true;

        // const params = {
        //     faqItemSeqn: faqItemSeqn
        // }

        apiClient.get(`http://localhost:8080/faq/r-faqitems/admn/${faqSeqn}`,{
            // params,
            // paramsSerializer: (params) => {
            //     return qs.stringify(params, {arrayFormat: "brackets"});
            // }
        })
        .then((response) => {
            console.log("PostFaqViewPage response : ", response);
            setFaqItem(response.data.data);
            setDelFaqItemSeqn([faqSeqn]);
            // setDelFaqItemSeqn([parseInt(faqSeqn)]);
        }).catch((error) => {
            console.log("api 호출 오류 : ", error);
        })

    }, []);

    // const post = list.find((item) => {
    //     return list.faqItemSeqn == faqItemSeqn;
    // });

    // function dateTime(dt){
    //     return dt.substring(0, 10) + " " + dt.substring(11);
    // }

    const updateFaq = () => {
        sessionStorage.setItem("faqItemSeqn", faqSeqn);
        
        naigate("/post-faq-write");
    }

    const deleteFaq = async () => {
        console.log("del faqItemSeqn : ", delFaqItemSeqn);

        //const confirm = window.confirm("삭제하시겠습니까?");
        if(window.confirm("삭제하시겠습니까?")){
            await apiClient.delete("http://localhost:8080/faq/d-faqitems", {
                data: delFaqItemSeqn,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                console.log("PostFaqViewPage d-faqitems response : ". response);
                naigate("/main");
            })
            .catch((error) => {
                console.log("api 호출 오류 : ", error);
            });
        }
    }

    const dateFormat = (date) => {
        return date?.replace('T', ' ');
    }

    return(
        <Wrapper>
            <Container>
                <Button 
                    title={"뒤로가기"}
                    onClick={() => {
                        naigate("/main");
                    }}
                />

                <Button 
                    title={"수정"}
                    onClick={updateFaq}
                    bgcolor={"lightgreen"}
                />

                <Button 
                    title={"삭제"}
                    onClick={deleteFaq}
                    bgcolor={"red"}
                    color={"white"}
                />

                <PostContainer>
                    <TitleText>{faqItem.faqItemTitl}</TitleText>
                    <ContentText>{faqItem.faqItemCntn}</ContentText>
                    {/* <ContentText>{dateTime(faqItem.crteTmsp)}</ContentText> */}
                    <ContentText>상단여부 : {faqItem.uperFixiYn == "Y" ? "예" : "아니요"}</ContentText>
                    <ContentText>표시여부 : {faqItem.psupYn}</ContentText>
                    {/* <ContentText>생성일시 : {faqItem.crteTmsp?.replace('T', ' ')}</ContentText> */}
                    <ContentText>생성일시 : {dateFormat(faqItem.crteTmsp)}</ContentText>
                </PostContainer>
            </Container>
        </Wrapper>
    );

}

export default PostFaqViewPage;