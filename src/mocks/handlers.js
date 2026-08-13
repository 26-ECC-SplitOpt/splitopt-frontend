import { http, HttpResponse, delay } from 'msw';

const meUser = {
  userId: 1,
  email: 'user@example.com',
  name: '주영',
  createdAt: '2026-07-21T14:00:00Z',
};

// userId로 참여자를 추가할 때 이름을 찾기 위한 mock 사용자 디렉터리
const mockUsers = {
  1: meUser.name,
  2: '김철수',
  3: '이영희',
  4: '박민수',
};

const groups = [
  {
    groupId: 1,
    name: '제주도 여행',
    description: '',
    currency: 'KRW',
    ownerId: 1,
    createdAt: '2026-07-10T09:00:00Z',
    memberCount: 5,
    settledStatus: 'IN_PROGRESS',
    myBalance: -35000,
    inviteCode: 'KJ92AL',
    inviteExpiresAt: '2026-07-13T09:00:00Z',
    members: ['주영', '수빈', '채빈', '지은', '하늘'],
    expenses: [],
    settlements: [],
  },
  {
    groupId: 2,
    name: '강릉 당일치기',
    description: '',
    currency: 'KRW',
    ownerId: 1,
    createdAt: '2026-07-28T09:00:00Z',
    memberCount: 4,
    settledStatus: 'NOT_STARTED',
    myBalance: null,
    inviteCode: 'GFEID83',
    inviteExpiresAt: '2026-07-31T09:00:00Z',
    members: ['수빈', '채빈', '지은', '주영'],
    // participantId: 수빈=201, 채빈=202, 지은=203, 주영=204 (ensureParticipants 규칙과 동일)
    expenses: [
      {
        id: 1,
        expenseDate: '2026-08-05',
        title: '점심 식사',
        category: '식비',
        payerParticipantId: 201,
        amount: 52000,
        memo: '',
        shares: [
          { participantId: 201, amount: 13000 },
          { participantId: 202, amount: 13000 },
          { participantId: 203, amount: 13000 },
          { participantId: 204, amount: 13000 },
        ],
        createdAt: '2026-08-05T12:00:00Z',
      },
      {
        id: 2,
        expenseDate: '2026-08-05',
        title: '카페',
        category: '식비',
        payerParticipantId: 202,
        amount: 30000,
        memo: '',
        shares: [
          { participantId: 201, amount: 7500 },
          { participantId: 202, amount: 7500 },
          { participantId: 203, amount: 7500 },
          { participantId: 204, amount: 7500 },
        ],
        createdAt: '2026-08-05T13:00:00Z',
      },
      {
        id: 3,
        expenseDate: '2026-08-05',
        title: '저녁 식사',
        category: '식비',
        payerParticipantId: 201,
        amount: 75000,
        memo: '',
        shares: [
          { participantId: 201, amount: 18750 },
          { participantId: 202, amount: 18750 },
          { participantId: 203, amount: 18750 },
          { participantId: 204, amount: 18750 },
        ],
        createdAt: '2026-08-05T19:00:00Z',
      },
      {
        id: 4,
        expenseDate: '2026-08-05',
        title: '교통비',
        category: '교통',
        payerParticipantId: 203,
        amount: 80000,
        memo: '',
        shares: [
          { participantId: 201, amount: 20000 },
          { participantId: 202, amount: 20000 },
          { participantId: 203, amount: 20000 },
          { participantId: 204, amount: 20000 },
        ],
        createdAt: '2026-08-05T09:00:00Z',
      },
      {
        id: 5,
        expenseDate: '2026-08-05',
        title: '소품샵',
        category: '쇼핑',
        payerParticipantId: 204,
        amount: 41000,
        memo: '',
        shares: [
          { participantId: 204, amount: 18000 },
          { participantId: 202, amount: 13000 },
          { participantId: 201, amount: 10000 },
        ],
        createdAt: '2026-08-05T20:00:00Z',
      },
    ],
    settlements: [
      {
        settlementId: 1,
        fromParticipantId: 202,
        toParticipantId: 201,
        amount: 39500,
        status: 'PENDING',
      },
      {
        settlementId: 2,
        fromParticipantId: 204,
        toParticipantId: 203,
        amount: 10500,
        status: 'PENDING',
      },
      {
        settlementId: 3,
        fromParticipantId: 204,
        toParticipantId: 201,
        amount: 18000,
        status: 'PENDING',
      },
    ],
  },
  {
    groupId: 3,
    name: '북한산 등산팟',
    description: '',
    currency: 'KRW',
    ownerId: 1,
    createdAt: '2026-06-20T09:00:00Z',
    memberCount: 6,
    settledStatus: 'DONE',
    myBalance: 0,
    inviteCode: 'PK7VXQ',
    inviteExpiresAt: '2026-06-23T09:00:00Z',
    members: ['주영', '민재', '서연', '도윤', '하은', '지호'],
    expenses: [],
    settlements: [],
  },
  {
    groupId: 4,
    name: '망원동 빵집 투어',
    description: '',
    currency: 'KRW',
    ownerId: 1,
    createdAt: '2026-08-01T09:00:00Z',
    memberCount: 3,
    settledStatus: 'DONE',
    myBalance: -3666,
    inviteCode: 'BZ3RWT',
    inviteExpiresAt: '2026-08-04T09:00:00Z',
    members: ['주영', '수빈', '채빈'],
    // participantId: 주영=401, 수빈=402, 채빈=403
    expenses: [
      {
        id: 1,
        expenseDate: '2026-08-01',
        title: '성심당 튀김소보로',
        category: '식비',
        payerParticipantId: 402,
        amount: 15000,
        memo: '',
        shares: [
          { participantId: 401, amount: 5000 },
          { participantId: 402, amount: 5000 },
          { participantId: 403, amount: 5000 },
        ],
        createdAt: '2026-08-01T11:00:00Z',
      },
      {
        id: 2,
        expenseDate: '2026-08-01',
        title: '존베이커리 빵 구매',
        category: '쇼핑',
        payerParticipantId: 403,
        amount: 32000,
        memo: '',
        shares: [
          { participantId: 401, amount: 10666 },
          { participantId: 402, amount: 10666 },
          { participantId: 403, amount: 10668 },
        ],
        createdAt: '2026-08-01T13:00:00Z',
      },
      {
        id: 3,
        expenseDate: '2026-08-01',
        title: '택시비',
        category: '교통',
        payerParticipantId: 401,
        amount: 18000,
        memo: '',
        shares: [
          { participantId: 401, amount: 6000 },
          { participantId: 402, amount: 6000 },
          { participantId: 403, amount: 6000 },
        ],
        createdAt: '2026-08-01T15:00:00Z',
      },
    ],
    // 정산 완료: 주영 → 채빈 3,666원, 수빈 → 채빈 6,666원 모두 COMPLETED.
    settlements: [
      {
        settlementId: 1,
        fromParticipantId: 401,
        toParticipantId: 403,
        amount: 3666,
        status: 'COMPLETED',
      },
      {
        settlementId: 2,
        fromParticipantId: 402,
        toParticipantId: 403,
        amount: 6666,
        status: 'COMPLETED',
      },
    ],
  },
];

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// participants는 group_participants 테이블에 해당 — 한 번 생성되면 그룹에
// 저장해두고 계속 재사용한다 (역할 수정, 삭제가 유지되도록).
function ensureParticipants(group) {
  if (!group.participants) {
    group.participants = (group.members ?? []).map((name, index) => {
      const userId =
        name === meUser.name ? meUser.userId : group.groupId * 10 + index + 1;
      return {
        participantId: group.groupId * 100 + index + 1,
        userId,
        name,
        // OWNER 여부는 이름이 아니라 group.ownerId 기준으로 정한다 — 주영이
        // owner가 아닌 모임(예: 망원동 빵집 투어)도 있을 수 있다.
        role: userId === group.ownerId ? 'OWNER' : 'MEMBER',
      };
    });
  }

  return group.participants;
}

