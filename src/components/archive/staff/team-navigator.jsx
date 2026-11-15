"use client";

import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";


export default function TeamNavigator({
    teamList,
    selectedTeam,
    changeTeam,
}) {
    const { translate } = useTranslation();
    console.log(selectedTeam)
    return (
        <Container>
            {teamList.map((teamName, idx) => (
                <ButtonBox key={idx}>
                    <TeamButton
                        key={idx}
                        teamName={translate(teamName)}
                        isSelected={selectedTeam == idx}
                        changeTeam={() => changeTeam(idx)}
                    />
                </ButtonBox>
            ))}
        </Container>
    );
}

const Container = styled.div`
display: inline-grid;
height: 73px;
grid-template-rows: repeat(2,minmax(0,1fr));
grid-template-columns: repeat(4,fit-content(100%));
grid-auto-flow: row;

${media.mobile`
    display:none;
    `}
`;

const ButtonBox = styled.div`
display: flex;
padding: 10px 16px;
justify-content: flex-end;
align-items: center;
gap: 10px;
align-self: stretch;
grid-row: span 1;
grid-column: span 1;
justify-self: stretch;
`;

function TeamButton({ teamName, isSelected, changeTeam }) {
    console.log(isSelected)
    return (
        <StyledButton
            $isSelected={isSelected}
            onClick={changeTeam}
        >{teamName}
        </StyledButton>
    );
}

const StyledButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: ${({ $isSelected, theme }) =>
        $isSelected ? " 1px solid currentColor" : "none"};
//   border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ $isSelected, theme }) =>
        $isSelected ? theme.text.brand : theme.text.quaternary};
  font-weight: ${({ $isSelected, theme }) => ($isSelected ? "700" : "400")};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
  cursor: pointer;
`;