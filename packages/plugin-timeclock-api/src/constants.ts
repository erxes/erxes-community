export const PRELIMINARY_REPORT_COLUMNS = [
  '№',
  'Ажилтаны код',
  'Овог',
  'Нэр',
  'Албан тушаал',
  'Ажиллавал зохих хоног',
  'Ажилласан хоног',
  'Тайлбар'
];
export const FINAL_REPORT_COLUMNS = [
  [
    ['Хүнтэй холбоотой мэдээлэл'],
    ['№', 'Ажилтаны код', 'Овог', 'Нэр', 'Албан тушаал']
  ],
  [['Ажиллах ёстой цаг'], ['Хоног', 'Цаг', 'Нийт цайны цаг']],
  [
    ['Цалин бодох мэдээлэл'],
    [
      'Ажилласан хоног',
      'Ажилласан цаг',
      'Илүү цаг 1.5',
      'Шөнийн цаг 1.2',
      'Нийт цайны цаг',
      'Нийт ажилласан цаг',
      'Хоцролт тооцох'
    ]
  ],
  [[' Томилолт'], ['Shift request', 'Томилолтоор ажилласан цаг']],
  [
    [' Ажилаагүй цагийн мэдээлэл'],
    [
      'Чөлөөтэй цаг цалинтай',
      'Чөлөөтэй цаг цалингүй',
      'Өвдсөн цаг /ХЧТАТ бодох цаг/'
    ]
  ]
];
export const PIVOT_REPORT_COLUMNS = [
  [
    ['Хүнтэй холбоотой мэдээлэл'],
    ['№', 'Ажилтаны код', 'Овог', 'Нэр', 'Албан тушаал']
  ],
  [['Хугацаа'], ['Өдөр']],
  [['Төлөвлөгөө'], ['Эхлэх', 'Дуусах', 'Нийт төлөвлөсөн', 'Цайны цаг']],
  [
    ['Performance'],
    [
      'Check In',
      'In Device',
      'Check Out',
      'Out Device',
      'Цайны цаг',
      'Шөнийн цаг',
      'Илүү цаг',
      'Нийт ажилласан',
      'Хоцролт'
    ]
  ]
];
