import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { clearSession, getAccessToken } from '../utils/auth';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background-color: ${colors.white};
  font-family: 'Inter', sans-serif;
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 342px;
  margin: 0 auto;
  padding: 47px 24px 40px;
  box-sizing: border-box;
`;

const SectionLabel = styled.p`
  margin: 0 0 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${colors.label};
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(173, 173, 173, 0.4);
  border-radius: 18px;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: ${(props) =>
    props.isLast ? 'none' : '1px solid rgba(173, 173, 173, 0.3)'};
`;

const RowLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: ${colors.label};
`;

const RowValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 11px;
  color: rgba(108, 112, 117, 0.7);
`;

const RowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NameInput = styled.input`
  width: 120px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid ${colors.accent};
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: ${colors.label};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.body};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const NameError = styled.p`
  margin: 6px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: ${colors.error};
  text-align: right;
`;

const RowLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 11px;
  color: rgba(108, 112, 117, 0.7);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
`;

function LogoutIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3.2H3.3a1 1 0 0 0-1 1v9.6a1 1 0 0 0 1 1H7"
        stroke={colors.label}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8 12L14.7 8.5L10.8 5"
        stroke={colors.label}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7 8.5H5.8"
        stroke={colors.label}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 2.5L15.5 6.5L6 16H2V12L11.5 2.5Z"
        stroke={colors.accent}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke={colors.body}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MyInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function fetchMe() {
      const response = await fetch('/api/me');
      const result = await response.json();

      if (!ignore && result.success) {
        setUser(result.data);
      }
    }

    fetchMe();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const startEditingName = () => {
    setNameInput(user?.name ?? '');
    setNameError('');
    setIsEditingName(true);
    requestAnimationFrame(() => nameInputRef.current?.focus());
  };

  const handleSaveName = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setNameError('');

    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ name: nameInput }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setNameError(
          result.errors?.[0]?.message ?? '이름 변경에 실패했습니다.',
        );
        return;
      }

      setUser(result.data);
      setIsEditingName(false);
    } catch {
      setNameError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar
          title="내 정보"
          onBack={() => navigate(-1)}
          style={{ marginBottom: '34px' }}
        />

        <SectionLabel>내 계정</SectionLabel>

        <Card>
          <Row>
            <RowLabel>이름</RowLabel>
            {isEditingName ? (
              <RowRight>
                <NameInput
                  ref={nameInputRef}
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSaveName();
                  }}
                  maxLength={50}
                />
                <IconButton
                  type="button"
                  aria-label="이름 저장"
                  onClick={handleSaveName}
                  disabled={isSaving}
                >
                  <CheckIcon />
                </IconButton>
              </RowRight>
            ) : (
              <RowRight>
                <RowValue>{user?.name ?? ''}</RowValue>
                <IconButton
                  type="button"
                  aria-label="이름 수정"
                  onClick={startEditingName}
                >
                  <EditIcon />
                </IconButton>
              </RowRight>
            )}
          </Row>
          <Row>
            <RowLabel>이메일</RowLabel>
            <RowLink href={`mailto:${user?.email ?? ''}`}>
              {user?.email ?? ''}
            </RowLink>
          </Row>
          <Row isLast>
            <LogoutButton type="button" onClick={handleLogout}>
              <RowLabel>로그아웃</RowLabel>
              <LogoutIcon />
            </LogoutButton>
          </Row>
        </Card>
        {nameError && <NameError>{nameError}</NameError>}
      </Content>
    </Page>
  );
}

export default MyInfo;
