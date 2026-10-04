import styled from "styled-components";
import { media } from "@/styles/media";
import Link from 'next/link';




export const TeaserWrapper = styled.div`
width:100%;
display:flex;
flex-direction:column;
@media (min-width:768px) and (max-width:1124px) {
  padding:80px 0px;
  gap:10px;
}
  @media (max-width:768px) {
  padding:0px 0px;
  gap:20px;
}
`;
export const TeaserCreditContainer = styled.div`
display:flex;

padding:40px 0px;
gap:10px;

@media (max-width:1124px) {
  padding:0px;
  gap:0px;
}
`;
export const TeaserCredit = styled.div`
flex:2;
display:flex;
flex-direction:column;
gap:20px;
padding-right:40px;

@media (min-width:768px) and (max-width:1124px) {
  padding:40px 20px;
  gap:40px;
}
@media (max-width:768px) {
  padding:0px;
  gap:20px;
}
`;
export const CreditBox = styled.div`
display:flex;
flex-direction:column;
gap:12px;

@media (max-width:768px) {
  display:none;
}

`;
export const CreditLine = styled.div`
display:flex;
gap:8px;
`;
export const CreditRole = styled.span`

`;
export const CreditName = styled.span`

`;
export const TeaserFilm = styled.div`
width:100%;
`;



export const Topic = styled.h3`
margin:0px;
color: var(--text-primary, #E9EAED);
  font-family: MaruBuri;
  font-size: var(--display-lg, 18px);
  font-style: normal;
  font-weight: 700;
 line-height: 180%;
  letter-spacing: 0;
`
export const Description = styled.div`
  width:100%;
  color: var(--text-primary, #E9EAED);
  font-family: MaruBuri;
  font-size: var(--display-lg, 14px);
  font-style: normal;
  font-weight: 400;
 line-height: 180%;
  letter-spacing: 0;

  white-space: pre-line;
`;







export const PosterMain = styled.img`
width:400px;


@media (max-width: 768px) {
  width:100%;
}
`
export const Banner = styled.img`
width:100%;
@media (max-width:768px) {
  display:none;
}
`;

export const StaffWrapper = styled.div`
width:100%;
display:flex;
flex-direction:row;
gap:10px;
padding:40px;
@media (min-width:768px) and (max-width:1124px) {
    padding:40px 20px;
}
@media (max-width:768px) {
padding:0px
}
`;

export const MapBox = styled.div`
gap:20px;
`
