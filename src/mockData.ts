import {
  Agent,
  VoiceOption,
  KnowledgeDocument,
  PhoneNumber,
  Lead,
  CallLog,
  PricingPlan,
  UserProfile,
  TeamMember,
  PlatformUser,
  Invoice,
  ActivityLog,
  AppNotification,
  IntegrationItem,
  OnboardingStep,
  PaymentConfig,
  PaymentRequest
} from './types';

export const INITIAL_USER: UserProfile = {
  name: 'তানভীর আহমেদ',
  businessName: 'AI Skill Hub BD',
  phone: '+880 1712-345678',
  email: 'tanvir@aiskillhub.bd',
  plan: 'Business',
  minutesUsed: 186,
  minutesLimit: 300,
  joinedDate: '১৫ জানুয়ারি, ২০২৪'
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'AI Skill Hub Receptionist',
    businessName: 'AI Skill Hub BD',
    type: 'Receptionist',
    language: 'বাংলা',
    personality: 'Professional',
    friendliness: 85,
    professionalism: 90,
    responseLength: 50,
    instructions: `আপনি AI Skill Hub BD-এর অফিশিয়াল AI receptionist।
কলারদের সাথে অত্যন্ত মিষ্টি, প্রফেশনাল ও সাবলীল বাংলায় কথা বলবেন।
১. AI Mastermind Course (মাস্টারমাইন্ড কোর্স): এটি আমাদের ফ্ল্যাগশিপ প্রিমিয়াম প্রোগ্রাম। কোর্স ফি মাত্র ৪,৫০০ টাকা (১০% স্পেশাল ডিসকাউন্টে মাত্র ৪,০৫০ টাকা)। মডিউল: পাইথন ফাউন্ডেশন, প্রম্পট ইঞ্জিনিয়ারিং, এআই অটোমেশন, চ্যাটবট ও রিয়েল-টাইম ভয়েস এজেন্ট ডেভেলপমেন্ট। ক্লাস হবে প্রতি শনি ও সোমবার রাত ৮টায় জুমে, এবং ধানমন্ডি ক্যাম্পাসে অফলাইন প্র্যাকটিক্যাল সেশন।
২. AI Innovators Club (এআই ক্লাব): আমাদের এক্সক্লুসিভ কমিউনিটি ক্লাব। ক্লাবের মেম্বাররা প্রতি সপ্তাহে লাইভ মাস্টারক্লাস, প্রিমিয়াম এআই টুলস এক্সেস, সরাসরি ইন্ডাস্ট্রি মেন্টরশিপ ও প্রজেক্ট কোলাবোরেশন সুবিধা পান। কোর্সে ভর্তি হওয়া সকল শিক্ষার্থী বিনামূল্যে ক্লাবের মেম্বারশিপ পান।
৩. ভর্তি ও কাউন্সেলিং: আগ্রহী কলারের নাম ও ফোন নম্বর সংগ্রহ করে এডমিশন টিমের জন্য লিড কনফার্ম করবেন।
৪. কলার যাই জিজ্ঞাসা করুক, কোনো অবস্থাতেই "কিছু জানি না" বা বিভ্রান্তিকর কথা বলবেন না। সম্পূর্ণ তথ্য সুন্দরভাবে উপস্থাপন করবেন।`,
    voiceId: 'voice-bn-female-1',
    elevenLabsVoiceId: 'cgSgspJ2msm6clMCkdW9',
    elevenLabsStatus: 'PERMISSION_REQUIRED',
    phoneNumberId: 'phone-1',
    phoneNumber: '+880 9612-887766',
    status: 'Active',
    isActive: true,
    totalCalls: 342,
    totalMinutes: 728,
    createdAt: '2024-02-01',
    knowledgeBaseCount: 4,
    leads: 68,
    versions: [
      {
        version: 3,
        date: '২২ সেপ্টেম্বর, ২০২৬',
        summary: 'রমজান ও ঈদ অফার কোর্স ফি ৳৪,৫০০ আপডেট ও লিড ফরম্যাট পরিমার্জন',
        changes: ['Instructions updated with new discount code', 'Added fallback for senior counselor', 'Response length lowered to 50%'],
        instructions: 'রমজান অফার কোর্স ফি ৳৪,৫০০ সংক্রান্ত তথ্য প্রদান ও এডমিশন সহায়তা।'
      },
      {
        version: 2,
        date: '২১ সেপ্টেম্বর, ২০২৬',
        summary: 'ভয়েস পরিবর্তন করে নিলুফার (প্রমিত ঢাকা অ্যাকসেন্ট) নির্ধারণ',
        changes: ['Voice changed from voice-bn-female-2 to voice-bn-female-1', 'Friendliness adjusted to 85%']
      },
      {
        version: 1,
        date: '২০ সেপ্টেম্বর, ২০২৬',
        summary: 'এজেন্টের প্রাথমিক খসড়া ও নলেজ বেস লিঙ্কিং সম্পন্ন',
        changes: ['Agent created', 'Assigned phone number +880 9612-887766', 'Uploaded Course_Curriculum.pdf']
      }
    ]
  },
  {
    id: 'agent-2',
    name: 'Rahim Electronics Sales Agent',
    businessName: 'Rahim Electronics',
    type: 'Sales Agent',
    language: 'Banglish',
    personality: 'Sales Assistant',
    friendliness: 95,
    professionalism: 75,
    responseLength: 60,
    instructions: `আপনি Rahim Electronics-এর একজন স্মার্ট ও ফ্রেন্ডলি Sales Agent।
কাস্টমার ইনকোয়ারি শুনে সেরা টিভি, ফ্রিজ ও এসি মডেল রেকমেন্ড করুন।
বর্তমানে চলমান ঈদ অফার এবং ১০% ডিসকাউন্ট ভাউচার কোড 'EID2024' সম্পর্কে অবহিত করুন।
হোম ডেলিভারির জন্য কাস্টমারের বর্তমান লোকেশন ও ক্যাশ অন ডেলিভারি প্রেফারেন্স নোট করুন।`,
    voiceId: 'voice-bn-male-1',
    phoneNumberId: 'phone-2',
    phoneNumber: '+880 9638-112233',
    status: 'Active',
    isActive: true,
    totalCalls: 189,
    totalMinutes: 412,
    createdAt: '2024-02-10',
    knowledgeBaseCount: 2,
    leads: 41,
    versions: [
      {
        version: 2,
        date: '১৫ সেপ্টেম্বর, ২০২৬',
        summary: 'Banglish মডেল অপ্টিমাইজেশন ও টিভি ডিসকাউন্ট প্রোমোশন যুক্ত করা হয়েছে',
        changes: ['Language set to Banglish conversational', 'Cash-on-delivery check added']
      },
      {
        version: 1,
        date: '১০ সেপ্টেম্বর, ২০২৬',
        summary: 'Initial Agent created for sales leads',
        changes: ['Initial creation with male voice']
      }
    ]
  },
  {
    id: 'agent-3',
    name: 'ABC Pharmacy Helpline',
    businessName: 'ABC Pharmacy',
    type: 'Customer Support',
    language: 'বাংলা',
    personality: 'Formal',
    friendliness: 80,
    professionalism: 95,
    responseLength: 40,
    instructions: `আপনি ABC Pharmacy-এর সাপোর্ট এজেন্ট।
কাস্টমারকে প্রেসক্রিপশন আপলোড এবং নিকটস্থ আউটলেটের ওপেনিং আওয়ার (সকাল ৮টা থেকে রাত ১২টা) সংক্রান্ত তথ্য দিন।
জরুরি মেডিসিন হোম ডেলিভারির জন্য প্রেসক্রিপশন নিশ্চিত করতে বলুন। কখনো অননুমোদিত মেডিকেল পরামর্শ দেবেন না।`,
    voiceId: 'voice-bn-female-2',
    status: 'Paused',
    isActive: false,
    totalCalls: 64,
    totalMinutes: 128,
    createdAt: '2024-02-18',
    knowledgeBaseCount: 1,
    leads: 12,
    versions: [
      {
        version: 1,
        date: '১৮ ফেব্রুয়ারি, ২০২৪',
        summary: 'ফার্মেসি সাপোর্ট হেল্পলাইন ইনিশিয়ালাইজেশন',
        changes: ['Created formal health disclaimer script']
      }
    ]
  }
];

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'voice-bn-female-1',
    name: 'নিলুফার (Bangla Female)',
    gender: 'Female',
    style: 'Natural Bangladeshi voice',
    language: 'বাংলা (Dhaka Accent)',
    accent: 'প্রমিত বাংলা',
    sampleAudioText: 'আসসালামু আলাইকুম! VoiceAI BD-তে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?'
  },
  {
    id: 'voice-bn-male-1',
    name: 'ফারহান (Bangla Male)',
    gender: 'Male',
    style: 'Professional Bangladeshi voice',
    language: 'বাংলা (Standard)',
    accent: 'ব্যবসায়িক গম্ভীর কণ্ঠ',
    sampleAudioText: 'নমস্কার, রহিম ইলেকট্রনিক্সে কল করার জন্য ধন্যবাদ। আমাদের নতুন অফার জানতে চান?'
  },
  {
    id: 'voice-bn-female-2',
    name: 'অনন্যা (Banglish Casual)',
    gender: 'Female',
    style: 'Urban youth conversational',
    language: 'Banglish',
    accent: 'মডার্ন ও ফ্রেন্ডলি',
    sampleAudioText: 'Hey there! আমাদের কোর্স নিয়ে কোনো inquiry থাকলে আমাকে নির্দ্বিধায় জিজ্ঞেস করতে পারেন।'
  },
  {
    id: 'voice-en-male-1',
    name: 'আরিফ (English Corporate)',
    gender: 'Male',
    style: 'International Business English',
    language: 'English (South Asian)',
    accent: 'Global Corporate',
    sampleAudioText: 'Hello and welcome to VoiceAI BD enterprise support. How can I direct your call?'
  }
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'doc-mastermind',
    fileName: 'AI_Mastermind_Course_and_Club_Guide.pdf',
    size: '1.8 MB',
    uploadDate: '2024-03-01',
    status: 'Ready',
    type: 'PDF',
    previewExcerpt: 'AI Mastermind Course: ফি ৪,৫০০ টাকা (১০% অফারে ৪,০৫০ টাকা)। পাইথন, প্রম্পট ইঞ্জিনিয়ারিং, অটোমেশন ও ভয়েস এজেন্ট। AI Innovators Club: উইকলি লাইভ মাস্টারক্লাস, ফ্রি প্রিমিয়াম এআই টুলস, নেটওয়ার্কিং ও ক্যারিয়ার সাপোর্ট।',
    itemCount: 56
  },
  {
    id: 'doc-1',
    fileName: 'Course_Curriculum_2026.pdf',
    size: '1.4 MB',
    uploadDate: '2024-02-05',
    status: 'Ready',
    type: 'PDF',
    previewExcerpt: 'মডিউল ১: পাইথন বেসিকস ও এআই ফাউন্ডেশন। মডিউল ২: প্রম্পট ইঞ্জিনিয়ারিং ও এলএলএম। মডিউল ৩: ভয়েস এজেন্ট আর্কিটেকচার। ফি: ৪,৫০০ টাকা।',
    itemCount: 42
  },
  {
    id: 'doc-2',
    fileName: 'FAQ_and_Admission_Policy.pdf',
    size: '850 KB',
    uploadDate: '2024-02-12',
    status: 'Ready',
    type: 'PDF',
    previewExcerpt: 'ভর্তি প্রক্রিয়া: অনলাইনে বিকাশ বা কার্ডে পেমেন্ট করে এডমিশন ফর্ম পূরণ করতে হবে। ক্লাস রেকর্ডিং ও মেন্টর সাপোর্ট সার্বক্ষণিক থাকবে।',
    itemCount: 28
  },
  {
    id: 'doc-3',
    fileName: 'Pricing_and_Discounts.txt',
    size: '120 KB',
    uploadDate: '2024-02-20',
    status: 'Ready',
    type: 'TXT',
    previewExcerpt: 'চলমান অফার: শিক্ষার্থীদের জন্য ১০% ছাড় (প্রমোকোড: STUDENT10)। এককালীন ফি পরিশোধে অতিরিক্ত ৫% ক্যাশব্যাক।',
    itemCount: 15
  },
  {
    id: 'doc-4',
    fileName: 'Office_Locations_and_Timings.docx',
    size: '420 KB',
    uploadDate: '2024-02-28',
    status: 'Ready',
    type: 'DOCX',
    previewExcerpt: 'প্রধান ক্যাম্পাস: বাড়ি #৪৫, রোড #৭/এ, ধানমন্ডি, ঢাকা-১২০৯। হেল্পলাইন সময়: প্রতিদিন সকাল ৯:০০ টা থেকে রাত ১০:০০ টা।',
    itemCount: 8
  }
];

