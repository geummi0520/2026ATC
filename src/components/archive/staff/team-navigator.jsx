"use client";

import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import Link from 'next/link';


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
                console.log(idx == selectedTeam)
            ))}
            {teamList.map((teamName, idx) => (
                <TeamButton
                    key={idx}
                    teamName={teamName}
                    isSelected={selectedTeam == idx}
                    changeTeam={() => changeTeam(idx)}
                />
            ))}
        </Container>
    );
}

const Container = styled.div`
display:flex;
flex-direction:column;
align-items: flex-end;
gap:1rem;

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
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ $isSelected, theme }) =>
        $isSelected ? theme.text.brand : theme.text.quaternary};
  font-weight: ${({ $isSelected, theme }) => ($isSelected ? "700" : "400")};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
  cursor: pointer;
`;