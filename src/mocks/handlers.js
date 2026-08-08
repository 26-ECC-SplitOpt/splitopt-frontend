import { http, HttpResponse, delay } from 'msw';

const meUser = {
  userId: 1,
  email: 'user@example.com',
  name: '주영',
  createdAt: '2026-07-21T14:00:00Z',
};

const groups = [
  {
    id: 1,
    name: '제주도 여행',
    memo: '',
    memberCount: 5,
    status: 'IN_PROGRESS',
    inviteCode: 'KJ92AL',
    members: ['주영', '수빈', '채빈', '지은', '하늘'],
    expenses: [],
    settlements: [],
  },
  {
    id: 2,
    name: '강릉 당일치기',
    memo: '',
    memberCount: 4,
    status: 'PENDING',
    inviteCode: 'GFEID83',
    members: ['수빈', '채빈', '지은', '주영'],
    expenses: [
      { id: 1, category: '점심 식사', payer: '수빈', amount: 52000 },
      { id: 2, category: '카페', payer: '채빈', amount: 30000 },
      { id: 3, category: '저녁 식사', payer: '수빈', amount: 75000 },
      { id: 4, category: '교통비', payer: '지은', amount: 80000 },
      { id: 5, category: '소품샵', payer: '주영', amount: 41000 },
    ],
    settlements: [
      { id: 1, from: '채빈', to: '수빈', amount: 39500, status: 'PENDING' },
      { id: 2, from: '주영', to: '지은', amount: 10500, status: 'PENDING' },
      { id: 3, from: '주영', to: '수빈', amount: 18000, status: 'PENDING' },
    ],
  },
  {
    id: 3,
    name: '북한산 등산팟',
    memo: '',
    memberCount: 6,
    status: 'COMPLETED',
    inviteCode: 'PK7VXQ',
    members: ['주영', '민재', '서연', '도윤', '하은', '지호'],
    expenses: [],
    settlements: [],
  },
  {
    id: 4,
    name: '망원동 빵집 투어',
    memo: '',
    memberCount: 3,
    status: 'IN_PROGRESS',
    inviteCode: 'BZ3RWT',
    members: ['주영', '수빈', '채빈'],
    expenses: [],
    settlements: [],
  },
];

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();

    await delay(400);

    if (email === 'user@example.com' && password === 'pass1234') {
      return HttpResponse.json({
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiJ9.mock-access-token',
          refreshToken: 'eyJhbGciOiJIUzI1NiJ9.mock-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            userId: 1,
            email,
            name: '주영',
          },
        },
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: '입력값을 확인해주세요.',
        errors: [
          {
            field: 'password',
            code: 'INVALID_CREDENTIALS',
            message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          },
        ],
      },
      { status: 401 },
    );
  }),

  http.get('/api/groups', async () => {
    await delay(300);

    return HttpResponse.json({
      success: true,
      data: { groups },
    });
  }),

  http.post('/api/groups', async ({ request }) => {
    const { name, memo } = await request.json();

    await delay(400);

    if (!name || !name.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'name',
              code: 'NAME_REQUIRED',
              message: '모임 이름을 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    const newGroup = {
      id: groups.length + 1,
      name,
      memo: memo || '',
      memberCount: 1,
      status: 'PENDING',
    };

    groups.unshift(newGroup);

    return HttpResponse.json({
      success: true,
      data: { group: newGroup },
    });
  }),

  http.post('/api/groups/join', async ({ request }) => {
    const { inviteCode, name } = await request.json();

    await delay(400);

    const group = groups.find((item) => item.inviteCode === inviteCode);

    if (!group) {
      return HttpResponse.json(
        {
          success: false,
          message: '잘못된 초대 코드입니다.',
          errors: [
            {
              field: 'inviteCode',
              code: 'INVALID_INVITE_CODE',
              message: '잘못된 초대 코드입니다.',
            },
          ],
        },
        { status: 404 },
      );
    }

    if (name && group.members?.includes(name)) {
      return HttpResponse.json(
        {
          success: false,
          message: '이미 참여 중인 모임입니다.',
          errors: [
            {
              field: 'inviteCode',
              code: 'ALREADY_JOINED',
              message: '이미 참여 중인 모임입니다.',
            },
          ],
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({ success: true, data: { group } });
  }),

  http.get('/api/groups/:groupId', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.id) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ success: true, data: group });
  }),

  http.patch('/api/groups/:groupId', async ({ params, request }) => {
    const { name, memo, members } = await request.json();

    await delay(400);

    const group = groups.find(
      (item) => String(item.id) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (!name || !name.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'name',
              code: 'NAME_REQUIRED',
              message: '모임 이름을 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    group.name = name;
    group.memo = memo ?? '';

    if (Array.isArray(members)) {
      group.members = members;
      group.memberCount = members.length;
    }

    return HttpResponse.json({ success: true, data: group });
  }),

  http.delete('/api/groups/:groupId', async ({ params }) => {
    await delay(300);

    const index = groups.findIndex(
      (item) => String(item.id) === String(params.groupId),
    );

    if (index !== -1) {
      groups.splice(index, 1);
    }

    return HttpResponse.json({ success: true });
  }),

  http.post('/api/groups/:groupId/settle', async ({ params }) => {
    await delay(300);

    const group = groups.find(
      (item) => String(item.id) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    group.status = 'IN_PROGRESS';

    return HttpResponse.json({ success: true, data: group });
  }),

  http.get('/api/groups/:groupId/settlements', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.id) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: { settlements: group.settlements ?? [] },
    });
  }),

  http.patch(
    '/api/groups/:groupId/settlements/:settlementId',
    async ({ params, request }) => {
      const { status } = await request.json();

      await delay(250);

      const group = groups.find(
        (item) => String(item.id) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const settlement = (group.settlements ?? []).find(
        (item) => String(item.id) === String(params.settlementId),
      );

      if (!settlement) {
        return HttpResponse.json(
          { success: false, message: '정산 내역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      settlement.status = status;

      return HttpResponse.json({ success: true, data: settlement });
    },
  ),

  http.post('/api/signup', async ({ request }) => {
    const { name, email, password } = await request.json();

    await delay(400);

    const missingFieldErrors = [];

    if (!name || !name.trim()) {
      missingFieldErrors.push({
        field: 'name',
        code: 'NAME_REQUIRED',
        message: '이름을 입력해주세요.',
      });
    }

    if (!email || !email.trim()) {
      missingFieldErrors.push({
        field: 'email',
        code: 'EMAIL_REQUIRED',
        message: '이메일을 입력해주세요.',
      });
    }

    if (!password) {
      missingFieldErrors.push({
        field: 'password',
        code: 'PASSWORD_REQUIRED',
        message: '비밀번호를 입력해주세요.',
      });
    } else if (password.length < 8 || password.length > 64) {
      missingFieldErrors.push({
        field: 'password',
        code: 'PASSWORD_LENGTH_INVALID',
        message: '비밀번호는 8~64자여야 합니다.',
      });
    }

    if (missingFieldErrors.length > 0) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: missingFieldErrors,
        },
        { status: 400 },
      );
    }

    if (email === 'user@example.com') {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'email',
              code: 'EMAIL_DUPLICATED',
              message: '이미 사용 중인 이메일입니다.',
            },
          ],
        },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      {
        success: true,
        data: {
          userId: 2,
          email,
          name,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.get('/api/me', async () => {
    await delay(200);

    return HttpResponse.json({ success: true, data: meUser });
  }),

  http.patch('/api/me', async ({ request }) => {
    const authorization = request.headers.get('Authorization');

    await delay(300);

    if (!authorization?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const { name } = await request.json();

    if (!name || !name.trim() || name.length > 50) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'name',
              code: 'NAME_INVALID',
              message: '이름은 1자 이상 50자 이하로 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    meUser.name = name;

    return HttpResponse.json({ success: true, data: meUser });
  }),
];