export const INITIAL_PHONE_NUMBERS: PhoneNumber[] = [
  {
    id: 'phone-1',
    number: '+880 9612-887766',
    provider: 'IP Telephony Provider',
    status: 'Connected',
    connectedAgentId: 'agent-1',
    connectedAgentName: 'AI Skill Hub Receptionist',
    sipEndpoint: 'sip.dhakatelecom.net:5060',
    country: 'Bangladesh 🇧🇩',
    monthlyFee: 450
  },
  {
    id: 'phone-2',
    number: '+880 9638-112233',
    provider: 'SIP Provider',
    status: 'Connected',
    connectedAgentId: 'agent-2',
    connectedAgentName: 'Rahim Electronics Sales Agent',
    sipEndpoint: 'sip.btclgateway.bd:5060',
    country: 'Bangladesh 🇧🇩',
    monthlyFee: 450
  },
  {
    id: 'phone-3',
    number: '+880 9666-445566',
    provider: 'Custom SIP',
    status: 'Available',
    country: 'Bangladesh 🇧🇩',
    monthlyFee: 350
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Rahim Ahmed',
    phone: '+8801712345678',
    interest: 'AI Mastering Course',
    agentId: 'agent-1',
    agentName: 'AI Skill Hub Receptionist',
    status: 'HOT',
    score: 94,
    scoreFactors: {
      interestScore: 95,
      engagementScore: 92,
      purchaseIntentScore: 96,
      followUpRequested: true
    },
    timeline: [
      { step: 'Call Received', time: '10:42 AM', description: 'Incoming call connected via +880 9612-887766', completed: true },
      { step: 'AI Detected High Intent', time: '10:43 AM', description: 'Caller explicitly inquired about immediate enrollment & discounts', completed: true },
      { step: 'Phone & Education Collected', time: '10:44 AM', description: 'Caller confirmed number +8801712345678 and HSC background', completed: true },
      { step: 'Hot Lead Qualified', time: '10:45 AM', description: 'Simulated score calculated at 94/100', completed: true },
      { step: 'Admission Team Follow-up', time: 'Pending', description: 'WhatsApp SMS notification dispatched to counselor', completed: false }
    ],
    date: 'আজ, ১০:৪২ AM',
    notes: 'অফলাইন ব্যাচে ভর্তি হতে আগ্রহী। মিরপুর থেকে ধানমন্ডি ক্যাম্পাসে আসবেন।',
    education: 'HSC Passed / University 1st Year',
    preferredMode: 'Offline'
  },
  {
    id: 'lead-2',
    name: 'নুসরাত জাহান',
    phone: '+8801812345678',
    interest: 'Smart 4K TV Discount',
    agentId: 'agent-2',
    agentName: 'Rahim Electronics Sales',
    status: 'WARM',
    score: 82,
    scoreFactors: {
      interestScore: 85,
      engagementScore: 80,
      purchaseIntentScore: 81,
      followUpRequested: true
    },
    timeline: [
      { step: 'Call Received', time: '09:15 AM', description: 'Inbound call connected to Sales Agent', completed: true },
      { step: 'Product Inquired', time: '09:16 AM', description: '55" Sony Bravia 4K TV inventory verified', completed: true },
      { step: 'Delivery Location Logged', time: '09:17 AM', description: 'Home delivery requested in Uttara Sector 7', completed: true },
      { step: 'Follow-up Scheduled', time: '12:00 PM', description: 'Sales rep to confirm voucher application', completed: false }
    ],
    date: 'আজ, ০৯:১৫ AM',
    notes: '৫৫ ইঞ্চি সনি ব্রাভিয়া টিভির জন্য বর্তমান ডিসকাউন্ট জানতে চেয়েছেন। ক্যাশ অন ডেলিভারি চাই।',
    education: 'N/A',
    preferredMode: 'Home Delivery'
  },
  {
    id: 'lead-3',
    name: 'কামাল হোসেন',
    phone: '+8801912345678',
    interest: 'Python for AI Weekend Batch',
    agentId: 'agent-1',
    agentName: 'AI Skill Hub Receptionist',
    status: 'FOLLOW UP',
    score: 74,
    scoreFactors: {
      interestScore: 78,
      engagementScore: 72,
      purchaseIntentScore: 71,
      followUpRequested: true
    },
    timeline: [
      { step: 'Call Received', time: 'গতকাল, ০৪:৩০ PM', description: 'Call lasted 2m 45s', completed: true },
      { step: 'Timing Constraint Identified', time: 'গতকাল, ০৪:৩১ PM', description: 'Evening corporate hours requested', completed: true },
      { step: 'Weekend Slot Assigned', time: 'Yesterday', description: 'Pending confirmation of seat availability', completed: true }
    ],
    date: 'গতকাল, ০৪:৩০ PM',
    notes: 'অফিস চাকুরিজীবী, শুধুমাত্র শুক্রবার ও শনিবার সান্ধ্যকালীন ক্লাসের স্লট দরকার।',
    education: 'B.Sc in EEE',
    preferredMode: 'Online'
  },
  {
    id: 'lead-4',
    name: 'মেহেদী হাসান',
    phone: '+8801612987654',
    interest: 'Inverter AC Installation',
    agentId: 'agent-2',
    agentName: 'Rahim Electronics Sales',
    status: 'HOT',
    score: 91,
    scoreFactors: {
      interestScore: 92,
      engagementScore: 89,
      purchaseIntentScore: 93,
      followUpRequested: true
    },
    timeline: [
      { step: 'Call Received', time: 'গতকাল, ০২:১০ PM', description: 'Lead collected from AC summer campaign', completed: true },
      { step: 'Installation Address Noted', time: 'গতকাল, ০২:১২ PM', description: 'Gulshan 2 apartment installation', completed: true },
      { step: 'Confirmed Purchase Intent', time: 'গতকাল, ০২:১৩ PM', description: 'Ready to order 1.5 Ton Gree AC', completed: true }
    ],
    date: 'গতকাল, ০২:১০ PM',
    notes: '১.৫ টন গ্রি এসি কেনার ফাইনাল ডিসিশন। ফ্রি ইন্সটলেশন অফার চেয়েছেন।',
    education: 'N/A',
    preferredMode: 'Call for Confirmation'
  },
  {
    id: 'lead-5',
    name: 'সাবরিনা ইসলাম',
    phone: '+8801512341234',
    interest: 'General Pharmacy Inquiry',
    agentId: 'agent-3',
    agentName: 'ABC Pharmacy Helpline',
    status: 'NOT INTERESTED',
    score: 28,
    scoreFactors: {
      interestScore: 30,
      engagementScore: 25,
      purchaseIntentScore: 20,
      followUpRequested: false
    },
    timeline: [
      { step: 'Call Received', time: '২ দিন আগে', description: 'Inquired about closed branch hours', completed: true },
      { step: 'No Product Ordered', time: '২ দিন আগে', description: 'Customer resolved issue independently', completed: true }
    ],
    date: '২ দিন আগে',
    notes: 'শুধুমাত্র ধানমন্ডি ব্রাঞ্চের ফোন নাম্বার চেয়েছেন। কোনো প্রেসক্রিপশন মেডিসিন লাগবে না।',
    education: 'N/A',
    preferredMode: 'Resolved'
  }
];

