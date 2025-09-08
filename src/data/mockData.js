import { addDays, subDays, format } from 'date-fns'

export const mockLeads = [
  {
    leadId: 'lead_1',
    name: 'Sarah Johnson',
    email: 'sarah@techstartup.io',
    company: 'TechStartup Inc',
    title: 'CEO',
    score: 95,
    segment: 'Hot',
    lastActivity: subDays(new Date(), 2).toISOString(),
    source: 'Website',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    status: 'New'
  },
  {
    leadId: 'lead_2', 
    name: 'Michael Chen',
    email: 'mchen@innovatecorp.com',
    company: 'Innovate Corp',
    title: 'VP of Sales',
    score: 82,
    segment: 'Hot',
    lastActivity: subDays(new Date(), 1).toISOString(),
    source: 'LinkedIn',
    phone: '+1-555-0124',
    location: 'New York, NY',
    status: 'Contacted'
  },
  {
    leadId: 'lead_3',
    name: 'Emily Rodriguez',
    email: 'emily@gmail.com',
    company: 'Freelance',
    title: 'Marketing Consultant',
    score: 45,
    segment: 'Cold',
    lastActivity: subDays(new Date(), 15).toISOString(),
    source: 'Referral',
    phone: '+1-555-0125',
    location: 'Austin, TX',
    status: 'Qualified'
  },
  {
    leadId: 'lead_4',
    name: 'David Kim',
    email: 'david@megacorp.enterprise',
    company: 'MegaCorp Enterprise',
    title: 'Director of Operations',
    score: 88,
    segment: 'Hot',
    lastActivity: subDays(new Date(), 3).toISOString(),
    source: 'Cold Email',
    phone: '+1-555-0126',
    location: 'Seattle, WA',
    status: 'Proposal Sent'
  },
  {
    leadId: 'lead_5',
    name: 'Lisa Thompson',
    email: 'lisa@smallbiz.net',
    company: 'Small Biz LLC',
    title: 'Manager',
    score: 63,
    segment: 'Warm',
    lastActivity: subDays(new Date(), 7).toISOString(),
    source: 'Social Media',
    phone: '+1-555-0127',
    location: 'Denver, CO',
    status: 'Follow-up'
  },
  {
    leadId: 'lead_6',
    name: 'James Wilson',
    email: 'james@yahoo.com',
    company: 'Personal',
    title: 'Entrepreneur',
    score: 35,
    segment: 'Nurture',
    lastActivity: subDays(new Date(), 45).toISOString(),
    source: 'Event',
    phone: '+1-555-0128',
    location: 'Miami, FL',
    status: 'Not Interested'
  }
]