function findParticipantByParticipantId(group, participantId) {
  return ensureParticipants(group).find(
    (p) => String(p.participantId) === String(participantId),
  );
}

function findMyParticipant(group) {
  return ensureParticipants(group).find(
    (p) => String(p.userId) === String(meUser.userId),
  );
}

function isOwner(group) {
  return String(group.ownerId) === String(meUser.userId);
}

function forbiddenResponse(message) {
  return HttpResponse.json(
    {
      success: false,
      message,
      errors: [{ field: null, code: 'FORBIDDEN', message }],
    },
    { status: 403 },
  );
}

// 참여자별 결제/부담/잔액 계산 — 단순 합산일 뿐, 정산 최적화(송금 조합 계산) 같은
// 실제 알고리즘은 아래 optimize 핸들러에서도 구현하지 않는다.
function computeBalances(group) {
  const participants = ensureParticipants(group);
  const expenses = group.expenses ?? [];

  return participants.map((p) => {
    const paidAmount = expenses
      .filter(
        (expense) =>
          String(expense.payerParticipantId) === String(p.participantId),
      )
      .reduce((sum, expense) => sum + expense.amount, 0);

    const burdenAmount = expenses.reduce((sum, expense) => {
      const share = (expense.shares ?? []).find(
        (item) => String(item.participantId) === String(p.participantId),
      );
      return sum + (share?.amount ?? 0);
    }, 0);

    return {
      participantId: p.participantId,
      name: p.name,
      paidAmount,
      burdenAmount,
      balance: paidAmount - burdenAmount,
    };
  });
}

