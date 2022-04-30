// Achievement - Nobility - Title Info
export const tooltipImages = {
  Folks: {
    name: 'Folks',
    path: '/static/img/main_achievement/collection/folks.png',
    desc: 'Folks',
    smtc: 'x 1',
    passive: 'x 2',
    chest: '',
    require: '1'
  },
  Baron: {
    name: 'Baron',
    path: '/static/img/main_achievement/collection/baron.png',
    desc: 'Folks',
    smtc: 'x 1.5',
    passive: 'x 5',
    chest: '',
    require: '10'
  },
  Count: {
    name: 'Count',
    path: '/static/img/main_achievement/collection/count.png',
    desc: 'Count',
    smtc: 'x 2',
    passive: 'x 10',
    chest: '',
    require: '50'
  },
  Viscount: {
    name: 'Viscount',
    path: '/static/img/main_achievement/collection/viscount.png',
    desc: 'Viscount',
    smtc: 'x 2.5',
    passive: 'x 20',
    chest: '',
    require: '100'
  },
  Earl: {
    name: 'Earl',
    path: '/static/img/main_achievement/collection/earl.png',
    desc: 'Earl',
    smtc: 'x 3',
    passive: 'x 40',
    chest: '',
    require: '200'
  },
  Duke: {
    name: 'Duke',
    path: '/static/img/main_achievement/collection/duke.png',
    desc: 'Duke',
    smtc: 'x 3.5',
    passive: 'x 100',
    chest: '',
    require: '500'
  },
  Prince: {
    name: 'Prince',
    path: '/static/img/main_achievement/collection/prince.png',
    desc: 'Prince',
    smtc: 'x 4',
    passive: 'x 300',
    chest: '',
    require: '1000'
  },
  King: {
    name: 'King',
    path: '/static/img/main_achievement/collection/king.png',
    desc0: `King's`,
    desc1: 'Privileges',
    smtc: 'x 5',
    passive: 'x 700',
    chest: '',
    require: '2000'
  },
  tree: {
    name: 'tree_cash',
    path0: '/static/img/main_achievement/tooltip/tree.svg',
    path1: '/static/img/main_achievement/tooltip/cash.svg',
    desc0: 'Golden Tree SMTC Rewards',
    desc1: 'x 5'
  },
  share: {
    name: 'share',
    path: '/static/img/main_achievement/tooltip/share.svg',
    desc0: 'Passive Global Share',
    desc1: 'x 700'
  },
  reward: {
    name: 'reward',
    path: '/static/img/main_achievement/tooltip/reward.svg',
    desc0: 'Prince Chest Reward',
    desc1: 'weekly'
  }
};

export const NobilityTitleArray = [
  {
    name: 'Folks',
    path: '/static/img/main_achievement/collection/folks.png',
    desc: 'Folks',
    smtc: 'x 1',
    passive: 'x 2',
    chest: '',
    require: '1'
  },
  {
    name: 'Baron',
    path: '/static/img/main_achievement/collection/baron.png',
    desc: 'Baron',
    smtc: 'x 1.5',
    passive: 'x 5',
    chest: '',
    require: '10'
  },
  {
    name: 'Count',
    path: '/static/img/main_achievement/collection/count.png',
    desc: 'Count',
    smtc: 'x 2',
    passive: 'x 10',
    chest: '',
    require: '50'
  },
  {
    name: 'Viscount',
    path: '/static/img/main_achievement/collection/viscount.png',
    desc: 'Viscount',
    smtc: 'x 2.5',
    passive: 'x 20',
    chest: '',
    require: '100'
  },
  {
    name: 'Earl',
    path: '/static/img/main_achievement/collection/earl.png',
    desc: 'Earl',
    smtc: 'x 3',
    passive: 'x 40',
    chest: '',
    require: '200'
  },
  {
    name: 'Duke',
    path: '/static/img/main_achievement/collection/duke.png',
    desc: 'Duke',
    smtc: 'x 3.5',
    passive: 'x 100',
    chest: '',
    require: '500'
  },
  {
    name: 'Prince',
    path: '/static/img/main_achievement/collection/prince.png',
    desc: 'Prince',
    smtc: 'x 4',
    passive: 'x 300',
    chest: '',
    require: '1000'
  },
  {
    name: 'King',
    path: '/static/img/main_achievement/collection/king.png',
    desc0: `King's`,
    desc1: 'Privileges',
    smtc: 'x 5',
    passive: 'x 700',
    chest: '',
    require: '2000'
  }
];

// Achievement - Nobility - Collection Info
export const collectionGroup = [
  [
    {
      name: 'Folks',
      path: '/static/img/main_achievement/collection/folks.png',
      path1: '/static/img/main_achievement/collection/folks_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *1 Passive global share *228,000,000 titles available'
    },
    {
      name: 'Baron',
      path: '/static/img/main_achievement/collection/baron.png',
      path1: '/static/img/main_achievement/collection/baron_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *1.5 Passive global share *5 Baron Chest weekly rewards 4,000,000 titles available'
    }
  ],

  [
    {
      name: 'Count',
      path: '/static/img/main_achievement/collection/count.png',
      path1: '/static/img/main_achievement/collection/count_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *2 Passive global share *10 Count Chest weekly rewards 400, 000 titles available'
    },
    {
      name: 'Viscount',
      path: '/static/img/main_achievement/collection/viscount.png',
      path1: '/static/img/main_achievement/collection/viscount_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *2.5 Passive global share *20 Viscount Chest weekly rewards 100, 000 titles available'
    }
  ],

  [
    {
      name: 'Earl',
      path: '/static/img/main_achievement/collection/earl.png',
      path1: '/static/img/main_achievement/collection/earl_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *3 Passive global share *40 Earl Chest weekly rewards 10, 000 titles available'
    },
    {
      name: 'Duke',
      path: '/static/img/main_achievement/collection/duke.png',
      path1: '/static/img/main_achievement/collection/duke_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *3.5 Passive global share *100 Duke Chest weekly rewards 1, 000 titles available'
    }
  ],

  [
    {
      name: 'Prince',
      path: '/static/img/main_achievement/collection/prince.png',
      path1: '/static/img/main_achievement/collection/prince_back.png',
      title: 'Collected',
      tooltip:
        'Golden Tree SMTC rewards *4 Passive global share *300 Prince Chest weekly rewards 100 titles available'
    },
    {
      name: 'King',
      path: '/static/img/main_achievement/collection/king.png',
      path1: '/static/img/main_achievement/collection/king_back.png',
      title: 'Locked',
      tooltip:
        'Golden Tree SMTC rewards *5 Passive global share *700 King Chest weekly rewards 10 titles available'
    }
  ]
];
