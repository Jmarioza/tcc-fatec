import styled from '@emotion/styled'

export const Container = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