export const INITIAL_CALLS: CallLog[] = [
  {
    id: 'call-1',
    caller: '+880 1712-345678',
    agentId: 'agent-1',
    agentName: 'AI Skill Hub Receptionist',
    duration: '02:31',
    durationSeconds: 151,
    language: 'বাংলা',
    status: 'Qualified Lead',
    date: 'আজ, ১০:৪২ AM',
    timestamp: '2026-09-19T10:42:00Z',
    summary: 'কলার AI Mastering Course-এর ফি এবং অফলাইন ব্যাচ সম্পর্কে বিশদ জেনেছেন। নাম ও নম্বর দিয়ে এডমিশন কনফার্মেশনের জন্য অনুরোধ করেছেন।',
    transcript: [
      { speaker: 'AI', text: 'আসসালামু আলাইকুম, AI Skill Hub BD-তে স্বাগতম। আমি আপনার কীভাবে সাহায্য করতে পারি?', time: '00:02' },
      { speaker: 'Caller', text: 'ওয়ালাইকুম আসসালাম। আপনাদের AI কোর্সের বিস্তারিত এবং কোর্স ফি কত জানতে চাচ্ছিলাম।', time: '00:08' },
      { speaker: 'AI', text: 'ধন্যবাদ আপনার আগ্রহের জন্য! আমাদের AI Mastering Course ৩ মাসের একটি প্রফেশনাল প্রোগ্রাম। বর্তমানে কোর্স ফি ৪,৫০০ টাকা। আপনি কি অনলাইন নাকি ধানমন্ডি ক্যাম্পাসের অফলাইন ব্যাচে করতে চান?', time: '00:18' },
      { speaker: 'Caller', text: 'আমি অফলাইন ক্লাসে আসতে চাই। আমার নাম রহিম আহমেদ, মিরপুরে থাকি।', time: '00:26' },
      { speaker: 'AI', text: 'অনেক ধন্যবাদ রহিম ভাই! আপনার ফোন নম্বরটি কি 01712-345678? আমাদের এডমিশন টিম আপনার সাথে দ্রুত যোগাযোগ করে সিট কনফার্ম করবে।', time: '00:38' },
      { speaker: 'Caller', text: 'হ্যাঁ, এটাই আমার নম্বর। ধন্যবাদ আপু।', time: '00:44' },
      { speaker: 'AI', text: 'আপনাকেও অনেক ধন্যবাদ। শুভ দিন!', time: '00:48' }
    ],
    leadCollected: {
      name: 'Rahim Ahmed',
      phone: '+880 1712-345678',
      interest: 'AI Mastering Course (Offline Batch)',
      intent: 'Immediate Admission'
    }
  },
  {
    id: 'call-2',
    caller: '+880 1812-345678',
    agentId: 'agent-2',
    agentName: 'Rahim Electronics Sales',
    duration: '01:45',
    durationSeconds: 105,
    language: 'Banglish',
    status: 'Interested',
    date: 'আজ, ০৯:১৫ AM',
    timestamp: '2026-09-19T09:15:00Z',
    summary: '৫৫ ইঞ্চি সনি ব্রাভিয়া স্মার্ট টিভির স্টক ও ডিসকাউন্ট সম্পর্কে অনুসন্ধান করেছেন।',
    transcript: [
      { speaker: 'AI', text: 'Hello! Rahim Electronics-এ কল করার জন্য ধন্যবাদ। কীভাবে হেল্প করতে পারি?', time: '00:02' },
      { speaker: 'Caller', text: 'আপনাদের শোরুমে কি Sony Bravia 55 inch TV available আছে? ডিসকাউন্ট কত দিচ্ছেন?', time: '00:09' },
      { speaker: 'AI', text: 'জী ভাইয়া, এক্সেক্টলি! আমাদের কাছে Sony Bravia 55 inch 4K মডেল রেডি স্টক আছে। এখন স্পেশাল ঈদুল অফারে ১০% ইনস্ট্যান্ট ডিসকাউন্ট চলছে। আপনি কি হোম ডেলিভারি চান?', time: '00:24' },
      { speaker: 'Caller', text: 'হ্যাঁ, উত্তরা ৭ নম্বরে ডেলিভারি হলে ক্যাশ অন ডেলিভারি দেওয়া যাবে?', time: '00:32' },
      { speaker: 'AI', text: 'অবশ্যই ভাইয়া! আমাদের ডেলিভারি টিম ২৪ ঘণ্টার মধ্যে পৌঁছাবে এবং আপনি চেক করে পে করতে পারবেন।', time: '00:42' }
    ]
  },
  {
    id: 'call-3',
    caller: '+880 1912-345678',
    agentId: 'agent-1',
    agentName: 'AI Skill Hub Receptionist',
    duration: '03:12',
    durationSeconds: 192,
    language: 'বাংলা',
    status: 'Follow-up Needed',
    date: 'গতকাল, ০৪:৩০ PM',
    timestamp: '2026-09-18T16:30:00Z',
    summary: 'চাকুরিজীবী শিক্ষার্থী সান্ধ্যকালীন ক্লাসের রুটিন জানতে চেয়েছেন। শুক্রবারের ব্যাচ সিডিউল শেয়ার করা হয়েছে।',
    transcript: [
      { speaker: 'AI', text: 'আসসালামু আলাইকুম! AI Skill Hub BD-তে আপনাকে স্বাগতম।', time: '00:02' },
      { speaker: 'Caller', text: 'আমি জব করি। আপনাদের কি কোনো ফ্রাইডে-স্যাটারডে উইকেন্ড ব্যাচ আছে?', time: '00:08' },
      { speaker: 'AI', text: 'জী জনাব! আমাদের শুধুমাত্র চাকরিজীবীদের জন্য স্পেশাল উইকেন্ড ব্যাচ রয়েছে, যা প্রতি শুক্রবার ও শনিবার সন্ধ্যা ৭টা থেকে অনুষ্ঠিত হয়।', time: '00:21' }
    ]
  },
  {
    id: 'call-4',
    caller: '+880 1612-987654',
    agentId: 'agent-2',
    agentName: 'Rahim Electronics Sales',
    duration: '02:05',
    durationSeconds: 125,
    language: 'Banglish',
    status: 'Qualified Lead',
    date: 'গতকাল, ০২:১০ PM',
    timestamp: '2026-09-18T14:10:00Z',
    summary: 'গ্রি ১.৫ টন ইনভার্টার এসির ফ্রি ইনস্টলেশন অফার যাচাই করে অর্ডার বুক করতে চেয়েছেন।',
    transcript: [
      { speaker: 'AI', text: 'Welcome to Rahim Electronics! আজ কোন এপ্লায়েন্স নিয়ে জানতে চান?', time: '00:02' },
      { speaker: 'Caller', text: 'Gree 1.5 ton Inverter AC-র ফ্রি ইনস্টলেশন আছে কি না জানতে চাই।', time: '00:08' }
    ]
  },
  {
    id: 'call-5',
    caller: '+880 1512-341234',
    agentId: 'agent-3',
    agentName: 'ABC Pharmacy Helpline',
    duration: '00:54',
    durationSeconds: 54,
    language: 'বাংলা',
    status: 'Resolved',
    date: '২ দিন আগে',
    timestamp: '2026-09-17T11:00:00Z',
    summary: 'ধানমন্ডি ব্রাঞ্চের খোলা থাকার সময়সূচি জেনে কল শেষ করেছেন।',
    transcript: [
      { speaker: 'AI', text: 'আসসালামু আলাইকুম, ABC Pharmacy হেল্পলাইনে আপনাকে স্বাগতম।', time: '00:02' },
      { speaker: 'Caller', text: 'আপনাদের ধানমন্ডি আউটলেট কি আজ রাত ১০টা পর্যন্ত খোলা থাকবে?', time: '00:08' },
      { speaker: 'AI', text: 'জী, আমাদের ধানমন্ডি আউটলেট প্রতিদিন সকাল ৮টা থেকে রাত ১২টা পর্যন্ত খোলা থাকে। জরুরি প্রয়োজনে হোম ডেলিভারিও উপলব্ধ।', time: '00:20' }
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    priceLabel: '৳৯৯৯ / মাস',
    billingCycle: 'মাসিক বিলিং',
    agentLimit: 1,
    minutesLimit: 100,
    features: [
      '১টি AI Voice Agent',
      '১০০ মিনিট ভয়েস কল প্রতি মাসে',
      '১টি দেশীয় (+880) ভার্চুয়াল নম্বর',
      'বাংলা ও Banglish কথন সাপোর্ট',
      'বেসিক কল অ্যানালিটিক্স ও হিস্ট্রি',
      'ইমেইল নোটিফিকেশন'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 1999,
    priceLabel: '৳১,৯৯৯ / মাস',
    billingCycle: 'মাসিক বিলিং',
    agentLimit: 3,
    minutesLimit: 300,
    recommended: true,
    features: [
      '৩টি সম্পূর্ণ কাস্টম AI Voice Agent',
      '৩০০ মিনিট প্রিমিয়াম ভয়েস কল',
      '২টি ডেডিকেটেড (+880) ফোন নম্বর',
      'স্মার্ট Knowledge Base (PDF / FAQ)',
      'তাৎক্ষণিক WhatsApp & SMS লিড অ্যালার্ট',
      'Google Sheets & Webhook অটো-সিঙ্ক',
      'লাইভ কল ট্রান্সক্রিপ্ট ও AI সামারি'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 3999,
    priceLabel: '৳৩,৯৯৯ / মাস',
    billingCycle: 'মাসিক বিলিং',
    agentLimit: 10,
    minutesLimit: 1000,
    features: [
      '১০টি পর্যন্ত মাল্টি-ফাংশনাল AI Agent',
      '১,০০০ মিনিট হাই-স্পিড ভয়েস কল',
      '৫টি আনলিমিটেড ইনকামিং ফোন লাইন',
      'কাস্টম ভয়েস ক্লোনিং ও ফাইন টিউনিং',
      'রিয়েল-টাইম CRM ইন্টিগ্রেশন (HubSpot/Zoho)',
      'ডেডিকেটেড ভিওআইপি এসআইপি ট্রাঙ্ক সাপোর্ট',
      '২৪/৭ প্রায়োরিটি ফোন ও হোয়াটসঅ্যাপ সাপোর্ট'
    ]
  }
];

// Team Members for Business Customer
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'তানভীর আহমেদ',
    email: 'tanvir@aiskillhub.bd',
    role: 'Owner',
    status: 'Active',
    joinedDate: '১৫ জানুয়ারি, ২০২৪'
  },
  {
    id: 'team-2',
    name: 'আসিফ মাহমুদ',
    email: 'asif@aiskillhub.bd',
    role: 'Admin',
    status: 'Active',
    joinedDate: '০১ ফেব্রুয়ারি, ২০২৪'
  },
  {
    id: 'team-3',
    name: 'সাদিয়া রহমান',
    email: 'sadia@aiskillhub.bd',
    role: 'Manager',
    status: 'Active',
    joinedDate: '১৫ ফেব্রুয়ারি, ২০২৪'
  },
  {
    id: 'team-4',
    name: 'শাকিল চৌধুরী',
    email: 'shakil@aiskillhub.bd',
    role: 'Agent Viewer',
    status: 'Invited',
    joinedDate: '১৮ সেপ্টেম্বর, ২০২৬'
  }
];

// Super Admin Platform Users (1,248 simulated users sample)
export const INITIAL_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'তানভীর আহমেদ',
    business: 'AI Skill Hub BD',
    phone: '+880 1712-345678',
    email: 'tanvir@aiskillhub.bd',
    plan: 'Business',
    agentsCount: 3,
    minutesUsed: 186,
    minutesLimit: 300,
    status: 'Active',
    joined: '15 Jan 2024',
    activePhoneNumbers: ['+880 9612-887766', '+880 9638-112233'],
    recentCallsCount: 47,
    leadsCount: 12,
    billingStatus: 'Paid',
    lastActive: '5 mins ago'
  },
  {
    id: 'usr-2',
    name: 'মুহাম্মদ রহিম',
    business: 'Rahim Electronics',
    phone: '+880 1812-987654',
    email: 'rahim@rahimelectronics.com.bd',
    plan: 'Business',
    agentsCount: 2,
    minutesUsed: 215,
    minutesLimit: 300,
    status: 'Active',
    joined: '22 Jan 2024',
    activePhoneNumbers: ['+880 9638-112233'],
    recentCallsCount: 38,
    leadsCount: 19,
    billingStatus: 'Paid',
    lastActive: '12 mins ago'
  },
  {
    id: 'usr-3',
    name: 'ফারজানা আক্তার',
    business: 'Chaldal Quick Grocery',
    phone: '+880 1912-112233',
    email: 'ops@chaldalquick.bd',
    plan: 'Pro',
    agentsCount: 8,
    minutesUsed: 840,
    minutesLimit: 1000,
    status: 'Active',
    joined: '05 Feb 2024',
    activePhoneNumbers: ['+880 9600-445566', '+880 9600-778899'],
    recentCallsCount: 192,
    leadsCount: 64,
    billingStatus: 'Paid',
    lastActive: '1 min ago'
  },
  {
    id: 'usr-4',
    name: 'ইমরান খান',
    business: 'Pathao Courier Hub',
    phone: '+880 1700-554433',
    email: 'imran@courierhub.com',
    plan: 'Pro',
    agentsCount: 6,
    minutesUsed: 920,
    minutesLimit: 1000,
    status: 'Active',
    joined: '10 Feb 2024',
    activePhoneNumbers: ['+880 9611-332211'],
    recentCallsCount: 240,
    leadsCount: 88,
    billingStatus: 'Paid',
    lastActive: 'Just now'
  },
  {
    id: 'usr-5',
    name: 'শাহিনুর রহমান',
    business: 'Bengal Craft Shop',
    phone: '+880 1611-223344',
    email: 'shahinur@bengalcraft.com',
    plan: 'Starter',
    agentsCount: 1,
    minutesUsed: 95,
    minutesLimit: 100,
    status: 'Trial',
    joined: '12 Sep 2026',
    activePhoneNumbers: ['+880 9622-556677'],
    recentCallsCount: 14,
    leadsCount: 4,
    billingStatus: 'Pending',
    lastActive: '2 hours ago'
  },
  {
    id: 'usr-6',
    name: 'ডাঃ মোশাররফ হোসেন',
    business: 'Green Life Diagnostic',
    phone: '+880 1822-778899',
    email: 'info@greenlifediag.bd',
    plan: 'Business',
    agentsCount: 2,
    minutesUsed: 290,
    minutesLimit: 300,
    status: 'Active',
    joined: '01 Mar 2024',
    activePhoneNumbers: ['+880 9655-112244'],
    recentCallsCount: 62,
    leadsCount: 29,
    billingStatus: 'Paid',
    lastActive: '30 mins ago'
  },
  {
    id: 'usr-7',
    name: 'আনিসুর রহমান',
    business: 'Star Tech VIP Support',
    phone: '+880 1933-445566',
    email: 'vip@startechvip.bd',
    plan: 'Pro',
    agentsCount: 5,
    minutesUsed: 520,
    minutesLimit: 1000,
    status: 'Active',
    joined: '18 Mar 2024',
    activePhoneNumbers: ['+880 9677-889900'],
    recentCallsCount: 110,
    leadsCount: 42,
    billingStatus: 'Paid',
    lastActive: '4 hours ago'
  },
  {
    id: 'usr-8',
    name: 'মেহজাবিন চৌধুরী',
    business: 'Dhaka Fashion House',
    phone: '+880 1555-667788',
    email: 'order@dhakafashion.bd',
    plan: 'Starter',
    agentsCount: 1,
    minutesUsed: 100,
    minutesLimit: 100,
    status: 'Expired',
    joined: '01 Aug 2026',
    activePhoneNumbers: [],
    recentCallsCount: 0,
    leadsCount: 7,
    billingStatus: 'Overdue',
    lastActive: '5 days ago'
  },
  {
    id: 'usr-9',
    name: 'জাহিদুল ইসলাম',
    business: 'Spam Call Marketing LLC',
    phone: '+880 1799-887766',
    email: 'admin@spammkt.xyz',
    plan: 'Starter',
    agentsCount: 1,
    minutesUsed: 30,
    minutesLimit: 100,
    status: 'Suspended',
    joined: '10 Sep 2026',
    activePhoneNumbers: [],
    recentCallsCount: 0,
    leadsCount: 0,
    billingStatus: 'Overdue',
    lastActive: '7 days ago'
  }
];