export const mockSequences = [
  {
    sequenceId: 'seq_1',
    userId: 'user_1',
    name: 'Hot Lead Outreach',
    description: 'Aggressive follow-up for high-scoring leads',
    steps: [
      {
        stepId: 'step_1_1',
        order: 1,
        type: 'email',
        subject: 'Quick question about {{company}}',
        content: 'Hi {{name}},\n\nI noticed {{company}} is growing fast. Are you looking for ways to streamline your sales process?\n\nBest,\nTeam',
        delay: 0
      },
      {
        stepId: 'step_1_2', 
        order: 2,
        type: 'email',
        subject: 'Following up on my previous email',
        content: 'Hi {{name}},\n\nJust wanted to follow up on my previous email. Would love to show you how we can help {{company}} increase conversions.\n\nBest,\nTeam',
        delay: 3
      },
      {
        stepId: 'step_1_3',
        order: 3,
        type: 'email', 
        subject: 'Last follow-up',
        content: 'Hi {{name}},\n\nThis is my last follow-up. If you\'re interested in learning more, please let me know.\n\nBest,\nTeam',
        delay: 7
      }
    ],
    triggerConditions: {
      segments: ['Hot'],
      minScore: 80
    },
    isActive: true,
    stats: {
      sent: 45,
      opened: 32,
      clicked: 18,
      replied: 8,
      openRate: 71.1,
      clickRate: 40.0,
      replyRate: 17.8
    }
  },
  {
    sequenceId: 'seq_2',
    userId: 'user_1', 
    name: 'Warm Lead Nurture',
    description: 'Educational content for warm prospects',
    steps: [
      {
        stepId: 'step_2_1',
        order: 1,
        type: 'email',
        subject: 'How {{company}} can improve lead conversion',
        content: 'Hi {{name}},\n\nI came across {{company}} and thought you might find this case study interesting about how similar companies improved their conversion rates.\n\nBest,\nTeam',
        delay: 0
      },
      {
        stepId: 'step_2_2',
        order: 2, 
        type: 'email',
        subject: 'Free resource for {{company}}',
        content: 'Hi {{name}},\n\nI wanted to share this free guide that might help {{company}} with lead scoring. Would you like me to send it over?\n\nBest,\nTeam',
        delay: 5
      }
    ],
    triggerConditions: {
      segments: ['Warm'],
      minScore: 60
    },
    isActive: true,
    stats: {
      sent: 28,
      opened: 19,
      clicked: 8,
      replied: 3,
      openRate: 67.9,
      clickRate: 28.6,
      replyRate: 10.7
    }
  },
  {
    sequenceId: 'seq_3',
    userId: 'user_1',
    name: 'Cold Lead Warming',
    description: 'Long-term nurturing for cold prospects',
    steps: [
      {
        stepId: 'step_3_1',
        order: 1,
        type: 'email',
        subject: 'Thought you might find this interesting',
        content: 'Hi {{name}},\n\nSaw an article about trends in your industry and thought of {{company}}. Worth a read if you have a moment.\n\nBest,\nTeam',
        delay: 0
      }
    ],
    triggerConditions: {
      segments: ['Cold'],
      minScore: 40
    },
    isActive: false,
    stats: {
      sent: 12,
      opened: 6,
      clicked: 2,
      replied: 0,
      openRate: 50.0,
      clickRate: 16.7,
      replyRate: 0
    }
  }
]

export const mockActivities = [
  {
    activityId: 'activity_1',
    leadId: 'lead_1',
    type: 'email_opened',
    timestamp: subDays(new Date(), 1).toISOString(),
    details: { sequenceId: 'seq_1', stepId: 'step_1_1' }
  },
  {
    activityId: 'activity_2', 
    leadId: 'lead_2',
    type: 'email_clicked',
    timestamp: subDays(new Date(), 2).toISOString(),
    details: { sequenceId: 'seq_1', stepId: 'step_1_2' }
  },
  {
    activityId: 'activity_3',
    leadId: 'lead_3', 
    type: 'website_visit',
    timestamp: subDays(new Date(), 5).toISOString(),
    details: { page: '/pricing' }
  }
]

export const mockAnalytics = {
  overview: {
    totalLeads: 156,
    activeSequences: 8,
    totalSent: 1247,
    avgOpenRate: 68.5,
    avgClickRate: 32.1,
    avgReplyRate: 14.2
  },
  leadsBySegment: [
    { segment: 'Hot', count: 23, percentage: 14.7 },
    { segment: 'Warm', count: 45, percentage: 28.8 },
    { segment: 'Cold', count: 67, percentage: 43.0 },
    { segment: 'Nurture', count: 21, percentage: 13.5 }
  ],
  sequencePerformance: [
    { date: '2024-01-01', sent: 45, opened: 32, clicked: 18, replied: 8 },
    { date: '2024-01-02', sent: 52, opened: 38, clicked: 22, replied: 12 },
    { date: '2024-01-03', sent: 48, opened: 35, clicked: 19, replied: 9 },
    { date: '2024-01-04', sent: 61, opened: 43, clicked: 28, replied: 15 },
    { date: '2024-01-05', sent: 55, opened: 41, clicked: 24, replied: 11 },
    { date: '2024-01-06', sent: 49, opened: 34, clicked: 20, replied: 8 },
    { date: '2024-01-07', sent: 58, opened: 42, clicked: 26, replied: 13 }
  ]
}