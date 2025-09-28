import { ICInspection, DashboardStats } from '@/types/auth';

// Dummy IC inspection data
export const DUMMY_INSPECTIONS: ICInspection[] = [
  {
    id: '1',
    workerEmail: 'worker1@company.com',
    workerName: 'John Smith',
    batchNumber: 'BATCH-2024-001',
    icImage: '/placeholder.svg',
    extractedText: 'STM32F407VGT6',
    status: 'authentic',
    confidence: 95,
    timestamp: new Date('2024-01-15T09:30:00'),
    notes: 'Clear markings, standard package'
  },
  {
    id: '2',
    workerEmail: 'worker1@company.com',
    workerName: 'John Smith',
    batchNumber: 'BATCH-2024-002',
    icImage: '/placeholder.svg',
    extractedText: 'ATMEGA328P-PU',
    status: 'suspicious',
    confidence: 65,
    timestamp: new Date('2024-01-15T10:15:00'),
    notes: 'Faded markings, requires review'
  },
  {
    id: '3',
    workerEmail: 'worker1@company.com',
    workerName: 'John Smith',
    batchNumber: 'BATCH-2024-003',
    icImage: '/placeholder.svg',
    extractedText: 'LM358N',
    status: 'fake',
    confidence: 85,
    timestamp: new Date('2024-01-15T11:00:00'),
    notes: 'Package type mismatch',
    supervisorReview: {
      reviewedBy: 'Sarah Johnson',
      action: 'rejected',
      comments: 'Confirmed counterfeit - incorrect date code format',
      reviewedAt: new Date('2024-01-15T14:30:00')
    }
  },
  {
    id: '4',
    workerEmail: 'worker1@company.com',
    workerName: 'John Smith',
    batchNumber: 'BATCH-2024-004',
    icImage: '/placeholder.svg',
    extractedText: 'NE555P',
    status: 'authentic',
    confidence: 92,
    timestamp: new Date('2024-01-16T08:45:00'),
    notes: 'Standard markings, good condition'
  },
  {
    id: '5',
    workerEmail: 'worker1@company.com',
    workerName: 'John Smith',
    batchNumber: 'BATCH-2024-005',
    icImage: '/placeholder.svg',
    extractedText: 'ESP32-WROOM-32',
    status: 'suspicious',
    confidence: 72,
    timestamp: new Date('2024-01-16T09:20:00'),
    notes: 'Unusual font weight on markings'
  }
];

// Dummy OEM datasheet for reference
export const DUMMY_OEM_DATABASE = {
  'STM32F407VGT6': {
    manufacturer: 'STMicroelectronics',
    package: 'LQFP-100',
    expectedMarkings: ['STM32F407VGT6', 'ARM', 'CORTEX-M4'],
    dateCodePattern: /^\d{4}$/,
    knownCounterfeits: ['incorrect font', 'wrong package size']
  },
  'ATMEGA328P-PU': {
    manufacturer: 'Microchip',
    package: 'PDIP-28',
    expectedMarkings: ['ATMEGA328P-PU', 'ATMEL'],
    dateCodePattern: /^\d{4}$/,
    knownCounterfeits: ['missing logo', 'incorrect pin count']
  },
  'LM358N': {
    manufacturer: 'Texas Instruments',
    package: 'PDIP-8',
    expectedMarkings: ['LM358N', 'TI'],
    dateCodePattern: /^\d{4}$/,
    knownCounterfeits: ['wrong package', 'incorrect date format']
  }
};

export const getDashboardStats = (): DashboardStats => {
  const totalScans = DUMMY_INSPECTIONS.length;
  const authenticCount = DUMMY_INSPECTIONS.filter(i => i.status === 'authentic').length;
  const suspiciousCount = DUMMY_INSPECTIONS.filter(i => i.status === 'suspicious').length;
  const fakeCount = DUMMY_INSPECTIONS.filter(i => i.status === 'fake').length;
  const pendingReview = DUMMY_INSPECTIONS.filter(i => i.status === 'suspicious' && !i.supervisorReview).length;

  return {
    totalScans,
    authenticCount,
    suspiciousCount,
    fakeCount,
    pendingReview
  };
};

// Generate chart data for analytics
export const getChartData = () => {
  const stats = getDashboardStats();
  
  return {
    pieData: [
      { name: 'Authentic', value: stats.authenticCount, color: '#10b981' },
      { name: 'Suspicious', value: stats.suspiciousCount, color: '#f59e0b' },
      { name: 'Fake', value: stats.fakeCount, color: '#ef4444' }
    ],
    lineData: [
      { date: '2024-01-14', scans: 3 },
      { date: '2024-01-15', scans: 5 },
      { date: '2024-01-16', scans: 8 },
      { date: '2024-01-17', scans: 6 },
      { date: '2024-01-18', scans: 4 },
      { date: '2024-01-19', scans: 7 },
      { date: '2024-01-20', scans: 9 }
    ]
  };
};