// Billing Invoices
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0901',
    date: '০১ সেপ্টেম্বর, ২০২৬',
    plan: 'Business Plan (Monthly)',
    amount: '৳১,৯৯৯',
    status: 'Paid',
    method: 'bKash (Trx: 9X82BA91)',
    downloadUrl: '#'
  },
  {
    id: 'INV-2026-0801',
    date: '০১ আগস্ট, ২০২৬',
    plan: 'Business Plan (Monthly)',
    amount: '৳১,৯৯৯',
    status: 'Paid',
    method: 'bKash (Trx: 8A44BB10)',
    downloadUrl: '#'
  },
  {
    id: 'INV-2026-0701',
    date: '০১ জুলাই, ২০২৬',
    plan: 'Business Plan (Monthly)',
    amount: '৳১,৯৯৯',
    status: 'Paid',
    method: 'Nagad (Trx: NG821937)',
    downloadUrl: '#'
  },
  {
    id: 'INV-2026-0601',
    date: '০১ জুন, ২০২৬',
    plan: 'Starter Plan (Monthly)',
    amount: '৳৯৯৯',
    status: 'Paid',
    method: 'Visa Card (Ending 4242)',
    downloadUrl: '#'
  }
];

// System Activity Logs
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    time: '১০ মিনিট আগে',
    user: 'তানভীর আহমেদ',
    action: 'Agent Activated',
    resource: 'AI Skill Hub Receptionist (agent-1)',
    category: 'Agents',
    status: 'Success',
    details: 'Status switched to Active with Dhaka SIP Gateway'
  },
  {
    id: 'log-2',
    time: '৩৫ মিনিট আগে',
    user: 'System (AI Engine)',
    action: 'Hot Lead Generated',
    resource: 'Rahim Ahmed (+8801712345678)',
    category: 'Calls',
    status: 'Success',
    details: 'Lead score calculated at 94/100, synced with CRM'
  },
  {
    id: 'log-3',
    time: '১ ঘণ্টা আগে',
    user: 'আসিফ মাহমুদ',
    action: 'Knowledge File Uploaded',
    resource: 'Course_Curriculum_2026.pdf',
    category: 'Agents',
    status: 'Success',
    details: 'Parsed 42 vector embeddings into local knowledge index'
  },
  {
    id: 'log-4',
    time: '২ ঘণ্টা আগে',
    user: 'System Telephony',
    action: 'SIP Trunk Handshake',
    resource: '+880 9612-887766',
    category: 'System',
    status: 'Success',
    details: 'BTCL gateway keep-alive ping answered in 14ms'
  },
  {
    id: 'log-5',
    time: 'গতকাল',
    user: 'তানভীর আহমেদ',
    action: 'Plan Renewed',
    resource: 'Business Plan (৳১,৯৯৯)',
    category: 'Billing',
    status: 'Success',
    details: 'Automated invoice INV-2026-0901 settled via bKash'
  },
  {
    id: 'log-6',
    time: '২ দিন আগে',
    user: 'Admin Security',
    action: 'User Suspended',
    resource: 'Spam Call Marketing LLC (usr-9)',
    category: 'Users',
    status: 'Warning',
    details: 'Suspicious robo-dialing pattern triggered safety limit'
  }
];

