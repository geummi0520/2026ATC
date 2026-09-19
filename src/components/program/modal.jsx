import styled from "styled-components";
import { programs } from "@/data/program";
import { useState } from "react";


export default function ProgramModal({ }) {

    return (
        <BluredBackground>
            <ModalFrame>
                <ModalImg />
            </ModalFrame>
        </BluredBackground>
    );
}

const BluredBackground = styled.div`

`;
const ModalFrame = styled.div`

`
const ModalImg = styled.img`

`