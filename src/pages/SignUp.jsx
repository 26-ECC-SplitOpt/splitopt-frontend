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
  padding: 79px 24px 40px;
  box-sizing: border-box;
`;

const BigLogo = styled.p`
  margin: 0 0 48px;
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

const LoginText = styled.p`
  margin: 45px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: ${colors.body};
`;

const LoginLink = styled(Link)`
  font-weight: 700;
  color: ${colors.body};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FIELD_BASE_MARGIN = {
  name: 26,
  email: 30,
  password: 31,
  passwordConfirm: 44,
};

const ERROR_HEIGHT_GROWTH = 22;

function fieldMarginBottom(fieldName, hasError) {
  const base = FIELD_BASE_MARGIN[fieldName];
  return `${hasError ? base - ERROR_HEIGHT_GROWTH : base}px`;
}

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    if (form.password !== form.passwordConfirm) {
      setFieldErrors({ passwordConfirm: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { name, email, password } = form;
      const response = await apiFetch(`/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '회원가입에 실패했습니다.');
        setFieldErrors(
          (result.errors ?? []).reduce(
            (acc, { field, message }) => ({ ...acc, [field]: message }),
            {},
          ),
        );
        return;
      }

      navigate('/');
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
          <Field style={{ marginBottom: fieldMarginBottom('name', false) }}>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
            {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
          </Field>

          <Field
            style={{
              marginBottom: fieldMarginBottom(
                'email',
                Boolean(fieldErrors.email),
              ),
            }}
          >
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={handleChange('email')}
              hasError={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
          </Field>

          <Field
            style={{
              marginBottom: fieldMarginBottom(
                'password',
                Boolean(fieldErrors.password),
              ),
            }}
          >
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange('password')}
              hasError={Boolean(fieldErrors.password)}
              required
            />
            {fieldErrors.password && (
              <FieldError>{fieldErrors.password}</FieldError>
            )}
          </Field>

          <Field
            style={{
              marginBottom: fieldMarginBottom(
                'passwordConfirm',
                Boolean(fieldErrors.passwordConfirm),
              ),
            }}
          >
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordConfirm}
              onChange={handleChange('passwordConfirm')}
              hasError={Boolean(fieldErrors.passwordConfirm)}
              required
            />
            {fieldErrors.passwordConfirm && (
              <FieldError>{fieldErrors.passwordConfirm}</FieldError>
            )}
          </Field>

          {error && Object.keys(fieldErrors).length === 0 && (
            <ErrorText>{error}</ErrorText>
          )}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </SubmitButton>
        </Form>

        <LoginText>
          계정이 이미 있으신가요? <LoginLink to="/">로그인</LoginLink>
        </LoginText>
      </Content>
    </Page>
  );
}

export default SignUp;