// App Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'AI Skill Hub Receptionist সক্রিয় হয়েছে',
    message: 'আপনার এজেন্ট এখন +880 9612-887766 নম্বরে গ্রাহকের ইনকামিং কল রিসিভ করছে।',
    time: '১০ মিনিট আগে',
    read: false,
    category: 'agent',
    link: '/agents'
  },
  {
    id: 'notif-2',
    title: 'আপনার মাসিক ভয়েস ব্যবহারের পরিমাণ ৬২%',
    message: '১৮৬ / ৩০০ AI মিনিট ব্যবহৃত হয়েছে। সীমা অতিক্রমের আগে প্রয়োজনে প্ল্যান আপগ্রেড করুন।',
    time: '১ ঘণ্টা আগে',
    read: false,
    category: 'usage',
    link: '/billing'
  },
  {
    id: 'notif-3',
    title: 'নতুন হট লিড সংগৃহীত হয়েছে!',
    message: 'Rahim Ahmed (+8801712345678) AI Mastering Course-এ ভর্তির জন্য আগ্রহী।',
    time: '২ ঘণ্টা আগে',
    read: false,
    category: 'lead',
    link: '/leads'
  },
  {
    id: 'notif-4',
    title: 'Knowledge Base সফলভাবে সিঙ্ক হয়েছে',
    message: 'Course_Curriculum_2026.pdf সফলভাবে প্রসেস করা হয়েছে।',
    time: 'গতকাল',
    read: true,
    category: 'agent',
    link: '/knowledge'
  },
  {
    id: 'notif-5',
    title: 'ডেমো ফোন নম্বর কানেক্টেড',
    message: 'ভার্চুয়াল টেলিফোনি নম্বর +880 9612-887766 সফলভাবে এসআইপি ট্রাঙ্কে যুক্ত হয়েছে।',
    time: '৩ দিন আগে',
    read: true,
    category: 'system',
    link: '/phones'
  }
];

