import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import MainPage from './component/page/MainPage';
import PostViewPage from './component/page/PostViewPage';
import PostWritePage from './component/page/PostWritePage';
import PostFaqViewPage from './component/page/PostFaqViewPage';
import PostFaqWritePage from './component/page/PostFaqWritePage';
import LoginForm from './component/page/LoginForm';

const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
`;

function App(props) {
  return (
      <BrowserRouter>
          <MainTitleText>SJH 미니 카페</MainTitleText>
          <Routes>
              {/* <Route index element={<MainPage />} /> */}
              <Route index element={<LoginForm />} />
              <Route path='main' element={<MainPage />} />
              <Route path='post-write' element={<PostWritePage />} />
              <Route path='post/:postId' element={<PostViewPage />} />
              <Route path='post-faq/:faqSeqn' element={<PostFaqViewPage />} />
              <Route path='post-faq-write' element={<PostFaqWritePage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
