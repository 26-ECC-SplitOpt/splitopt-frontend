import { http, HttpResponse, delay } from 'msw';

const meUser = {
  userId: 1,
  email: 'user@e.com',
  name: '주영',
  createdAt: '2026-07-21T14:00:00Z',
};

const mockUsers = {
  1: meUser.name,
  2: '김철수',
  3: '이영희',
  4: '박민수',
};

// 로그인/회원가입용 계정 저장소. meUser(userId 1)는 그룹/지출 mock 데이터가
// 전부 참조하는 고정 유저라서, 미리 시드해두고 로그인 시 그대로 반환한다.
const mockCredentials = [
  { userId: meUser.userId, email: meUser.email, password: 'pass1111' },
];

function generateToken(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2)}`;
}

const groups = [
  {
    groupId: 1,
    name: '제주도 여행',
    description: '3박 4일 제주 여행 정산',
    currency: 'KRW',
    ownerId: 1,
    createdAt: '2026-07-10T09:00:00Z',
    memberCount: 5,
    settledStatus: 'IN_PROGRESS',
    myBalance: null,
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
        scheduleId: 3,
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
        scheduleId: 3,
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
        scheduleId: null,
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
        scheduleId: null,
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
        scheduleId: null,
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
    schedules: [
      {
        scheduleId: 1,
        title: '여행 시작',
        location: '',
        startAt: '2026-08-01T09:00:00Z',
        endAt: null,
        memo: '',
      },
      {
        scheduleId: 2,
        title: '놀이공원',
        location: '',
        startAt: '2026-08-01T11:00:00Z',
        endAt: null,
        memo: '',
      },
      {
        scheduleId: 3,
        title: '맛집 탐방',
        location: '',
        startAt: '2026-08-02T12:00:00Z',
        endAt: null,
        memo: '',
      },
      {
        scheduleId: 4,
        title: '귀가',
        location: '',
        startAt: '2026-08-02T18:00:00Z',
        endAt: null,
        memo: '',
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

function requireAuth(request) {
  const authorization = request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return HttpResponse.json(
      {
        success: false,
        message: '인증이 필요합니다.',
        errors: [
          { field: null, code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
        ],
      },
      { status: 401 },
    );
  }

  return null;
}

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

// 카테고리별 지출 합계 — 통계 탭의 "카테고리별 지출" 카드와 "전체 요약"의
// byCategory에서 공용으로 쓴다.
function computeCategoryBreakdown(group) {
  const expenses = group.expenses ?? [];
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const byCategory = new Map();

  expenses.forEach((expense) => {
    const prev = byCategory.get(expense.category) ?? { amount: 0, count: 0 };
    byCategory.set(expense.category, {
      amount: prev.amount + expense.amount,
      count: prev.count + 1,
    });
  });

  const categories = Array.from(byCategory.entries()).map(
    ([category, stat]) => ({
      category,
      amount: stat.amount,
      ratio:
        totalExpense > 0
          ? Math.round((stat.amount / totalExpense) * 1000) / 10
          : 0,
      count: stat.count,
    }),
  );

  return { totalExpense, categories };
}

function computeParticipantBreakdown(group) {
  const balances = computeBalances(group);
  const totalExpense = (group.expenses ?? []).reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return balances.map((balance) => {
    const participant = findParticipantByParticipantId(
      group,
      balance.participantId,
    );

    return {
      userId: participant?.userId ?? null,
      name: balance.name,
      paidAmount: balance.paidAmount,
      burdenAmount: balance.burdenAmount,
      paidRatio:
        totalExpense > 0
          ? Math.round((balance.paidAmount / totalExpense) * 1000) / 10
          : 0,
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
    scheduleId: expense.scheduleId ?? null,
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

// 특정 일정에 연결된 지출 내역과 합계를 계산한다.
function getScheduleExpenses(group, scheduleId) {
  const linked = (group.expenses ?? []).filter(
    (item) => String(item.scheduleId) === String(scheduleId),
  );

  const expenses = linked.map((item) => {
    const view = toExpenseView(group, item);
    return {
      expenseId: view.id,
      title: view.title,
      category: view.category,
      payerName: view.payer?.name ?? '',
      amount: view.amount,
    };
  });

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return { expenses, totalExpense };
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
  /* 모임 목록
  http.get('/api/groups', async ({ request }) => {
    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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

  */
  /* 모임 생성
  http.post('/api/groups', async ({ request }) => {
    const { name, description, currency } = await request.json();

    await delay(400);

    const authError = requireAuth(request);
    if (authError) return authError;

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
      inviteCode: generateInviteCode(),
      inviteExpiresAt: inviteExpiresAt.toISOString(),
      members: [meUser.name],
      expenses: [],
      settlements: [],
      createdAt: createdAt.toISOString(),
    };

    groups.unshift(newGroup);

    return HttpResponse.json(
      {
        success: true,
        data: {
          groupId: newGroup.groupId,
          name: newGroup.name,
          description: newGroup.description,
          currency: newGroup.currency,
          ownerId: newGroup.ownerId,
          memberCount: newGroup.memberCount,
          inviteCode: newGroup.inviteCode,
          inviteExpiresAt: newGroup.inviteExpiresAt,
          createdAt: newGroup.createdAt,
        },
      },
      { status: 201 },
    );
  }),
  */
  /* 모임 참여
  http.post('/api/groups/join', async ({ request }) => {
    const { inviteCode } = await request.json();

    await delay(400);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  /* 모임 초대
    http.post('/api/groups/:groupId/invite', async ({ params, request }) => {
    const body = await request.json().catch(() => ({}));
    const expiresInHours = body?.expiresInHours ?? 72;

    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  // 모임 상세 + 수정 + 삭제
  /*
    http.get('/api/groups/:groupId', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

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

  http.put('/api/groups/:groupId', async ({ params, request }) => {
    const { name, description, members } = await request.json();

    await delay(400);

    const authError = requireAuth(request);
    if (authError) return authError;

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

  http.delete('/api/groups/:groupId', async ({ params, request }) => {
    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  // 참여자 관리
  /* 
  http.post(
    '/api/groups/:groupId/participants',
    async ({ params, request }) => {
      const { userId } = await request.json();

      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

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

  http.get('/api/groups/:groupId/participants', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

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
    async ({ params, request }) => {
      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

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

  */
  /* 참여자별 정산 현황 조회
  http.get(
    '/api/groups/:groupId/participants/:userId/status',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

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
  */
  /* 정산 최적화 - api 주소 잘못돼있어서 페이지에서는 바꿈 참고 
  http.post('/api/groups/:groupId/settle', async ({ params, request }) => {
    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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

  */
  /*
  http.get('/api/groups/:groupId/balances', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  // 모임 상세 "통계" 탭 - 전체 요약.
  /*
  http.get('/api/groups/:groupId/statistics', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const { totalExpense, categories } = computeCategoryBreakdown(group);
    const byParticipant = computeParticipantBreakdown(group);

    return HttpResponse.json({
      success: true,
      data: {
        totalExpense,
        expenseCount: (group.expenses ?? []).length,
        byCategory: categories.map(({ category, amount, ratio }) => ({
          category,
          amount,
          ratio,
        })),
        byParticipant: byParticipant.map(
          ({ userId, name, paidAmount, burdenAmount }) => ({
            userId,
            name,
            paidAmount,
            burdenAmount,
          }),
        ),
      },
    });
  }),
  */
  // 모임 상세 "통계" 탭 - 카테고리별 지출
  /*
  http.get(
    '/api/groups/:groupId/statistics/categories',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const { totalExpense, categories } = computeCategoryBreakdown(group);

      return HttpResponse.json({
        success: true,
        data: { categories, totalExpense },
      });
    },
  ),
  */
  // 모임 상세 "통계" 탭 - 참여자별 지출
  /*
  http.get(
    '/api/groups/:groupId/statistics/participants',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const participants = computeParticipantBreakdown(group);

      return HttpResponse.json({ success: true, data: { participants } });
    },
  ),
  */
  /*
  http.post(
    '/api/groups/:groupId/settlements/optimize',
    async ({ params, request }) => {
      await delay(400);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

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
    },
  ),
  */
  /*
  http.get('/api/groups/:groupId/settlements', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  /*

  http.get(
    '/api/groups/:groupId/settlements/me',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

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
            findParticipantByParticipantId(group, s.toParticipantId)?.name ??
            '',
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
    },
  ),
  */
  /*
  http.patch(
    '/api/groups/:groupId/settlements/:settlementId/status',
    async ({ params, request }) => {
      const { action } = await request.json();

      await delay(250);

      const authError = requireAuth(request);
      if (authError) return authError;

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
  */
  /*
    // 모임 상세 "일정" 탭 - 일정 목록. 시작일시 순 정렬.
  http.get('/api/groups/:groupId/schedules', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const schedules = [...(group.schedules ?? [])]
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
      .map((schedule) => ({
        ...schedule,
        // 실제 백엔드 응답 필드명(id)에 맞춘다.
        id: schedule.scheduleId,
        totalExpense: getScheduleExpenses(group, schedule.scheduleId)
          .totalExpense,
      }));

    return HttpResponse.json({ success: true, data: schedules });
  }),

  // 모임 상세 "일정" 탭 - 일정 등록. 제목/시작일시 필수, 장소/종료일시/메모 선택.
  http.post('/api/groups/:groupId/schedules', async ({ params, request }) => {
    const body = await request.json();

    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (!body.title || !body.title.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'title',
              code: 'TITLE_REQUIRED',
              message: '일정 이름을 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    if (!body.startAt) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'startAt',
              code: 'START_AT_REQUIRED',
              message: '시작 일시를 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    if (!group.schedules) group.schedules = [];

    const newSchedule = {
      scheduleId:
        group.schedules.reduce(
          (max, item) => Math.max(max, item.scheduleId),
          0,
        ) + 1,
      title: body.title,
      location: body.location ?? '',
      startAt: body.startAt,
      endAt: body.endAt ?? null,
      memo: body.memo ?? '',
    };

    group.schedules.push(newSchedule);

    return HttpResponse.json(
      { success: true, data: newSchedule },
      { status: 201 },
    );
  }),

  // 일정 상세.
  http.get(
    '/api/groups/:groupId/schedules/:scheduleId',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const schedule = (group.schedules ?? []).find(
        (item) => String(item.scheduleId) === String(params.scheduleId),
      );

      if (!schedule) {
        return HttpResponse.json(
          { success: false, message: '일정을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const { expenses, totalExpense } = getScheduleExpenses(
        group,
        schedule.scheduleId,
      );

      return HttpResponse.json({
        success: true,
        data: {
          ...schedule,
          id: schedule.scheduleId,
          expenses,
          totalExpense,
        },
      });
    },
  ),

  // 일정 수정. 제목/시작일시 필수, 장소/종료일시/메모 선택.
  http.put(
    '/api/groups/:groupId/schedules/:scheduleId',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const schedule = (group.schedules ?? []).find(
        (item) => String(item.scheduleId) === String(params.scheduleId),
      );

      if (!schedule) {
        return HttpResponse.json(
          { success: false, message: '일정을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      if (!body.title || !body.title.trim()) {
        return HttpResponse.json(
          {
            success: false,
            message: '입력값을 확인해주세요.',
            errors: [
              {
                field: 'title',
                code: 'TITLE_REQUIRED',
                message: '일정 이름을 입력해주세요.',
              },
            ],
          },
          { status: 400 },
        );
      }

      if (!body.startAt) {
        return HttpResponse.json(
          {
            success: false,
            message: '입력값을 확인해주세요.',
            errors: [
              {
                field: 'startAt',
                code: 'START_AT_REQUIRED',
                message: '시작 일시를 입력해주세요.',
              },
            ],
          },
          { status: 400 },
        );
      }

      schedule.title = body.title;
      schedule.location = body.location ?? '';
      schedule.startAt = body.startAt;
      schedule.endAt = body.endAt ?? null;
      schedule.memo = body.memo ?? '';

      const { expenses, totalExpense } = getScheduleExpenses(
        group,
        schedule.scheduleId,
      );

      return HttpResponse.json({
        success: true,
        data: {
          ...schedule,
          id: schedule.scheduleId,
          expenses,
          totalExpense,
        },
      });
    },
  ),

  // 일정 삭제. 연결돼 있던 지출의 scheduleId는 해제한다.
  http.delete(
    '/api/groups/:groupId/schedules/:scheduleId',
    async ({ params, request }) => {
      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const scheduleIndex = (group.schedules ?? []).findIndex(
        (item) => String(item.scheduleId) === String(params.scheduleId),
      );

      if (scheduleIndex === -1) {
        return HttpResponse.json(
          { success: false, message: '일정을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const [removed] = group.schedules.splice(scheduleIndex, 1);

      (group.expenses ?? []).forEach((expense) => {
        if (String(expense.scheduleId) === String(removed.scheduleId)) {
          expense.scheduleId = null;
        }
      });

      return HttpResponse.json({ success: true, data: null });
    },
  ),

  // 지출을 일정에 연결/해제한다. body: { scheduleId: number | null }
  http.patch(
    '/api/groups/:groupId/expenses/:expenseId/schedule',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

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

      expense.scheduleId = body.scheduleId ?? null;

      return HttpResponse.json({
        success: true,
        data: toExpenseView(group, expense),
      });
    },
  ),
  */
  /*
  / 예산 설정/수정.
  http.put('/api/groups/:groupId/budget', async ({ params, request }) => {
    const body = await request.json();

    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const memberCount = ensureParticipants(group).length || 1;
    const amount = Number(body.amount) || 0;
    const budgetPerPerson =
      body.budgetType === 'PER_PERSON'
        ? amount
        : Math.floor(amount / memberCount);
    const totalBudget =
      body.budgetType === 'PER_PERSON' ? amount * memberCount : amount;

    group.budget = {
      budgetType: body.budgetType,
      budgetPerPerson,
      totalBudget,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      success: true,
      data: { groupId: group.groupId, ...group.budget },
    });
  }),

  // 예산 현황 조회. 예산이 설정된 적 없으면 success:true에 값들만 null로 내려간다
  // (일정 목록이 비어있을 때 빈 배열을 내려주는 것과 같은 방식).
  http.get('/api/groups/:groupId/budget', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

    const group = groups.find(
      (item) => String(item.groupId) === String(params.groupId),
    );

    if (!group) {
      return HttpResponse.json(
        { success: false, message: '모임을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const spent = (group.expenses ?? []).reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    if (!group.budget) {
      return HttpResponse.json({
        success: true,
        data: {
          budgetType: null,
          budgetPerPerson: null,
          totalBudget: null,
          spent,
          remaining: null,
          usageRate: null,
        },
      });
    }

    const remaining = group.budget.totalBudget - spent;
    const usageRate =
      group.budget.totalBudget > 0
        ? Math.round((spent / group.budget.totalBudget) * 1000) / 10
        : 0;

    return HttpResponse.json({
      success: true,
      data: { ...group.budget, spent, remaining, usageRate },
    });
  }),

  // 예산 초과 예측/알림 조회.
  http.get(
    '/api/groups/:groupId/budget/forecast',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

      const group = groups.find(
        (item) => String(item.groupId) === String(params.groupId),
      );

      if (!group) {
        return HttpResponse.json(
          { success: false, message: '모임을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const spent = (group.expenses ?? []).reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );

      if (!group.budget) {
        return HttpResponse.json({
          success: true,
          data: {
            totalBudget: null,
            spent,
            elapsedDays: 0,
            totalDays: 0,
            dailyAverage: 0,
            projectedTotal: 0,
            willExceed: false,
            projectedOverage: 0,
          },
        });
      }

      const schedules = group.schedules ?? [];
      const starts = schedules.map((s) => new Date(s.startAt).getTime());
      const ends = schedules.map((s) =>
        new Date(s.endAt ?? s.startAt).getTime(),
      );
      const dayMs = 24 * 60 * 60 * 1000;
      const totalDays =
        starts.length > 0
          ? Math.max(1, Math.round((Math.max(...ends) - Math.min(...starts)) / dayMs) + 1)
          : 1;
      const elapsedDays = Math.min(
        totalDays,
        Math.max(
          1,
          Math.round((Date.now() - new Date(group.createdAt).getTime()) / dayMs),
        ),
      );

      const dailyAverage = elapsedDays > 0 ? Math.round(spent / elapsedDays) : spent;
      const projectedTotal = dailyAverage * totalDays;
      const willExceed = projectedTotal > group.budget.totalBudget;
      const projectedOverage = willExceed
        ? projectedTotal - group.budget.totalBudget
        : 0;

      return HttpResponse.json({
        success: true,
        data: {
          totalBudget: group.budget.totalBudget,
          spent,
          elapsedDays,
          totalDays,
          dailyAverage,
          projectedTotal,
          willExceed,
          projectedOverage,
        },
      });
    },
  ),
  */
  /* 지출 등록
  http.post('/api/groups/:groupId/expenses', async ({ params, request }) => {
    const body = await request.json();

    await delay(400);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
  /* 지출 목록, 상세, 수정, 삭제
  http.get('/api/groups/:groupId/expenses', async ({ params, request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

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

    // 실제 백엔드 응답 형식(data가 바로 배열, id/payer 객체/shares 포함)에
    // 맞춘다.
    const summaries = filtered.map((item) => toExpenseView(group, item));

    const start = page * size;
    const pageItems = summaries.slice(start, start + size);

    return HttpResponse.json({
      success: true,
      data: pageItems,
    });
  }),

  http.get(
    '/api/groups/:groupId/expenses/:expenseId',
    async ({ params, request }) => {
      await delay(200);

      const authError = requireAuth(request);
      if (authError) return authError;

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
    },
  ),

  http.put(
    '/api/groups/:groupId/expenses/:expenseId',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(400);

      const authError = requireAuth(request);
      if (authError) return authError;

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
    async ({ params, request }) => {
      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

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

    http.put(
    '/api/groups/:groupId/expenses/:expenseId/shares',
    async ({ params, request }) => {
      const body = await request.json();

      await delay(300);

      const authError = requireAuth(request);
      if (authError) return authError;

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
  */
  // 회원가입, 로그인, 로그아웃, 내 정보
  /*
  http.post('/api/auth/signup', async ({ request }) => {
    const { name, email, password } = await request.json();

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
              message: '이름을 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    if (!email || !email.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'email',
              code: 'EMAIL_REQUIRED',
              message: '이메일을 입력해주세요.',
            },
          ],
        },
        { status: 400 },
      );
    }

    if (!password || password.length < 8) {
      return HttpResponse.json(
        {
          success: false,
          message: '입력값을 확인해주세요.',
          errors: [
            {
              field: 'password',
              code: 'PASSWORD_TOO_SHORT',
              message: '비밀번호는 8자 이상이어야 합니다.',
            },
          ],
        },
        { status: 400 },
      );
    }

    if (mockCredentials.some((item) => item.email === email)) {
      return HttpResponse.json(
        {
          success: false,
          message: '이미 가입된 이메일입니다.',
          errors: [
            {
              field: 'email',
              code: 'EMAIL_DUPLICATE',
              message: '이미 가입된 이메일입니다.',
            },
          ],
        },
        { status: 409 },
      );
    }

    const userId = mockCredentials.length + 1;
    mockCredentials.push({ userId, email, password, name });

    return HttpResponse.json(
      {
        success: true,
        data: {
          userId,
          email,
          name,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    await delay(400);

    const account = mockCredentials.find((item) => item.email === email);

    if (!account || account.password !== password) {
      return HttpResponse.json(
        {
          success: false,
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          errors: [
            {
              field: null,
              code: 'LOGIN_FAILED',
              message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            },
          ],
        },
        { status: 401 },
      );
    }

    // meUser(userId 1)는 그룹/지출 mock 데이터가 전부 참조하는 계정이라,
    // 시드 계정으로 로그인하면 항상 meUser 정보를 그대로 돌려준다.
    const isSeedAccount = account.userId === meUser.userId;

    return HttpResponse.json({
      success: true,
      data: {
        accessToken: generateToken('access'),
        refreshToken: generateToken('refresh'),
        user: isSeedAccount
          ? meUser
          : {
              userId: account.userId,
              email: account.email,
              name: account.name,
            },
      },
    });
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

    return HttpResponse.json({
      success: true,
      data: { message: '로그아웃되었습니다.' },
    });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(200);

    const authError = requireAuth(request);
    if (authError) return authError;

    return HttpResponse.json({ success: true, data: meUser });
  }),

  http.patch('/api/auth/me', async ({ request }) => {
    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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

  http.put('/api/auth/me', async ({ request }) => {
    await delay(300);

    const authError = requireAuth(request);
    if (authError) return authError;

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
  */
];