// Integrations
export const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-vapi',
    name: 'Vapi Conversational Voice AI',
    category: 'Voice',
    description: 'রিয়েল-টাইম অডিও স্ট্রিম, স্পিচ-টু-টেক্সট ও টেলিফোনি কনভারসেশনাল এআই ইঞ্জিন।',
    status: 'Connected',
    provider: 'Vapi.ai Inc.',
    logoText: 'VAPI',
    features: ['Real-time WebRTC Call Engine', 'Assistant: Ai Skill Hub Receptionist', 'Sub-second Voice Latency', 'Direct Browser & SIP Calls'],
    configFields: [
      { key: 'private_key', label: 'Vapi Private Key', value: 'c2eb••••9134', masked: true },
      { key: 'public_key', label: 'Vapi Public Key', value: '51a6••••4e0b', masked: true },
      { key: 'assistant_id', label: 'Active Assistant ID', value: 'b37b72e1-047d-408b-9096-cc5cf21256cd' }
    ]
  },
  {
    id: 'int-elevenlabs',
    name: 'ElevenLabs Voice Engine',
    category: 'Voice',
    description: 'উচ্চমানের বাংলা ও ইংরেজি ন্যাচারাল ভয়েস সিন্থেসিস ও স্পিচ জেনারেশন।',
    status: 'Connected',
    provider: 'ElevenLabs Inc.',
    logoText: '11',
    features: ['Bangla Female & Male Voices', 'Real-time Audio Stream', 'Custom Pitch & Tone'],
    configFields: [
      { key: 'api_key', label: 'ElevenLabs API Key', value: 'el_live_94821a0029b3c4', masked: true },
      { key: 'model_id', label: 'Default Model', value: 'eleven_turbo_v2_5' }
    ]
  },
  {
    id: 'int-sip',
    name: 'Bangladeshi SIP Telephony Trunk',
    category: 'Telephony',
    description: 'বিটিসিএল ও স্থানীয় আইপি টেলিফোনি অপারেটরদের সাথে +880 সংযোগ।',
    status: 'Connected',
    provider: 'BD Telecom Gateway',
    logoText: 'SIP',
    features: ['Direct +880 Inbound & Outbound', 'SIP Digest Auth', 'Low-latency HD Audio'],
    configFields: [
      { key: 'sip_server', label: 'SIP Registrar / Domain', value: 'sip.dhakatelecom.net' },
      { key: 'sip_port', label: 'SIP Port', value: '5060' },
      { key: 'auth_user', label: 'Trunk Username', value: 'voiceai_bd_gw01' }
    ]
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business Lead Alerts',
    category: 'Messaging',
    description: 'কল শেষ হওয়ার সাথে সাথে উদ্যোক্তার ফোনে গ্রাহকের বিবরণ তাৎক্ষণিক পাঠানো।',
    status: 'Demo Mode',
    provider: 'Meta WhatsApp Cloud API',
    logoText: 'WA',
    features: ['Instant Lead Notification', 'Caller Transcript PDF', 'Follow-up Template'],
    configFields: [
      { key: 'wa_number', label: 'Admin WhatsApp Number', value: '+880 1712-345678' },
      { key: 'template_name', label: 'Template Name', value: 'voiceai_hot_lead_v1' }
    ]
  },
  {
    id: 'int-sms',
    name: 'Bangladeshi SMS Gateway',
    category: 'Messaging',
    description: 'দেশীয় আলফানেট / বিটিসিএল বাল্ক এসএমএস এপিআই ইন্টিগ্রেশন।',
    status: 'Connected',
    provider: 'Alpha Net BD',
    logoText: 'SMS',
    features: ['Sender ID Masking', 'Instant SMS to Caller', 'DND Filter Check'],
    configFields: [
      { key: 'sender_id', label: 'Sender Masking', value: 'VoiceAIBD' },
      { key: 'api_token', label: 'Gateway Secret Token', value: 'sms_token_8892147a', masked: true }
    ]
  },
  {
    id: 'int-sheets',
    name: 'Google Sheets Live Sync',
    category: 'Automation',
    description: 'প্রতিটি নতুন লিড স্বয়ংক্রিয়ভাবে আপনার গুগল শিট স্প্রেডশিটে যুক্ত হবে।',
    status: 'Connected',
    provider: 'Google Workspace',
    logoText: 'GS',
    features: ['Real-time Row Append', 'Custom Column Mapping', 'Offline Queuing'],
    configFields: [
      { key: 'sheet_id', label: 'Google Spreadsheet ID', value: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
      { key: 'tab_name', label: 'Worksheet Tab Name', value: 'Customer_Leads_2026' }
    ]
  },
  {
    id: 'int-webhook',
    name: 'Custom Webhook / CRM Bridge',
    category: 'CRM',
    description: 'আপনার নিজস্ব ডাটাবেস বা যেকোনো কাস্টম সিআরএম-এ কল ডেটা ও ট্রান্সক্রিপ্ট POST করুন।',
    status: 'Demo Mode',
    provider: 'REST Webhook',
    logoText: 'API',
    features: ['JSON Webhook Payload', 'HMAC Signature Verification', 'Retry Logic'],
    configFields: [
      { key: 'endpoint_url', label: 'Webhook Endpoint URL', value: 'https://api.mycrm.com/webhooks/voiceai-bd-leads' },
      { key: 'secret_key', label: 'Signing Secret', value: 'whsec_991823abce84102', masked: true }
    ]
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot CRM Integration',
    category: 'CRM',
    description: 'কলারের তথ্য স্বয়ংক্রিয়ভাবে হাবস্পট কন্টাক্ট ও ডিল তৈরি করবে।',
    status: 'Not Connected',
    provider: 'HubSpot Inc.',
    logoText: 'HS',
    features: ['Contact Creation', 'Deal Pipeline Stage', 'Call Recording Attachment'],
    configFields: [
      { key: 'hubspot_portal', label: 'Portal ID', value: '' },
      { key: 'access_token', label: 'Private App Access Token', value: '', masked: true }
    ]
  }
];

