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
export const PaddingBox = styled.div`
flex:1;
@media (max-width:1124px) {
  display:none;
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




export const ContentContainer = styled.div`
display:flex;
width:100%;
gap:10px;


`;
export const LeftImg = styled.img`
flex: 1;

@media (max-width: 1124px) {
// 테블릿 + 모바일
  display:none;
}
`;
export const RightBox = styled.div`
flex:2;

display:flex;
align-items:flex-start;
flex-direction:column;

padding-top:80px;
padding-bottom:80px;
padding-right:40px;
gap:40px;

@media (min-width: 768px) and (max-width: 1124px) {
  padding:80px 20px;
}
@media (max-width: 768px) {
  gap:20px;
  padding:0px;
}

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

export const Container = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

// 태블릿
@media (min-width: 768px) and (max-width: 1124px) {
  gap:10px;
}
// 모바일
@media (max-width: 768px) {
  padding:20px 10px;
  gap:60px;
}

`;

export const Frame1 = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

padding: 60px 0px; 
gap:60px;

@media (max-width:768px) {
  padding:20px 0px;
  gap:40px;
}
`
export const Frame2 = styled.div`

display:flex;
flex-direction:column;
align-items:center;

gap:10px;

@media (max-width:768px) {
gap:8px;
}
`
export const Title = styled.h2`
font-family: MaruBuri;
  font-weight: 700;
  font-style: normal;
  font-size: var(--display-lg, 24px);
  line-height: 100%;
  letter-spacing: 0;
  // text-align: center;

  color: var(--text-primary, #E9EAED);

  margin:0px;

  @media (max-width:768px){
    font-size: var(--display-lg, 18px);
    line-height: 180%;
  }
`;
export const SubTitle = styled.h3`
  font-family: MaruBuri;
  font-weight: 700;
  font-style: normal;
  font-size: var(--display-lg, 20px);
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;

  color: var(--text-primary, #E9EAED);

  margin:0px;
  @media (max-width:768px){
    font-size: var(--display-lg, 12px);
    line-height: 180%;
  }
`
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

export const StaffContainer = styled.div`
flex:2;

display:flex;
flex-direction:column;

gap:20px;

`;
export const StaffHeader = styled.div`
display:flex;
justify-content: space-between;
`;
export const StyledLink = styled(Link)`
display:flex;
align-items:flex-end;
gap:6px;
height:19px;
;`
export const StaffCredit = styled.div`
display:flex;
flex-direction:column;
gap:40px;
`;

export const StyledTeamItem = styled.div`
display:flex;
flex-direction:column;
gap:${({ isCD }) => (isCD ? "10px" : "8px")};
`;
export const TeamName = styled.span`

`;
export const TeamOneList = styled.div`
display:flex;
gap:12px;
`;
export const TeamOne = styled.span`

`;
export const StaffList2Row = styled.div`
display:flex;
gap:20px;
@media (max-width:1124px) {
gap:10px;
}
`;
export const StaffList = styled.div`
flex:1;
display:flex;
flex-direction:column;
    gap:40px;
`;
export const StampImg = styled.img`
@media (max-width:768px) {
display:none;
}
`
export const MapWrapper = styled.div`
width:100%;
padding:40px;
display:flex;
flex-direction:column;
gap:20px;

`;
export const MapBox = styled.div`
gap:20px;
`
export const StationInfo = styled.div`
display:flex;
@media (max-width:768px) {
flex-direction:column;
gap:12px;
}
`;
export const InfoBox = styled.div`
flex:1;
padding:12px;

display:flex;
flex-direction:column;

gap:12px;
`;
export const InfoTitle = styled.div`

`
export const Info = styled.div`
white-space: pre-line;
`