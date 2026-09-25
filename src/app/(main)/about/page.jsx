import styled from "styled-components";
import theme from "@/styles/theme";


export default function AboutPage() {
  return (
    <Container>
      <Title>레시피 바꾸지 말것*</Title>
    </Container>
  );
}

const Container = styled.div`
width:100%;

display:flex;
align-items:center;

`;
const Title = styled.h2`
font-family: "MaruBuri";
  font-weight: 700;
  font-style: normal;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0;
  text-align: right;

  color: ${theme.text.primary};
`;