// Onboarding Steps
export const INITIAL_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Business Information',
    subtitle: 'আপনার ব্যবসার নাম ও প্রাথমিক তথ্য সেটআপ করুন',
    completed: true,
    route: '/settings'
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Create AI Agent',
    subtitle: 'বাংলায় কথা বলা প্রথম AI ভয়েস এজেন্ট তৈরি করুন',
    completed: true,
    route: '/agents/create'
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Add Knowledge',
    subtitle: 'কোর্স, প্রডাক্ট বা ব্যবসার তথ্য ফাইল আপলোড করুন',
    completed: true,
    route: '/knowledge'
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Select Voice',
    subtitle: 'নিলুফার বা ফারহানের মধ্য থেকে পছন্দের কণ্ঠ নির্ধারণ করুন',
    completed: true,
    route: '/voices'
  },
  {
    id: 5,
    stepNumber: '05',
    title: 'Connect Phone',
    subtitle: 'ভার্চুয়াল +880 ফোন নম্বর এজেন্টে যুক্ত করুন',
    completed: true,
    route: '/phones'
  },
  {
    id: 6,
    stepNumber: '06',
    title: 'Test Agent',
    subtitle: 'সিমুলেটরে কল দিয়ে কথোপকথনের মান পরীক্ষা করুন',
    completed: true,
    route: '/dashboard'
  },
  {
    id: 7,
    stepNumber: '07',
    title: 'Activate',
    subtitle: 'লাইভ কল রিসিভ করতে এজেন্টটি সক্রিয় করুন',
    completed: true,
    route: '/agents'
  }
];

