import styled    from 'styled-components';
import { color } from './vars';
import images    from '../misc/snippetImage'

const randomBgImage = images[Math.floor(Math.random() * images.length)];

const computeBackground = (props) => {
  if (!!props.randomBg) return `url(${randomBgImage});`
  if (!!props.bgImage)  return `url(${props.bgImage});`
}

export const Container = (styled.div`
  width:      1920px;
  height:     1080px;
  background: ${color.violet};

  background-image: ${props => computeBackground(props)};
  background-size: cover;
  background-position: center;
`);

export const Overlay = (styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  border-radius: inherit;
`);

export const RandomBgImage = (styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:  100%;
  height: 100%;
  background-color:    ${color.black};
  box-sizing:          border-box;
  padding:             100px;
  background-image:    url(${randomBgImage});
  background-size:     cover;
  background-position: center;

  &::before {
    content: '';
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  } 
`);