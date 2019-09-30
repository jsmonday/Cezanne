import styled    from 'styled-components';
import { color } from './vars';

const fontSize = (size) => {
  switch (size) {
    case 'big':
      return '72px';
    case 'medium':
    default:
      return '56px';
  }
}

export const Title = (styled.h1`
  background: #fff;
  width: ${props => props.width || '920px'};
  margin-bottom: 20px;
  padding: 25px;
  box-sizing: border-box;
  border-radius: 15px;
  box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.5);

  color: ${color.textDark};
  font-size: ${props => fontSize(props.fontSize)};
  line-height: ${props => fontSize(props.fontSize)};
  font-weight: 900;
  text-transform: uppercase;
  z-index: 1;
`);