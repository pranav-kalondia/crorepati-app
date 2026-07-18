// ============================================================
// Scam Details Data — Clues (Red Flags) & Timelines
// ============================================================

import type { ScamClue, ScamTimelineStep } from '../types';

export const SCAM_DETAILS: Record<
  string,
  { clues: ScamClue[]; scamTimeline: ScamTimelineStep[] }
> = {
  scam_quickgrow: {
    clues: [
      { id: 'qg_1', text: '🚀 Earn 5% DAILY returns!', isRedFlag: true, explanation: '🚩 Unrealistic returns: No legitimate asset classes or investments yield 5% daily. That translates to over 150% monthly.' },
      { id: 'qg_2', text: '150% monthly guaranteed!', isRedFlag: true, explanation: '🚩 Guaranteed returns: All financial investments carry risk. Legitimate companies never guarantee high returns.' },
      { id: 'qg_3', text: 'Join 50 lakh+ investors on QuickGrow!', isRedFlag: false, explanation: '✅ Standard social-proof marketing pitch. However, always verify download metrics on official app stores.' },
      { id: 'qg_4', text: 'Limited slots!', isRedFlag: true, explanation: '🚩 Urgency tactic: Scammers create a false sense of scarcity to pressure you into acting before verifying.' },
      { id: 'qg_5', text: 'No SEBI registration found in database.', isRedFlag: true, explanation: '🚩 Unregistered: It is illegal for any platform to offer investment services in India without SEBI registration.' }
    ],
    scamTimeline: [
      { title: 'Day 1: The Pitch', description: 'Saw an Instagram advertisement promoting the QuickGrow App promising 5% daily returns.', emoji: '📱' },
      { title: 'Day 3: The Investment', description: 'Downloaded an APK file from their website and deposited your savings of ₹50,000.', emoji: '💸' },
      { title: 'Day 5: Fake Profits', description: 'The dashboard showed your funds grew to ₹55,000. You felt secure and excited.', emoji: '📈' },
      { title: 'Day 7: The Trap', description: 'Tried to withdraw. The app blocked it, demanding you pay a 10% "clearance tax" upfront.', emoji: '🔒' },
      { title: 'Day 10: Total Loss', description: 'You paid the tax. The app crashed, their website disappeared, and their support is offline. Lost ₹50,000.', emoji: '😱' }
    ]
  },
  scam_goldchain: {
    clues: [
      { id: 'gc_1', text: 'Invest ₹1L, recruit 3 people, earn ₹3L!', isRedFlag: true, explanation: '🚩 Recruitment-based income: If earnings rely primarily on bringing in new members rather than selling actual goods/services, it is a pyramid scheme.' },
      { id: 'gc_2', text: 'Our top members earn ₹50L/month!', isRedFlag: true, explanation: '🚩 Outlandish income claims: Showcasing exceptional top earnings is designed to trigger greed and bypass rational analysis.' },
      { id: 'gc_3', text: 'Join GoldChain Network!', isRedFlag: false, explanation: '✅ Company name. However, network clubs are rarely registered as legitimate financial entities.' },
      { id: 'gc_4', text: 'Anonymous founders operating on Telegram.', isRedFlag: true, explanation: '🚩 Anonymous operators: Legitimate direct selling companies have transparent corporate management and physical offices.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Invitation', description: 'Attended a premium webinar inviting you to join GoldChain Network to achieve financial freedom.', emoji: '🎟️' },
      { title: 'Day 5: Pay to Play', description: 'Invested ₹1,00,000 to purchase joining packages and recruited 3 close friends.', emoji: '💳' },
      { title: 'Day 15: Fake Commissions', description: 'Received ₹20,000 commission from your friends\' entry fees. You felt reassured.', emoji: '💰' },
      { title: 'Day 30: The Collapse', description: 'Recruitment dried up. The founders closed the website and deleted the group chat. Lost ₹1,00,000.', emoji: '💥' }
    ]
  },
  scam_lottery_uk: {
    clues: [
      { id: 'lt_1', text: "You've won £500,000!", isRedFlag: true, explanation: '🚩 Unsolicited lottery: You cannot win a lottery you never bought a ticket for. This is a classic advanced fee hook.' },
      { id: 'lt_2', text: 'Pay ₹25,000 processing fee to claim', isRedFlag: true, explanation: '🚩 Upfront fees: Legitimate lotteries deduct taxes and fees from the winnings itself. They never ask winners to pay first.' },
      { id: 'lt_3', text: 'Act within 48 hours!', isRedFlag: true, explanation: '🚩 High urgency: Scammers force a strict deadline so you do not have time to consult others or research.' },
      { id: 'lt_4', text: 'UK National Lottery Sweepstakes', isRedFlag: false, explanation: '✅ Refers to a real entity, but foreign sweepstakes are heavily regulated and illegal to participate in from India.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Lucky Winner', description: 'Received an email stating your address won the UK National Lottery sweepstakes.', emoji: '📩' },
      { title: 'Day 2: Verification', description: 'Replied to verify. The agent sent an official-looking certificate with stamps.', emoji: '📝' },
      { title: 'Day 3: Fee Transfer', description: 'Transferred ₹25,000 for "currency exchange processing fees" to claim the prize.', emoji: '💸' },
      { title: 'Day 5: More Fees', description: 'Agent demanded an additional ₹50,000 for "customs clearance". You realized the scam. Lost ₹25,000.', emoji: '😱' }
    ]
  },
  scam_job_abroad: {
    clues: [
      { id: 'jb_1', text: '₹50 LPA Dubai job opening!', isRedFlag: true, explanation: '🚩 Too-good-to-be-true salary: Offering highly inflated packages for generic positions without interviews is a recruitment trap.' },
      { id: 'jb_2', text: 'Free accommodation!', isRedFlag: false, explanation: '✅ Free accommodation is a standard perk for legitimate expat job contracts.' },
      { id: 'jb_3', text: 'Pay ₹75,000 for express visa processing!', isRedFlag: true, explanation: '🚩 Candidate charges: Real employers or certified job consultants do not charge candidates visa processing fees upfront.' },
      { id: 'jb_4', text: 'URGENT:', isRedFlag: true, explanation: '🚩 Pressure tactics: Forcing immediate payments before dispatching formal employment contracts is a major warning sign.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Facebook Post', description: 'Saw a post from a visa agent claiming immediate openings in Dubai for ₹50 LPA.', emoji: '🌟' },
      { title: 'Day 3: Instant Selection', description: 'Emailed your resume. Within 24 hours, you were hired without any technical interview.', emoji: '✉️' },
      { title: 'Day 5: Processing Fees', description: 'Paid ₹75,000 for express visa stamping and administrative charges.', emoji: '💸' },
      { title: 'Day 10: Ghosted', description: 'The agent\'s phone went dead and their local office was found locked. Lost ₹75,000.', emoji: '🚪' }
    ]
  },
  scam_bank_kyc: {
    clues: [
      { id: 'bk_1', text: 'Your bank account will be BLOCKED in 2 hours!', isRedFlag: true, explanation: '🚩 Fear & Urgency: Scammers create panic to prevent you from calling official support or visiting a branch.' },
      { id: 'bk_2', text: 'Share OTP now to complete KYC update!', isRedFlag: true, explanation: '🚩 Requesting OTP: Bank staff will NEVER ask you for OTPs, PINs, or CVV codes under any circumstances.' },
      { id: 'bk_3', text: 'KYC Update SMS from standard private mobile number', isRedFlag: true, explanation: '🚩 Private numbers: Official banking alerts are dispatched via alphanumeric sender headers (e.g. AD-HDFCBK), never personal numbers.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Panic Call', description: 'Received an urgent call claiming your debit card and bank account were being blocked.', emoji: '📞' },
      { title: 'Day 1 (10m): KYC Scare', description: 'The caller said they could update your KYC instantly if you read out the code sent to your phone.', emoji: '😰' },
      { title: 'Day 1 (12m): OTP SMS', description: 'You received an OTP SMS. In panic, you read out the numbers to the caller.', emoji: '💬' },
      { title: 'Day 1 (15m): Drained Account', description: 'The caller hung up. Instantly, you got a text: ₹85,000 debited from your bank. Lost ₹85,000.', emoji: '💸' }
    ]
  },
  scam_phishing_link: {
    clues: [
      { id: 'pl_1', text: 'Income Tax Refund of ₹15,600 approved!', isRedFlag: true, explanation: '🚩 Unsolicited refund links: The income tax department never sends direct refund links via SMS. Refunds are auto-credited to verified bank accounts.' },
      { id: 'pl_2', text: 'Click here to claim: bit.ly/tax-refund-claim', isRedFlag: true, explanation: '🚩 Shortened URLs: Official notifications always link to verified ".gov.in" domains. Link shorteners hide malicious fishing servers.' },
      { id: 'pl_3', text: 'Expires today!', isRedFlag: true, explanation: '🚩 Artificial expiry: Creating artificial deadlines forces hasty clicks and login disclosure.' }
    ],
    scamTimeline: [
      { title: 'Day 1: SMS Alert', description: 'Received a text message stating a tax refund of ₹15,600 was waiting for collection.', emoji: '💬' },
      { title: 'Day 1 (2m): Fake Portal', description: 'Clicked the bit.ly link. It opened a page mimicking the official Income Tax portal.', emoji: '🔗' },
      { title: 'Day 1 (5m): Credentials', description: 'Entered your NetBanking login credentials and security questions to "verify" the account.', emoji: '🔑' },
      { title: 'Day 1 (10m): Complete Theft', description: 'Entered the OTP. Scammers registered a new beneficiary and withdrew ₹45,000. Lost ₹45,000.', emoji: '💸' }
    ]
  },
  scam_crypto_guru: {
    clues: [
      { id: 'cg_1', text: 'guaranteed 500% returns last month!', isRedFlag: true, explanation: '🚩 Guaranteed returns: Crypto markets are highly volatile. Anyone promising or guaranteeing massive gains is lying.' },
      { id: 'cg_2', text: 'Only ₹30,000 for lifetime access!', isRedFlag: true, explanation: '🚩 Premium access fees: Genuine traders make profits trading. Scammers profit by selling premium subscriptions and courses.' },
      { id: 'cg_3', text: 'CryptoMoon VIP signals group', isRedFlag: false, explanation: '✅ standard name, but most VIP signal groups on Telegram are pump-and-dump traps.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Telegram Channel', description: 'Joined a free Telegram group displaying endless profit screenshots and luxury cars.', emoji: '📣' },
      { title: 'Day 2: Premium Fee', description: 'Paid ₹30,000 to join the "exclusive VIP trading signal room" for insider tips.', emoji: '💳' },
      { title: 'Day 5: Market Dump', description: 'Bought a low-cap coin suggested by the guru. The token crashed 95% immediately as the team sold off.', emoji: '📉' },
      { title: 'Day 10: Blocked', description: 'Asked why the trade failed in the VIP room. You were kicked out and blocked. Lost ₹30,000.', emoji: '🚫' }
    ]
  },
  scam_pyramid_health: {
    clues: [
      { id: 'ph_1', text: 'Buy ₹50K products', isRedFlag: true, explanation: '🚩 Mandatory purchase: Legitimate business models do not require agents to buy heavy inventory to register.' },
      { id: 'ph_2', text: 'build your team, earn ₹5L/month in commissions!', isRedFlag: true, explanation: '🚩 Recruitment commissions: Multi-level marketing companies where commissions flow from recruiting others instead of retail sales are illegal pyramids.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Multi-level pitch', description: 'An old classmate invited you to join a health startup distributing high-end vitamins.', emoji: '💊' },
      { title: 'Day 3: Starter Pack', description: 'Paid ₹50,000 to buy the mandatory VitaLife starter kit of nutritional powders.', emoji: '📦' },
      { title: 'Day 20: Overpriced stock', description: 'Realized the vitamins are overpriced, making retail sales impossible without downlines.', emoji: '📦' },
      { title: 'Day 60: The Realization', description: 'Spent weeks pitching friends but failed to recruit anyone. Stuck with expiring product. Lost ₹45,000.', emoji: '🛒' }
    ]
  },
  scam_fake_property: {
    clues: [
      { id: 'fp_1', text: 'Expected 10x returns in 2 years!', isRedFlag: true, explanation: '🚩 Outlandish land growth: Land rates appreciate, but 10x growth in 2 years is statistically impossible.' },
      { id: 'fp_2', text: 'Only 15 plots left!', isRedFlag: true, explanation: '🚩 Hard pressure: Scarcity tactics discourage real estate legal title verification.' },
      { id: 'fp_3', text: 'Sunshine City Plots near highway', isRedFlag: false, explanation: '✅ Standard township marketing name. However, always run physical title checks.' },
      { id: 'fp_4', text: 'No RERA registration details provided.', isRedFlag: true, explanation: '🚩 No RERA: State Real Estate Regulatory Authority registration is legally required for selling plots.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Flyer Ad', description: 'Read a flyer offering pre-launch plots near a major expressway for ₹2 Lakhs.', emoji: '🌅' },
      { title: 'Day 3: Deposit Payment', description: 'Paid a ₹2,00,000 booking fee via UPI to secure the plot without visiting.', emoji: '💸' },
      { title: 'Day 20: Title Search', description: 'Discovered the developer had no RERA registration. Realized they sold plots they did not own.', emoji: '🔍' },
      { title: 'Day 30: Legal Dead-end', description: 'The developer office shut down and builders vanished. Lost ₹2,00,000.', emoji: '🏢' }
    ]
  },
  scam_govt_subsidy: {
    clues: [
      { id: 'gs_1', text: 'PM FREE LAPTOP SCHEME 2025!', isRedFlag: false, explanation: '✅ Sounds official. However, government announcements come from official channels, not WhatsApp forwards.' },
      { id: 'gs_2', text: 'pay ₹500 processing fee!', isRedFlag: true, explanation: '🚩 Processing charges: Government welfare programs never require applicants to pay entry fees to participate.' },
      { id: 'gs_3', text: 'Share with 10 friends to confirm!', isRedFlag: true, explanation: '🚩 Viral distribution: Official welfare programs do not require sharing links on WhatsApp to unlock approvals.' }
    ],
    scamTimeline: [
      { title: 'Day 1: WhatsApp Forward', description: 'Received a WhatsApp message claiming the government is dispatching free laptops to students.', emoji: '💬' },
      { title: 'Day 1 (5m): Registration', description: 'Opened the fake portal, typed in your details, and paid ₹500 registration fee.', emoji: '💳' },
      { title: 'Day 5: Privacy Leak', description: 'Discovered the site was built on a free blogging host. Realized your personal data was harvested and the ₹500 is lost.', emoji: '🕵️' }
    ]
  },
  scam_tech_support: {
    clues: [
      { id: 'ts_1', text: '🚨 VIRUS DETECTED!', isRedFlag: true, explanation: '🚩 Browser alerts: Web browsers cannot read or scan local operating system directories for active virus files.' },
      { id: 'ts_2', text: 'Call Microsoft Support NOW: 1800-XXX-XXXX', isRedFlag: true, explanation: '🚩 Unsolicited phone support: Software developers like Microsoft never show support phone numbers in emergency popup scripts.' },
      { id: 'ts_3', text: 'install remote tool for cleanup', isRedFlag: true, explanation: '🚩 Remote tools: Granting remote access tools (e.g. AnyDesk, TeamViewer) to strangers gives them complete access to copy personal files and keys.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Web Popup', description: 'A red browser block popup locked your laptop screen, flashing warning sirens.', emoji: '🖥️' },
      { title: 'Day 1 (5m): The Call', description: 'Dialed the toll-free number. The support agent requested you to download remote control tools.', emoji: '📞' },
      { title: 'Day 1 (15m): Drained Wallet', description: 'You logged into bank to pay a ₹15,000 license fee. Scammer blacked out screen, stealing credential keys. Lost ₹15,000.', emoji: '💸' }
    ]
  },
  scam_referral_earn: {
    clues: [
      { id: 're_1', text: 'Earn ₹500 per referral!', isRedFlag: true, explanation: '🚩 Inflated referral reward: Real companies offer small signup perks (e.g., ₹20-50). ₹500 for clicking links is highly suspicious.' },
      { id: 're_2', text: 'Upgrade for just ₹1,000!', isRedFlag: true, explanation: '🚩 Premium memberships: Legitimate referral systems do not charge upfront fees to let users refer others.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Earn Karo App', description: 'Downloaded an app that paid ₹500 for referring friends.', emoji: '📱' },
      { title: 'Day 2: Premium Upgrade', description: 'Paid ₹1,000 to purchase a premium status to activate referral codes.', emoji: '💳' },
      { title: 'Day 10: Blocked Withdrawal', description: 'Referred friends and earned ₹3,000. Tapped withdraw, but the app crashed. Lost your premium payment of ₹1,000.', emoji: '📉' }
    ]
  },
  scam_trading_course: {
    clues: [
      { id: 'tc_1', text: 'I made ₹2 Crore from trading!', isRedFlag: true, explanation: '🚩 Wealth display: Scammers show off cars, cash, and luxury lifestyles to excite viewers and suspend critical thinking.' },
      { id: 'tc_2', text: '₹40,000 → Lifetime earnings!', isRedFlag: true, explanation: '🚩 Guaranteed returns: Guaranteeing that buying a single course will lead to infinite lifetime returns is a marketing trap.' },
      { id: 'tc_3', text: 'Money-back guarantee!', isRedFlag: false, explanation: '✅ Typical sales guarantee. However, scam course terms are structured so that refunds are never processed.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Flex Post', description: 'Watched trading tutorial videos on Instagram featuring luxury sports cars.', emoji: '🏎️' },
      { title: 'Day 5: Purchase', description: 'Paid ₹40,000 to purchase his special "insider options trading masterclass".', emoji: '💳' },
      { title: 'Day 15: Big Losses', description: 'Followed his advice to buy high-leverage options and lost another ₹20,000. Course team blocked refund requests. Lost ₹40,000.', emoji: '📉' }
    ]
  },
  scam_insurance: {
    clues: [
      { id: 'in_1', text: '₹1 Crore life cover for just ₹5,000/year!', isRedFlag: true, explanation: '🚩 Underpriced cover: ₹1 Crore coverage for a young adult costs considerably more. Underpricing is a hook to grab attention.' },
      { id: 'in_2', text: 'One-time registration fee of ₹10,000!', isRedFlag: true, explanation: '🚩 Upfront registration: Real life insurance charges premiums directly. There is no separate registration fee required.' },
      { id: 'in_3', text: 'Offer valid today only!', isRedFlag: true, explanation: '🚩 Extreme urgency: Legitimate companies require detailed proposals and underwriting. They do not sell plans with same-day deadlines.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Cold Call', description: 'Received a call offering an extremely cheap premium plan from LifeSecure.', emoji: '📞' },
      { title: 'Day 2: Upfront Payment', description: 'Transferred ₹10,000 registration fee to lock in the special pricing.', emoji: '💸' },
      { title: 'Day 10: IRDAI Check', description: 'Contacted IRDAI regulatory directory. Discovered the company is fake and untraceable. Lost ₹10,000.', emoji: '🕵️' }
    ]
  },
  scam_part_time: {
    clues: [
      { id: 'pt_1', text: 'Earn ₹50,000/month! Only 2 hours/day!', isRedFlag: true, explanation: '🚩 High pay for simple work: Typing simple texts or data entry does not pay premium corporate salaries.' },
      { id: 'pt_2', text: 'Pay ₹3,000 registration fee!', isRedFlag: true, explanation: '🚩 Job application charges: Real employers hire candidates for work. They never charge candidate fees or deposits.' }
    ],
    scamTimeline: [
      { title: 'Day 1: Facebook Listing', description: 'Replied to a job post advertising typing work from home for ₹50,000/month.', emoji: '⌨️' },
      { title: 'Day 2: The Deposit', description: 'Paid ₹3,000 registration deposit fee to receive the typing booklets.', emoji: '💸' },
      { title: 'Day 10: Denied Payment', description: 'Finished and submitted the typing sheets. Company claimed there were typos and refused to pay, demanding penalty fee. Lost ₹3,000.', emoji: '📉' }
    ]
  }
};
