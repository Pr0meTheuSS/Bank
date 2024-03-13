import React from 'react';
import styled from 'styled-components';
import './Header.css';

const Header = () => {
  return (
    <div className='div-welcome-header'>
      <h1 className='welcome-header1'>Добро пожаловать в наш банк</h1>
      <h2 className='welcome-header2'>Ваш надежный финансовый партнер</h2>
    </div>
  );
};


const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #666;
`;

export default Header;
