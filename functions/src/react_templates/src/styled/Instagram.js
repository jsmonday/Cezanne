import styled    from 'styled-components';
import { color, boxShadow } from './vars';
import images from '../misc/snippetImage'

const randomBgImage = images[Math.floor(Math.random() * images.length)];

export const InnerPost = (styled.div`
  width:  100%;
  height: 100%;
  background-color:    ${color.black};
  border-radius:       23px;
  box-shadow:          ${boxShadow.default};
  box-sizing:          border-box;
  padding:             40px;
  background-image:    url(${randomBgImage});
  background-size:     cover;
  background-position: center;

  &::before {
    content: '';
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 40px;
    left: 40px;
    width: 1000px;
    height: 1000px;
    border-radius: inherit;
  } 
`);

export const Post = (styled.div`
  width:  1080px;
  height: 1080px;
  padding:  40px;
  box-sizing: border-box;
  background-color: ${color.violet}
`);

export default {
  Post,
  InnerPost
}