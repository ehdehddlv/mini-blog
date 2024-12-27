import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import apiClient from '../../apiClient';
import qs from 'qs';
import Input from '../ui/Input';
import TextInput from '../ui/TextInput';

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

const FaqLabel = styled.label`
    font-size: 22px;
    margin-right: 20px;
`;

const CtgrSelect = styled.select`
    width: 100px;
    height: 40px;
    font-size: 18px;
`;

const ContentDiv = styled.div`
    margin-bottom: 20px;
`;


function PostFaqWritePage(props){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        faqItemSeqn: null,
        faqItemTitl: "",
        faqItemCntn: "",
        faqItemCtgrSeqn: 1,
        uperFixiYn: "N",
        psupYn: "N",
        crtrId: "anonymous",
        edirId: "anonymous"
    });

    // 사용안함
    // const [faqTitle, setFaqTitle] = useState("");
    // const [faqContent, setFaqContent] = useState("");
    // const [faqCtgrSeqn, setFaqCtgrSeqn] = useState({faqItemCtgrSeqn: 1});
    // const [uperFixiYn, setUperFixiYn] = useState({uperFixiYn: "N"});
    // const [psupYn, setPsupYn] = useState({psupYn: "N"});

    const [faqCtgrList, setFaqCtgrList] = useState([]);
    const uperFixOp = ["Y", "N"];
    // const uperFixHandleChange = (value) => {
    //     setUperFixiYn((preValue) => (preValue === value ? "" : value));
    //     // setUperFixiYn(value.target.value);
    //     console.log("uperFixiYn : "+uperFixiYn);
    // }
    const psupYnOp = ["Y", "N"];

    const [userInfo, setUserInfo] = useState([]);

    const isFetched = useRef(false);
    const updateFlag = useRef(false);

    useEffect(() => {
        if(isFetched.current) return;
        isFetched.current = true;

        setUserInfo(JSON.parse(localStorage.getItem("loginInfo")));
        
        apiClient.get("http://localhost:8080/faqCtgr/r-faqitemctgrs")
        .then((response) => {
            console.log("PostFaqWritePage r-faqitemctgrs response : ", response);
            setFaqCtgrList(response.data.data);
        })
        .catch((error) => {
            console.log("api 호출 오류 : ", error);
        });

        // 수정 시 데이터 세팅
        const faqItemSeqn = sessionStorage.getItem("faqItemSeqn");
        console.log("faqItemSeqn : ", faqItemSeqn);
        
        if(faqItemSeqn !== ""){

            apiClient.get(`http://localhost:8080/faq/r-faqitems/admn/${faqItemSeqn}`)
            .then((response) => {
                console.log("PostFaqViewPage response : ", response);

                updateFlag.current = true;

                setFormData((preValue) => ({
                    ...preValue,
                    faqItemSeqn: response.data.data.faqItemSeqn,
                    faqItemTitl: response.data.data.faqItemTitl,
                    faqItemCntn: response.data.data.faqItemCntn,
                    faqItemCtgrSeqn: response.data.data.faqItemCtgrSeqn,
                    uperFixiYn: response.data.data.uperFixiYn,
                    psupYn: response.data.data.psupYn
                }));


            }).catch((error) => {
                console.log("api 호출 오류 : ", error);
            });

        }else{
            updateFlag.current = false;
        }


    }, []);

    const submitHandler = () => {
        
        // console.log("submit : ", faqTitle, faqContent, faqCtgrSeqn, uperFixiYn, psupYn);
        console.log("updateFlag : ", updateFlag);
        console.log("submit2 : ", formData);

        // return;
        if(formData.faqItemTitl === null || formData.faqItemTitl === "") {
            alert("제목을 입력해주세요.");
            return;
        }
        else if(formData.faqItemCntn === null || formData.faqItemCntn === ""){
            alert("내용을 입력해주세요.");
            return;
        }

        const apiCreateFaq = async () => {
            const method = updateFlag ? apiClient.post : apiClient.put;
            const url = updateFlag ? "c-faqitems" : "u-faqitems";
            
            await method(`http://localhost:8080/faq/${url}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                console.log("PostFaqWritePage faqitems response : ", response);
                navigate("/main");
            })
            .catch((error) => {
                console.log("api 호출 오류 : ", error);
            });
        } 

        apiCreateFaq();
    }

    const changeHandler = (e) => {
        const {name, value} = e.target;

        if(name === "ctgr") { // 카테고리 일 때 int형 변경
            console.log("ctgr");
            setFormData((preValue) => ({
                ...preValue,    // 기존값 유지
                [name]:parseInt(value) // 변경값 반영
            }));
        }else{ // 그외
            console.log("ctgr no");
            setFormData((preValue) => ({
                ...preValue,
                [name]:value
            }));

        }

        setFormData((preValue) => ({ // crtrId, edirId 세팅
            ...preValue,
            crtrId: userInfo.staffName,
            edirId: userInfo.staffName
        }));

        // setFormData((preValue) => ({ // crtrId 세팅
        //     ...preValue,
        //     ["crtrId"]:userInfo.staffName
        // }));
        // setFormData((preValue) => ({ // edirId 세팅
        //     ...preValue,
        //     ["edirId"]:userInfo.staffName
        // }));


    }

    return (
        <Wrapper>
            <Container>
                <Button 
                    title={"뒤로가기"}
                    onClick={() => {
                        navigate("/main");
                    }}
                />

                <ContentDiv>
                    <FaqLabel>제목</FaqLabel>
                    <Input 
                        width={300}
                        height={10}
                        placeholder={"제목을 입력해주세요."}
                        // onChange={(e) => setFaqTitle(e.target.value)}
                        onChange={(e) => changeHandler(e)}
                        name={"faqItemTitl"}
                        value={formData.faqItemTitl}
                    />
                </ContentDiv>
                <ContentDiv>
                    <FaqLabel>내용</FaqLabel>
                    <TextInput 
                        height={300}
                        placeholder={"내용을 입력해주세요."}
                        // onChange={(e) => setFaqContent(e.target.value)}
                        onChange={(e) => changeHandler(e)}
                        name={"faqItemCntn"}
                        value={formData.faqItemCntn}
                    />
                </ContentDiv>
                <ContentDiv>
                    <FaqLabel>카테고리</FaqLabel>
                    {/* <CtgrSelect name='ctgr' value={faqCtgrSeqn} onChange={(e) => setFaqCtgrSeqn(e.target.value)}> */}
                    <CtgrSelect name='faqItemCtgrSeqn' value={formData.faqItemCtgrSeqn} onChange={(e) => changeHandler(e)}>
                        {faqCtgrList.map((list) => {
                            return (
                                <option key={list.faqItemCtgrSeqn} value={list.faqItemCtgrSeqn}>
                                    {list.faqItemCtgrNm}
                                </option>
                            )
                        })}
                    </CtgrSelect>
                </ContentDiv>
                <ContentDiv>
                    <FaqLabel>상단고정 여부</FaqLabel>
                    {uperFixOp.map((op) => {
                        return (
                            <label key={op}>
                                {op}
                                <input 
                                    type='radio'
                                    value={op}
                                    name='uperFixiYn'
                                    // checked={uperFixiYn === op}
                                    checked={formData.uperFixiYn === op}
                                    // onChange={() => uperFixHandleChange(op)}
                                    // onChange={() => setUperFixiYn(op)}
                                    onChange={(e) => changeHandler(e)}
                                />
                            </label>
                        );
                    })}
                </ContentDiv>
                <ContentDiv>
                    <FaqLabel>표시 여부</FaqLabel>
                    {psupYnOp.map((op) => (
                        <label key={op}>
                            {op}
                            <input 
                                type='radio'
                                value={op}
                                name='psupYn'
                                // checked={psupYn === op}
                                checked={formData.psupYn === op}
                                // onChange={() => setPsupYn(op)}
                                onChange={(e) => changeHandler(e)}
                            />
                        </label>
                    ))}
                </ContentDiv>
                
                <Button 
                    title={{updateFlag} ? "저장" : "수정"}
                    onClick={submitHandler}
                />
                    
            </Container>
        </Wrapper>
    );

}

export default PostFaqWritePage;