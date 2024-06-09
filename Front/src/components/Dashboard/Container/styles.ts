import styled from '@emotion/styled'

export const DashboardContainer = styled.div`
  margin: 2rem 0;
`

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #aaa;
`
export const DashboardTitleContainer = styled.div`
  display: flex;
  align-items: center;
`

export const DashboardTitle = styled.h3`
  font-size: 18px/20px;
  font-weight: 500;
  padding-right: 0.5rem;
  border-right: 2px solid #aaa;
`

export const DashboardDate = styled.span`
  padding-left: 0.5rem;

  strong: {
    font-weight: 200;
  }
`

export const DashboardActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 28rem;
`
