import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid ${props => (props.repoError ? '#ff0000' : '#eee')};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit', // adiciona o tipo via css
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-content: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
  `}
`;

export const MessageError = styled.div`

  div {
    margin-top: ${props => props.messageError !== null ? '10px' : '0px' };
    padding: ${props => props.messageError !== null ? '15px 0' : '0px' };
    font-size: ${props => props.messageError !== null ? '20px' : '0px' };
    color: #FF0000;
  }
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    /* aplica o estilo em todos os item li menos no primeiro */
    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }

    button {
      background: none;
      color: #7159c1;
      text-decoration: none;
      padding:0!important;
      font: inherit;
      border: none;
      cursor: pointer;
    }
  }
`;


// border-radius: 4px;
// outline: 0;
// border: 0;
// padding: 8px;
// margin: 0 0 .25rem;

// position: absolute;
// bottom: 0;
// right: 0;
// display: inline-block;
// margin-left: -10px;
// margin-right: 4px;
// margin-bottom: 4px;
