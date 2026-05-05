// Saudi schools mock data for School Payment Management System

export const SCHOOLS = [
  { id: 'SCH001', name: 'مدرسة الملك فهد الابتدائية', nameEn: 'King Fahd Primary School', region: 'الرياض' },
  { id: 'SCH002', name: 'مدرسة النور الثانوية للبنات', nameEn: 'Al-Noor Secondary School for Girls', region: 'جدة' },
  { id: 'SCH003', name: 'مدرسة الأمل الدولية', nameEn: 'Al-Amal International School', region: 'الدمام' },
  { id: 'SCH004', name: 'مدرسة الفيصلية المتوسطة', nameEn: 'Al-Faisaliyah Middle School', region: 'مكة المكرمة' },
  { id: 'SCH005', name: 'مدرسة الرياض النموذجية', nameEn: 'Riyadh Model School', region: 'الرياض' },
  { id: 'SCH006', name: 'المدرسة السعودية للتميز', nameEn: 'Saudi Excellence School', region: 'المدينة المنورة' },
  { id: 'SCH007', name: 'مدرسة الجزيرة العربية', nameEn: 'Arabian Peninsula School', region: 'الرياض' },
  { id: 'SCH008', name: 'مدرسة التقدم العلمي', nameEn: 'Scientific Progress School', region: 'أبها' },
  { id: 'SCH009', name: 'مدرسة الوطن الابتدائية', nameEn: 'Al-Watan Primary School', region: 'تبوك' },
  { id: 'SCH010', name: 'مدرسة المستقبل الدولية', nameEn: 'Al-Mustaqbal International School', region: 'الرياض' },
]

export const USERS = [
  { id: 'USR001', username: 'ahmed.reviewer', password: '123456', nameAr: 'أحمد محمد الغامدي', nameEn: 'Ahmed Al-Ghamdi', role: 'reviewer', avatar: 'أ' },
  { id: 'USR002', username: 'sarah.approver', password: '123456', nameAr: 'سارة عبدالله الزهراني', nameEn: 'Sarah Al-Zahrani', role: 'approver', avatar: 'س' },
  { id: 'USR003', username: 'omar.reviewer', password: '123456', nameAr: 'عمر خالد العتيبي', nameEn: 'Omar Al-Otaibi', role: 'reviewer', avatar: 'ع' },
  { id: 'USR004', username: 'nora.approver', password: '123456', nameAr: 'نورة سلطان القحطاني', nameEn: 'Nora Al-Qahtani', role: 'approver', avatar: 'ن' },
]

const generateIBAN = (index) => {
  const suffixes = ['2940012345678901', '1830023456789012', '3720034567890123', '4610045678901234', '5500056789012345',
    '6490067890123456', '7380078901234567', '8270089012345678', '9160090123456789', '0050001234567890',
    '1940012345678902', '2830023456789013', '3720034567890124', '4610045678901235', '5500056789012346']
  return `SA${suffixes[index % suffixes.length]}`
}

const generateRef = (index) => `REF-${String(2024100 + index).padStart(7, '0')}`

const STATUSES = ['awaiting_review', 'under_review', 'approved', 'transferred', 'transfer_failed', 'completed']

const weightedStatus = (index) => {
  const weights = [
    { status: 'awaiting_review', count: 8 },
    { status: 'under_review', count: 6 },
    { status: 'approved', count: 4 },
    { status: 'transferred', count: 5 },
    { status: 'transfer_failed', count: 3 },
    { status: 'completed', count: 12 },
  ]
  const pool = weights.flatMap(w => Array(w.count).fill(w.status))
  return pool[index % pool.length]
}

const randomDate = (start, end) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString()
}

const start = new Date('2024-09-01')
const end = new Date('2024-11-30')

export const generateTransactions = () => {
  const txns = []
  for (let i = 0; i < 48; i++) {
    const school = SCHOOLS[i % SCHOOLS.length]
    const status = weightedStatus(i)
    const receivedDate = randomDate(start, end)
    const actionDate = status !== 'awaiting_review'
      ? new Date(new Date(receivedDate).getTime() + Math.random() * 3 * 86400000).toISOString()
      : null
    const amount = Math.round((Math.random() * 180000 + 20000) / 100) * 100
    const fee = Math.round(amount * (Math.random() * 0.005 + 0.002))
    const execFee = Math.round(amount * 0.001)
    const bankRef = (status === 'transferred' || status === 'transfer_failed' || status === 'completed')
      ? `BNK-${String(900000 + i * 13).padStart(6, '0')}` : null
    const failReason = status === 'transfer_failed'
      ? ['رقم IBAN غير صحيح', 'رصيد غير كافٍ', 'انتهت مهلة الاتصال', 'خطأ في بيانات المستفيد'][i % 4]
      : null
    const retryCount = status === 'transfer_failed' ? (i % 4) : 0

    txns.push({
      id: `TXN${String(i + 1).padStart(4, '0')}`,
      schoolId: school.id,
      schoolName: school.name,
      schoolNameEn: school.nameEn,
      region: school.region,
      amount,
      bankFee: fee,
      executiveFee: execFee,
      netAmount: amount - fee - execFee,
      referenceNumber: generateRef(i),
      iban: generateIBAN(i),
      receivedDate,
      actionDate,
      status,
      reviewerId: status !== 'awaiting_review' ? USERS[0].id : null,
      reviewerName: status !== 'awaiting_review' ? USERS[0].nameAr : null,
      approverId: ['approved', 'transferred', 'transfer_failed', 'completed'].includes(status) ? USERS[1].id : null,
      approverName: ['approved', 'transferred', 'transfer_failed', 'completed'].includes(status) ? USERS[1].nameAr : null,
      bankRef,
      failReason,
      retryCount,
      retryHistory: retryCount > 0 ? Array.from({ length: retryCount }, (_, ri) => ({
        attempt: ri + 1,
        date: new Date(new Date(actionDate).getTime() + ri * 35 * 60000).toISOString(),
        ref: `BNK-${String(900000 + i * 13 + ri + 1).padStart(6, '0')}`,
        result: ri < retryCount - 1 ? 'failed' : 'failed',
        reason: ['رقم IBAN غير صحيح', 'رصيد غير كافٍ', 'انتهت مهلة الاتصال'][ri % 3],
      })) : [],
      lastRetryDate: retryCount > 0
        ? new Date(new Date(actionDate).getTime() + (retryCount - 1) * 35 * 60000).toISOString()
        : null,
      notes: '',
    })
  }
  return txns
}