export const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  bkashNumber: '01712-345678',
  bkashType: 'Personal',
  bkashInstruction: 'বিকাশ অ্যাপ অথবা *247# ডায়াল করে "Send Money" অপশন সিলেক্ট করুন। প্রাপক নম্বরে নিচের নম্বরটি দিন। রেফারেন্সে আপনার মোবাইল নম্বর লিখুন।',
  nagadNumber: '01845-987654',
  nagadType: 'Personal',
  nagadInstruction: 'নগদ অ্যাপ অথবা *167# ডায়াল করে "Send Money" করুন।',
  rocketNumber: '01712-3456789',
  bankAccountDetails: 'BRAC Bank Ltd | A/C: 1501204859632001 | Branch: Dhanmondi, Dhaka',
  isManualEnabled: true
};

export const INITIAL_PAYMENT_REQUESTS: PaymentRequest[] = [
  {
    id: 'PAY-171201',
    userId: 'usr-1',
    userName: 'আবুল কালাম',
    userEmail: 'kalam.telecom@gmail.com',
    userBusiness: 'Kalam Electronics',
    planId: 'business',
    planName: 'Business Plan',
    amount: 4999,
    method: 'bKash',
    senderNumber: '01719-887766',
    trxId: '9K8J7H6G5F',
    createdAt: '২৫ মার্চ, ২০২৪ - সকাল ১০:২৪',
    status: 'PENDING',
    adminNote: 'বিকাশ স্টেটমেন্ট চেক করে অনুমোদন দিন'
  },
  {
    id: 'PAY-171198',
    userId: 'usr-2',
    userName: 'মাহমুদুল হাসান',
    userEmail: 'mahmud@fashionbd.com',
    userBusiness: 'Fashion Mart BD',
    planId: 'starter',
    planName: 'Starter Plan',
    amount: 1999,
    method: 'Nagad',
    senderNumber: '01811-223344',
    trxId: '7B6V5C4X3Z',
    createdAt: '২৪ মার্চ, ২০২৪ - বিকেল ০৪:১৫',
    status: 'APPROVED',
    adminNote: 'নগদে পেমেন্ট কনফার্ম হয়েছে',
    approvedAt: '২৪ মার্চ, ২০২৪ - বিকেল ০৪:২৫'
  },
  {
    id: 'PAY-171182',
    userId: 'usr-3',
    userName: 'ডাঃ রাশেদুল ইসলাম',
    userEmail: 'dr.rashed@careclinic.org',
    userBusiness: 'Care Dental Clinic',
    planId: 'pro',
    planName: 'Pro Enterprise Plan',
    amount: 9999,
    method: 'bKash',
    senderNumber: '01912-334455',
    trxId: 'BKASH-87654321',
    createdAt: '২৩ মার্চ, ২০২৪ - রাত ০৯:০০',
    status: 'APPROVED',
    adminNote: 'ভেরিফায়েড',
    approvedAt: '২৩ মার্চ, ২০২৪ - রাত ০৯:১২'
  }
];