function toSettlementView(group, settlement) {
  return {
    settlementId: settlement.settlementId,
    fromParticipantId: settlement.fromParticipantId,
    fromName:
      findParticipantByParticipantId(group, settlement.fromParticipantId)
        ?.name ?? '',
    toParticipantId: settlement.toParticipantId,
    toName:
      findParticipantByParticipantId(group, settlement.toParticipantId)?.name ??
      '',
    amount: settlement.amount,
    status: settlement.status,
  };
}

// shares[].amount는 클라이언트가 이미 계산해서 보내는 값이며(균등분배든 직접
// 입력이든), 서버는 Σ(shares.amount) === amount인지만 검증한다.
function validateShareSum(shares, amount) {
  const sum = shares.reduce((sum2, s) => sum2 + (Number(s.amount) || 0), 0);
  return sum === amount;
}

function toExpenseView(group, expense) {
  const payer = findParticipantByParticipantId(
    group,
    expense.payerParticipantId,
  );

  return {
    id: expense.id,
    groupId: group.groupId,
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    expenseDate: expense.expenseDate,
    memo: expense.memo ?? '',
    payer: payer
      ? { participantId: payer.participantId, name: payer.name }
      : null,
    shares: (expense.shares ?? []).map((share) => ({
      participantId: share.participantId,
      name:
        findParticipantByParticipantId(group, share.participantId)?.name ?? '',
      amount: share.amount,
    })),
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}

function toGroupDetail(group) {
  const participants = ensureParticipants(group);
  const totalAmount = (group.expenses ?? []).reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return {
    groupId: group.groupId,
    name: group.name,
    description: group.description,
    currency: group.currency,
    ownerId: group.ownerId,
    inviteCode: group.inviteCode,
    inviteExpiresAt: group.inviteExpiresAt,
    participants,
    totalAmount,
    createdAt: group.createdAt,
    // 명세서엔 없지만 GroupDetail 화면이 참여 인원/정산 상태 표시에 사용 중이라
    // 당분간 같이 내려줌.
    memberCount: participants.length,
    settledStatus: group.settledStatus,
  };
}

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

  http.post('/api/auth/logout', async ({ request }) => {
    const { refreshToken } = await request.json();

    await delay(200);

    if (!refreshToken) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'refreshToken',
              code: 'REFRESH_TOKEN_REQUIRED',
              message: 'refreshToken이 필요합니다.',
            },
          ],
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: { message: '로그아웃 되었습니다.' },
    });
  }),

  http.get('/api/groups', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    const summaries = groups.map((group) => ({
      groupId: group.groupId,
      name: group.name,
      participantCount: group.memberCount,
      totalAmount: (group.expenses ?? []).reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ),
      myBalance: group.myBalance ?? null,
      settlementStatus: group.settledStatus,
      createdAt: group.createdAt,
    }));

    const start = page * size;
    const pageItems = summaries.slice(start, start + size);

    return HttpResponse.json({
      success: true,
      data: {
        groups: pageItems,
        page,
        size,
        totalElements: summaries.length,
        totalPages: Math.ceil(summaries.length / size) || 1,
      },
    });
  }),

  http.post('/api/groups', async ({ request }) => {
    const { name, description, currency } = await request.json();

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

    const createdAt = new Date();
    const inviteExpiresAt = new Date(createdAt.getTime() + 72 * 60 * 60 * 1000);

    const newGroup = {
      groupId: groups.length + 1,
      name,
      description: description || '',
      currency: currency || 'KRW',
      ownerId: meUser.userId,
      memberCount: 1,
      settledStatus: 'NOT_STARTED',
      myBalance: null,
      inviteCode: generateInviteCode(),
      inviteExpiresAt: inviteExpiresAt.toISOString(),
      members: [meUser.name],
      expenses: [],
      settlements: [],
      createdAt: createdAt.toISOString(),
    };

    groups.unshift(newGroup);

    return HttpResponse.json(
      { success: true, data: newGroup },
      { status: 201 },
    );
  }),

  http.post('/api/groups/join', async ({ request }) => {
    const { inviteCode } = await request.json();

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

    if (group.members?.includes(meUser.name)) {
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

    group.members = [...(group.members ?? []), meUser.name];

    const participants = ensureParticipants(group);
    participants.push({
      participantId:
        Math.max(
          ...participants.map((p) => p.participantId),
          group.groupId * 100,
        ) + 1,
      userId: meUser.userId,
      name: meUser.name,
      role: 'MEMBER',
    });

    const joinedAt = new Date().toISOString();

    return HttpResponse.json({
      success: true,
      data: {
        groupId: group.groupId,
        name: group.name,
        role: 'MEMBER',
        joinedAt,
      },
    });
  }),

  http.post('/api/groups/:groupId/invite', async ({ params, request }) => {
    const body = await request.json().catch(() => ({}));
    const expiresInHours = body?.expiresInHours ?? 72;

    await delay(300);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (!isOwner(group)) {
      return forbiddenResponse('초대 코드는 모임장만 생성할 수 있습니다.');
    }

    group.inviteCode = generateInviteCode();
    group.inviteExpiresAt = new Date(
      Date.now() + expiresInHours * 60 * 60 * 1000,
    ).toISOString();

    return HttpResponse.json(
      {
        success: true,
        data: {
          inviteCode: group.inviteCode,
          inviteUrl: null,
          expiresAt: group.inviteExpiresAt,
        },
      },
      { status: 201 },
    );
  }),

  http.get('/api/groups/:groupId', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ success: true, data: toGroupDetail(group) });
  }),

  http.patch('/api/groups/:groupId', async ({ params, request }) => {
    const { name, description, members } = await request.json();

    await delay(400);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (!isOwner(group)) {
      return forbiddenResponse('모임 정보는 모임장만 수정할 수 있습니다.');
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
    group.description = description ?? '';

    // members는 명세서의 모임 정보 수정 요청 바디엔 없지만, 참여자 관리용
    // 별도 API가 나오기 전까지는 설정 화면의 참여자 삭제 기능을 지원하기
    // 위해 넘어오면 계속 반영한다. (설정 화면은 삭제만 지원하므로 목록을
    // participants에서 걸러내는 것으로 충분하다.)
    if (Array.isArray(members)) {
      group.members = members;
      const currentParticipants = ensureParticipants(group);
      group.participants = currentParticipants.filter((p) =>
        members.includes(p.name),
      );
    }

    group.updatedAt = new Date().toISOString();

    return HttpResponse.json({
      success: true,
      data: {
        groupId: group.groupId,
        name: group.name,
        description: group.description,
        currency: group.currency,
        ownerId: group.ownerId,
        memberCount: (group.members ?? []).length,
        updatedAt: group.updatedAt,
      },
    });
  }),

  http.delete('/api/groups/:groupId', async ({ params }) => {
    await delay(300);

    const index = groups.findIndex(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (!isOwner(groups[index])) {
      return forbiddenResponse('모임은 모임장만 삭제할 수 있습니다.');
    }

    groups.splice(index, 1);

    return HttpResponse.json({
      success: true,
      data: { message: '모임이 삭제되었습니다.' },
    });
  }),

  http.post(
    '/api/groups/:groupId/participants',
    async ({ params, request }) => {
      const { userId } = await request.json();

      await delay(300);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      if (!userId) {
        return HttpResponse.json(
          {
            success: false,
            message: '입력값을 확인해주세요.',
            errors: [
              {
                field: 'userId',
                code: 'USER_ID_REQUIRED',
                message: 'userId가 필요합니다.',
              },
            ],
          },
          { status: 400 },
        );
      }

      const name = mockUsers[userId] ?? `사용자${userId}`;

      if (group.members?.includes(name)) {
        return HttpResponse.json(
          {
            success: false,
            message: '이미 참여 중인 모임입니다.',
            errors: [
              {
                field: 'userId',
                code: 'ALREADY_JOINED',
                message: '이미 참여 중인 모임입니다.',
              },
            ],
          },
          { status: 409 },
        );
      }

      group.members = [...(group.members ?? []), name];

      const participants = ensureParticipants(group);
      participants.push({
        participantId:
          Math.max(
            ...participants.map((p) => p.participantId),
            group.groupId * 100,
          ) + 1,
        userId,
        name,
        role: 'MEMBER',
      });

      const joinedAt = new Date().toISOString();

      return HttpResponse.json(
        {
          success: true,
          data: { userId, name, role: 'MEMBER', joinedAt },
        },
        { status: 201 },
      );
    },
  ),

  http.get('/api/groups/:groupId/participants', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: ensureParticipants(group),
    });
  }),

  http.delete(
    '/api/groups/:groupId/participants/:userId',
    async ({ params }) => {
      await delay(300);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      if (!isOwner(group)) {
        return forbiddenResponse('참여자는 모임장만 삭제할 수 있습니다.');
      }

      const participants = ensureParticipants(group);
      const participant = participants.find(
        (p) => String(p.userId) === String(params.userId),
      );

      if (!participant) {
        return HttpResponse.json(
          { success: false, message: '참여자를 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const hasUnsettledDebt = (group.settlements ?? []).some(
        (s) =>
          (String(s.fromParticipantId) === String(participant.participantId) ||
            String(s.toParticipantId) === String(participant.participantId)) &&
          s.status !== 'COMPLETED',
      );

      if (hasUnsettledDebt) {
        return HttpResponse.json(
          {
            success: false,
            message: '정산이 끝나지 않은 참여자는 삭제할 수 없습니다.',
            errors: [
              {
                field: 'userId',
                code: 'UNSETTLED_DEBT_EXISTS',
                message: '정산이 끝나지 않은 참여자는 삭제할 수 없습니다.',
              },
            ],
          },
          { status: 409 },
        );
      }

      group.participants = participants.filter(
        (p) => String(p.userId) !== String(params.userId),
      );
      group.members = group.participants.map((p) => p.name);

      return HttpResponse.json({
        success: true,
        data: { message: '참여자가 모임에서 제외되었습니다.' },
      });
    },
  ),

  http.get(
    '/api/groups/:groupId/participants/:userId/status',
    async ({ params }) => {
      await delay(200);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const participant = ensureParticipants(group).find(
        (p) => String(p.userId) === String(params.userId),
      );

      if (!participant) {
        return HttpResponse.json(
          { success: false, message: '참여자를 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const balanceEntry = computeBalances(group).find(
        (b) => String(b.participantId) === String(participant.participantId),
      );

      const toSend = (group.settlements ?? [])
        .filter(
          (s) =>
            String(s.fromParticipantId) === String(participant.participantId),
        )
        .map((s) => {
          const to = findParticipantByParticipantId(group, s.toParticipantId);
          return {
            settlementId: s.settlementId,
            toUserId: to?.userId ?? null,
            toName: to?.name ?? '',
            amount: s.amount,
            status: s.status,
          };
        });

      const toReceive = (group.settlements ?? [])
        .filter(
          (s) =>
            String(s.toParticipantId) === String(participant.participantId),
        )
        .map((s) => {
          const from = findParticipantByParticipantId(
            group,
            s.fromParticipantId,
          );
          return {
            settlementId: s.settlementId,
            fromUserId: from?.userId ?? null,
            fromName: from?.name ?? '',
            amount: s.amount,
            status: s.status,
          };
        });

      return HttpResponse.json({
        success: true,
        data: {
          userId: participant.userId,
          name: participant.name,
          paidAmount: balanceEntry?.paidAmount ?? 0,
          burdenAmount: balanceEntry?.burdenAmount ?? 0,
          balance: balanceEntry?.balance ?? 0,
          toSend,
          toReceive,
          settledStatus: group.settledStatus,
        },
      });
    },
  ),

  http.post('/api/groups/:groupId/settle', async ({ params }) => {
    await delay(300);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 이미 모든 정산이 COMPLETED면 다시 눌러도 DONE을 유지하고, 아니면
    // IN_PROGRESS로 표시한다 — 무조건 IN_PROGRESS로 덮어쓰지 않는다.
    const settlements = group.settlements ?? [];
    const allCompleted =
      settlements.length > 0 &&
      settlements.every((s) => s.status === 'COMPLETED');
    group.settledStatus = allCompleted ? 'DONE' : 'IN_PROGRESS';

    return HttpResponse.json({ success: true, data: group });
  }),

  http.get('/api/groups/:groupId/balances', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const balances = computeBalances(group);
    const totalExpense = (group.expenses ?? []).reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    return HttpResponse.json({
      success: true,
      data: { balances, totalExpense },
    });
  }),

  http.post('/api/groups/:groupId/settlements/optimize', async ({ params }) => {
    await delay(400);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 실제 송금 조합 최적화 알고리즘은 구현하지 않고, 미리 준비된
    // group.settlements 픽스처를 그대로 "최적화 결과"로 내려준다.
    const settlements = (group.settlements ?? []).map((s) =>
      toSettlementView(group, s),
    );

    return HttpResponse.json({
      success: true,
      data: {
        settlements,
        transactionCount: settlements.length,
        optimizedAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/groups/:groupId/settlements', async ({ params, request }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const allSettlements = (group.settlements ?? []).map((s) =>
      toSettlementView(group, s),
    );
    const filtered = status
      ? allSettlements.filter((s) => s.status === status.toUpperCase())
      : allSettlements;
    const completedCount = allSettlements.filter(
      (s) => s.status === 'COMPLETED',
    ).length;
    const pendingCount = allSettlements.length - completedCount;

    return HttpResponse.json({
      success: true,
      data: {
        settlements: filtered,
        transactionCount: allSettlements.length,
        completedCount,
        pendingCount,
      },
    });
  }),

  http.get('/api/groups/:groupId/settlements/me', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // Authorization 헤더의 참여자 기준 — mock 환경에서는 로그인된 meUser의
    // 이 모임 내 participantId로 고정.
    const myParticipantId = findMyParticipant(group)?.participantId;

    const toSend = (group.settlements ?? [])
      .filter(
        (s) =>
          String(s.fromParticipantId) === String(myParticipantId) &&
          s.status !== 'COMPLETED',
      )
      .map((s) => ({
        settlementId: s.settlementId,
        counterpartName:
          findParticipantByParticipantId(group, s.toParticipantId)?.name ?? '',
        amount: s.amount,
        status: s.status,
      }));

    const toReceive = (group.settlements ?? [])
      .filter(
        (s) =>
          String(s.toParticipantId) === String(myParticipantId) &&
          s.status !== 'COMPLETED',
      )
      .map((s) => ({
        settlementId: s.settlementId,
        counterpartName:
          findParticipantByParticipantId(group, s.fromParticipantId)?.name ??
          '',
        amount: s.amount,
        status: s.status,
      }));

    const completed = (group.settlements ?? [])
      .filter(
        (s) =>
          (String(s.fromParticipantId) === String(myParticipantId) ||
            String(s.toParticipantId) === String(myParticipantId)) &&
          s.status === 'COMPLETED',
      )
      .map((s) => {
        const isSender =
          String(s.fromParticipantId) === String(myParticipantId);
        const counterpartId = isSender
          ? s.toParticipantId
          : s.fromParticipantId;
        return {
          settlementId: s.settlementId,
          counterpartName:
            findParticipantByParticipantId(group, counterpartId)?.name ?? '',
          amount: s.amount,
          status: s.status,
        };
      });

    return HttpResponse.json({
      success: true,
      data: { toSend, toReceive, completed },
    });
  }),

  http.get('/api/groups/:groupId/settlements/summary', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const settlements = group.settlements ?? [];
    const total = settlements.length;
    const completed = settlements.filter(
      (s) => s.status === 'COMPLETED',
    ).length;
    const pending = total - completed;
    const allCompleted = total > 0 && pending === 0;
    const status =
      total === 0 ? 'NOT_STARTED' : allCompleted ? 'DONE' : 'IN_PROGRESS';

    return HttpResponse.json({
      success: true,
      data: { total, completed, pending, allCompleted, status },
    });
  }),

  // 정산 상태는 PENDING → SENT → COMPLETED 3단계로 전이한다. 프론트는 목표
  // status를 직접 지정하지 않고 "무슨 행동을 했는지"(action)만 보내고,
  // 다음 상태가 뭐가 될지는 서버(mock)가 결정한다.
  // SEND(송금 완료): PENDING → SENT, from 참여자만 — 이미 SENT/COMPLETED면 409
  // CONFIRM(송금 확인): SENT → COMPLETED, to 참여자만 — 아직 PENDING이면 409
  // CANCEL(송금 완료 취소): SENT → PENDING, from 참여자만 — 이미 COMPLETED면 409
  // 권한 없는 참여자가 요청하면 403.
  http.patch(
    '/api/groups/:groupId/settlements/:settlementId/status',
    async ({ params, request }) => {
      const { action } = await request.json();

      await delay(250);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const settlement = (group.settlements ?? []).find(
        (item) => String(item.settlementId) === String(params.settlementId),
      );

      if (!settlement) {
        return HttpResponse.json(
          { success: false, message: '정산 내역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const rules = {
        SEND: {
          from: 'PENDING',
          to: 'SENT',
          role: 'from',
          conflictMessage: '이미 송금 완료 처리된 정산입니다.',
        },
        CONFIRM: {
          from: 'SENT',
          to: 'COMPLETED',
          role: 'to',
          conflictMessage: '아직 송금 전인 정산입니다.',
        },
        CANCEL: {
          from: 'SENT',
          to: 'PENDING',
          role: 'from',
          conflictMessage: '이미 완료된 정산은 취소할 수 없습니다.',
        },
      };
      const rule = rules[action];

      if (!rule) {
        return HttpResponse.json(
          { success: false, message: '지원하지 않는 action입니다.' },
          { status: 400 },
        );
      }

      const myParticipantId = findMyParticipant(group)?.participantId;
      const requiredParticipantId =
        rule.role === 'from'
          ? settlement.fromParticipantId
          : settlement.toParticipantId;

      if (String(myParticipantId) !== String(requiredParticipantId)) {
        return HttpResponse.json(
          {
            success: false,
            message: '해당 정산을 처리할 권한이 없습니다.',
          },
          { status: 403 },
        );
      }

      if (settlement.status !== rule.from) {
        return HttpResponse.json(
          { success: false, message: rule.conflictMessage },
          { status: 409 },
        );
      }

      settlement.status = rule.to;

      return HttpResponse.json({
        success: true,
        data: {
          settlementId: settlement.settlementId,
          status: settlement.status,
          completedAt:
            settlement.status === 'COMPLETED' ? new Date().toISOString() : null,
        },
      });
    },
  ),

  // splitMethod(EQUAL/DIRECT)는 입력 보조/검증용일 뿐 저장하지 않는다. 클라이언트가
  // 이미 계산한 shares[].amount를 그대로 받아서 Σ(shares.amount) === amount만
  // 검증한다. 결제자는 선택 항목이 아니라 항상 요청을 보낸 로그인 사용자로 고정된다.
  http.post('/api/groups/:groupId/expenses', async ({ params, request }) => {
    const body = await request.json();

    await delay(400);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const amount = Number(body.amount) || 0;
    const shares = Array.isArray(body.shares) ? body.shares : [];

    if (!validateShareSum(shares, amount)) {
      return HttpResponse.json(
        {
          success: false,
          message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
          errors: [
            {
              field: 'shares',
              code: 'SHARE_AMOUNT_MISMATCH',
              message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
            },
          ],
        },
        { status: 400 },
      );
    }

    const payer = findMyParticipant(group);

    const newExpense = {
      id: group.expenses.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      title: body.title,
      amount,
      payerParticipantId: payer?.participantId,
      category: body.category,
      expenseDate: body.expenseDate,
      memo: body.memo ?? '',
      shares: shares.map((share) => ({
        participantId: share.participantId,
        amount: Number(share.amount) || 0,
      })),
      createdAt: new Date().toISOString(),
    };

    group.expenses.push(newExpense);

    return HttpResponse.json(
      { success: true, data: toExpenseView(group, newExpense) },
      { status: 201 },
    );
  }),

  http.get('/api/groups/:groupId/expenses', async ({ params, request }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 목록 조회(18번) 응답은 등록/상세/부담설정(17·19·22번)과 달리 participantId로
    // 옮겨가지 않고 옛 payerId/payerName 평면 구조를 그대로 쓴다 — 실제 스펙 예시
    // 기준. payerId 값 자체는 내부적으로 participantId를 그대로 실어 보낸다.
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const payerId = url.searchParams.get('payerId');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    let filtered = group.expenses ?? [];
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (payerId) {
      filtered = filtered.filter(
        (item) => String(item.payerParticipantId) === String(payerId),
      );
    }

    const summaries = filtered.map((item) => {
      const view = toExpenseView(group, item);
      return {
        expenseId: view.id,
        title: view.title,
        amount: view.amount,
        payerId: view.payer?.participantId ?? null,
        payerName: view.payer?.name ?? '',
        category: view.category,
        expenseDate: view.expenseDate,
      };
    });

    const start = page * size;
    const pageItems = summaries.slice(start, start + size);

    return HttpResponse.json({
      success: true,
      data: {
        expenses: pageItems,
        page,
        size,
        totalElements: summaries.length,
        totalPages: Math.ceil(summaries.length / size) || 1,
      },
    });
  }),

  http.get('/api/groups/:groupId/expenses/:expenseId', async ({ params }) => {
    await delay(200);

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const expense = group.expenses.find(
      (item) => String(item.id) === String(params.expenseId),
    );

    if (!expense) {
      return HttpResponse.json(
        { success: false, message: '지출 내역을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: toExpenseView(group, expense),
    });
  }),

  http.put(
    '/api/groups/:groupId/expenses/:expenseId',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(400);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const expense = group.expenses.find(
        (item) => String(item.id) === String(params.expenseId),
      );

      if (!expense) {
        return HttpResponse.json(
          { success: false, message: '지출 내역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const myParticipantId = findMyParticipant(group)?.participantId;
      if (String(expense.payerParticipantId) !== String(myParticipantId)) {
        return forbiddenResponse('지출은 결제자 본인만 수정할 수 있습니다.');
      }

      const amount = Number(body.amount) || 0;
      const shares = Array.isArray(body.shares) ? body.shares : [];

      if (!validateShareSum(shares, amount)) {
        return HttpResponse.json(
          {
            success: false,
            message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
            errors: [
              {
                field: 'shares',
                code: 'SHARE_AMOUNT_MISMATCH',
                message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
              },
            ],
          },
          { status: 400 },
        );
      }

      expense.title = body.title;
      expense.amount = amount;
      expense.category = body.category;
      expense.expenseDate = body.expenseDate;
      expense.memo = body.memo ?? '';
      expense.shares = shares.map((share) => ({
        participantId: share.participantId,
        amount: Number(share.amount) || 0,
      }));
      expense.updatedAt = new Date().toISOString();

      return HttpResponse.json({
        success: true,
        data: toExpenseView(group, expense),
      });
    },
  ),

  http.delete(
    '/api/groups/:groupId/expenses/:expenseId',
    async ({ params }) => {
      await delay(300);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const expense = group.expenses.find(
        (item) => String(item.id) === String(params.expenseId),
      );

      if (!expense) {
        return HttpResponse.json(
          { success: false, message: '지출 내역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      // 결제자 본인만 삭제 가능. 단, 결제자가 이미 모임을 탈퇴해 참여자 목록에
      // 없는 경우엔 모임장이 대신 삭제할 수 있다(권장 사항).
      const myParticipantId = findMyParticipant(group)?.participantId;
      const isPayer =
        String(expense.payerParticipantId) === String(myParticipantId);
      const payerStillParticipant = Boolean(
        findParticipantByParticipantId(group, expense.payerParticipantId),
      );
      const canOverrideAsOwner = isOwner(group) && !payerStillParticipant;

      if (!isPayer && !canOverrideAsOwner) {
        return forbiddenResponse('지출은 결제자 본인만 삭제할 수 있습니다.');
      }

      const index = group.expenses.findIndex(
        (item) => String(item.id) === String(params.expenseId),
      );
      group.expenses.splice(index, 1);

      return HttpResponse.json({
        success: true,
        data: { message: '지출이 삭제되었습니다.', recalculated: true },
      });
    },
  ),

  // 정산 부담자 N명은 shares 행 수로 파생되며 별도로 저장하지 않는다.
  http.put(
    '/api/groups/:groupId/expenses/:expenseId/shares',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(300);

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const expense = group.expenses.find(
        (item) => String(item.id) === String(params.expenseId),
      );

      if (!expense) {
        return HttpResponse.json(
          { success: false, message: '지출 내역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const shares = Array.isArray(body.shares) ? body.shares : [];

      if (!validateShareSum(shares, expense.amount)) {
        return HttpResponse.json(
          {
            success: false,
            message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
            errors: [
              {
                field: 'shares',
                code: 'SHARE_AMOUNT_MISMATCH',
                message: '분담 금액의 합이 지출 금액과 일치하지 않습니다.',
              },
            ],
          },
          { status: 400 },
        );
      }

      expense.shares = shares.map((share) => ({
        participantId: share.participantId,
        amount: Number(share.amount) || 0,
      }));

      return HttpResponse.json({
        success: true,
        data: toExpenseView(group, expense),
      });
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      missingFieldErrors.push({
        field: 'email',
        code: 'EMAIL_INVALID',
        message: '이메일 형식이 올바르지 않습니다.',
      });
    }

    if (!password) {
      missingFieldErrors.push({
        field: 'password',
        code: 'PASSWORD_REQUIRED',
        message: '비밀번호를 입력해주세요.',
      });
    } else if (password.length < 8) {
      missingFieldErrors.push({
        field: 'password',
        code: 'PASSWORD_TOO_SHORT',
        message: '비밀번호는 8자 이상이어야 합니다.',
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
