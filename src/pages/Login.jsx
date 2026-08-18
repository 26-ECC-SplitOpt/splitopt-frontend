import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import { colors } from '../styles/colors';
import {
  Field,
  Label,
  Input,
  SubmitButton,
  ErrorText,
  FieldError,
} from '../styles/authForm';
import { setSession } from '../utils/auth';
import { apiFetch } from '../utils/api';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  align-items: center;
  width: 100%;
  max-width: 342px;
  padding: 129px 24px 40px;
  box-sizing: border-box;
`;

const BigLogo = styled.p`
  margin: 0 0 86px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 50px;
  color: ${colors.dark};

  span {
    color: ${colors.accent};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SignupText = styled.p`
  margin: 29px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: ${colors.body};
`;

const SignupLink = styled(Link)`
  font-weight: 700;
  color: ${colors.body};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '로그인에 실패했습니다.');
        setFieldErrors(
          (result.errors ?? [])
            .filter((item) => item.field)
            .reduce(
              (acc, { field, message }) => ({ ...acc, [field]: message }),
              {},
            ),
        );
        return;
      }

      setSession(result.data);
      navigate('/groups');
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Header />

      <Content>
        <BigLogo>
          Split<span>Opt</span>
        </BigLogo>

        <Form onSubmit={handleSubmit}>
          <Field style={{ marginBottom: '26px' }}>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange}
              hasError={Boolean(error)}
              required
            />
            {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
          </Field>

          <Field
            style={{ marginBottom: fieldErrors.password ? '46px' : '75px' }}
          >
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              hasError={Boolean(error)}
              required
            />
            {fieldErrors.password && (
              <FieldError>{fieldErrors.password}</FieldError>
            )}
          </Field>

          {error && Object.keys(fieldErrors).length === 0 && (
            <ErrorText>{error}</ErrorText>
          )}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </SubmitButton>
        </Form>

        <SignupText>
          계정이 없으신가요? <SignupLink to="/signup">회원가입</SignupLink>
        </SignupText>
      </Content>
    </Page>
  );
}

export default Login;
