// ============================================================
// Scam Boss Battle Scenarios (All Fictional)
// ============================================================

import type { BossBattle } from '../types';

export const BOSSES: Record<string, Omit<BossBattle, 'currentQuestionIndex' | 'playerShield' | 'bossHealth'>> = {
  boss_ponzi: {
    bossId: 'boss_ponzi',
    name: 'Vikram Rajsekar',
    emoji: '👑',
    title: 'The Ponzi King',
    description: 'A charismatic network marketer who promises massive passive income through recruitments and guarantees returns.',
    questions: [
      {
        id: 'ponzi_q1',
        text: '"Welcome to the Elite Wealth Circle! All you need to do is invest ₹1 Lakh today, and recruit 3 of your friends to get ₹3 Lakhs commission. It is simple math, isn\'t it?"',
        options: [
          { text: 'Disconnect. This is a pyramid scheme where money comes from recruitment fees, not real goods.', correct: true, explanation: 'Correct! Legitimate MLM companies sell real products. In pyramid schemes, income is paid from new member sign-up fees and eventually collapses.' },
          { text: 'Sounds like a great deal! I will sign up my friends.', correct: false, explanation: 'Incorrect! You fell for the recruiting loop. Pyramid schemes are unsustainable and illegal.' },
          { text: 'Can you show me your company license first?', correct: false, explanation: 'Incorrect! Scammer will show fake certificates. The fundamental business model itself is fraudulent.' }
        ]
      },
      {
        id: 'ponzi_q2',
        text: '"Our trading algorithm is secret, but we GUARANTEE a 15% monthly return. High risk, high reward? No! Zero risk, guaranteed. Banks are keeping all your profits, invest with us!"',
        options: [
          { text: 'No one can guarantee 15% monthly (180% annually) with zero risk. Financial markets always carry volatility.', correct: true, explanation: 'Correct! Any investment promising guaranteed double-digit monthly returns with zero risk is a scam.' },
          { text: 'A secret trading algorithm makes sense. Let me invest ₹50,000.', correct: false, explanation: 'Incorrect! "Secret algorithms" or "invitations only" are common smoke screens to hide lack of actual business.' }
        ]
      },
      {
        id: 'ponzi_q3',
        text: '"Look, the club slots are extremely limited. If you don\'t make the UPI transfer in the next 5 minutes, you will lose this golden opportunity forever. Do it now!"',
        options: [
          { text: 'I refuse to buy under pressure. Real investments never force same-day transfer ultimatums.', correct: true, explanation: 'Correct! Creating extreme artificial urgency is a psychological tactic to block rational verification.' },
          { text: 'Okay! Let me do a quick UPI transfer before the slot disappears.', correct: false, explanation: 'Incorrect! Pressured transfers are almost always scams. Never rush with your hard-earned money.' }
        ]
      }
    ]
  },
  boss_banker: {
    bossId: 'boss_banker',
    name: 'Rakesh Sharma',
    emoji: '🏦',
    title: 'The Fake Banker',
    description: 'Impersonates banking staff, threatening account locks to extract OTP codes and remote computer sharing.',
    questions: [
      {
        id: 'bank_q1',
        text: '"I am calling from SBI Headquarters. We noticed suspicious shopping online. To secure your account, we have blocked it. Read me the 6-digit verification code sent to your mobile now to unlock!"',
        options: [
          { text: 'Banks never call to ask for OTPs to unblock accounts. I will hang up.', correct: true, explanation: 'Correct! Banking staff never request OTPs, PINs, or CVVs. OTPs are meant for authentication, not confirmation of identity to staff.' },
          { text: 'Let me read the code so I do not lose access to my card.', correct: false, explanation: 'Incorrect! Reading the OTP grants the scammer access to execute a pending transaction draining your wallet.' },
          { text: 'Can I verify your employee ID first?', correct: false, explanation: 'Incorrect! Spoofed identities are easy to fake over the phone. Hang up immediately.' }
        ]
      },
      {
        id: 'bank_q2',
        text: '"If you refuse to share the OTP, you must immediately download the Microsoft/AnyDesk screen-sharing app from the Play Store so our technical division can unblock you remotely. Do it immediately!"',
        options: [
          { text: 'No. Screen sharing apps allow you to view my banking passwords and steal my keys.', correct: true, explanation: 'Correct! Installing remote access software (AnyDesk, TeamViewer) grants scammers full visual control over your mobile or computer.' },
          { text: 'Sure, unblocking through the app sounds safer than sharing OTP.', correct: false, explanation: 'Incorrect! Remote desktop tools are the primary way scammers bypass banking application firewalls.' }
        ]
      },
      {
        id: 'bank_q3',
        text: '"If you don\'t cooperate, your PAN card will be blacklisted by the Reserve Bank of India by midnight, and your savings will be frozen indefinitely. Choose wisely!"',
        options: [
          { text: 'Hang up. The RBI does not blacklist PAN cards via random caller phone calls.', correct: true, explanation: 'Correct! Threatening immediate regulatory blacklists or police complaints is a standard panic tactic. Hang up and verify.' },
          { text: 'I am scared! Please tell me how to cancel the blacklist.', correct: false, explanation: 'Incorrect! Panicking leads to compromise. Official tax/banking actions follow written, legal notices, not phone threats.' }
        ]
      }
    ]
  },
  boss_crypto: {
    bossId: 'boss_crypto',
    name: 'Crypto Guru',
    emoji: '🪙',
    title: 'The Crypto Guru',
    description: 'Runs pump-and-dump groups, selling VIP insider chat memberships with screenshots of simulated trading gains.',
    questions: [
      {
        id: 'crypto_q1',
        text: '"My VIP CryptoMoon channel generated 1200% return last week. Subscriptions cost ₹30,000, but you will make it back in one single trade. Check these profit screenshots!"',
        options: [
          { text: 'Profit screenshots can be easily faked or edited. No one can guarantee consistent market tips.', correct: true, explanation: 'Correct! Telegram gurus fake dashboards using HTML edits or testnet trading accounts to manufacture "guaranteed" wins.' },
          { text: 'Your screenshots look very convincing. I will pay ₹30,000.', correct: false, explanation: 'Incorrect! Paying massive fees to anonymous accounts for trading tips is a surefire way to lose cash.' }
        ]
      },
      {
        id: 'crypto_q2',
        text: '"We have a special pre-sale coin, CryptoSafe token. We are going to pump it by 500% in 15 minutes! Buy now on this decentralized swap before the public knows!"',
        options: [
          { text: 'This is a pump-and-dump honey pot. If I buy, the founders will dump their pre-allocated tokens and crash the price.', correct: true, explanation: 'Correct! Low-liquidity tokens are pumped by coordinators who sell their massive shares onto excited followers, leaving them holding worthless code.' },
          { text: 'Quick, let me buy ₹15,000 worth before the price shoots up!', correct: false, explanation: 'Incorrect! Fearing missing out (FOMO) makes you the exit liquidity for the organizers of the dump.' }
        ]
      }
    ]
  },
  boss_lottery: {
    bossId: 'boss_lottery',
    name: 'David Miller',
    emoji: '🎰',
    title: 'The Lottery Master',
    description: 'Tricks players into sending small processing and tax fees to claim non-existent international sweepstakes prizes.',
    questions: [
      {
        id: 'lottery_q1',
        text: '"Congratulations! Your email won £500,000 in the UK lottery. To transfer the British Pounds to your local Indian bank, you just need to deposit ₹25,000 currency clearance tax to our RBI agent."',
        options: [
          { text: 'I never bought a ticket for this lottery. Winnings cannot be claimed if you never participated.', correct: true, explanation: 'Correct! You cannot win a sweepstakes you never entered. Scammers scrape email lists to broadcast foreign lottery letters.' },
          { text: 'Let me borrow ₹25,000 to pay the clearance tax. £500k is worth crores!', correct: false, explanation: 'Incorrect! The cash is fictional. Once you pay the processing fee, the scammer disappears or demands more fees.' }
        ]
      },
      {
        id: 'lottery_q2',
        text: '"We will send you a draft copy of the bank ledger and a video of the cash container with your name printed on it. All we need is your PAN Card, Aadhar, and signature to process the transfer."',
        options: [
          { text: 'I will not share government IDs with unknown senders. You are trying to steal my identity.', correct: true, explanation: 'Correct! Sharing PAN, Aadhaar, and digital signatures exposes you to identity theft, fake bank accounts, and loans taken in your name.' },
          { text: 'Sharing my Aadhaar is fine as long as I get the lottery video confirmation.', correct: false, explanation: 'Incorrect! Video containers and bank certificates are fabricated using templates or AI. Never send identity documents to unverified foreign senders.' }
        ]
      }
    ]
  },
  boss_wizard: {
    bossId: 'boss_wizard',
    name: 'Aditya Malhotra',
    emoji: '🧙',
    title: 'The Investment Wizard',
    description: 'Promotes high-yield unregistered algorithmic portfolios and invite-only pre-IPO stock investment funds.',
    questions: [
      {
        id: 'wiz_q1',
        text: '"Our fund is private, invite-only, and completely bypasses standard SEBI regulations. This lets us generate a stable 35% annual return. Standard funds are restricted by government red tape, sign up today!"',
        options: [
          { text: 'Bypassing SEBI is illegal. Unregistered funds offer no legal safety or grievance forums for investors.', correct: true, explanation: 'Correct! SEBI registration protects retail investors. Operating investment schemes outside SEBI parameters is illegal in India and lacks regulatory protection.' },
          { text: 'Government rules do restrict returns. I will join your private fund.', correct: false, explanation: 'Incorrect! Regulations exist to prevent embezzlement. Unregistered funds usually end in capital disappearance.' }
        ]
      },
      {
        id: 'wiz_q2',
        text: '"Look at our office photos and our SEBI corporate license (which displays a registered advisory firm name). Surely, this registration proves your capital is completely safe!"',
        options: [
          { text: 'Scammers frequently steal details of real registered firms. I will crosscheck the advisory registration number directly on SEBI\'s official portal.', correct: true, explanation: 'Correct! Impersonating real corporate firms and stealing SEBI registration codes is a common trick. Verify directly on the official SEBI website.' },
          { text: 'If they have a SEBI logo and a registration certificate photo, it must be genuine.', correct: false, explanation: 'Incorrect! Certificates are easily photoshopped. Always verify details on the regulator\'s database.' }
        ]
      }
    ]
  },
  boss_ai: {
    bossId: 'boss_ai',
    name: 'Deepfake Bot',
    emoji: '🤖',
    title: 'The AI Impersonator',
    description: 'Uses AI synthetic voice clones and video templates to simulate extreme emergency situations involving relatives.',
    questions: [
      {
        id: 'ai_q1',
        text: '"(Crying voice of your son/friend over phone) Dad/Bro! I was arrested by the local police for a minor crash. The inspector is demanding ₹50,000 bribe immediately or they will put me in lockup. Send the cash to this UPI ID right now, my phone is switched off!"',
        options: [
          { text: 'I will hang up and call my relative\'s phone directly. If it is off, I will call other family members or the local police station to verify.', correct: true, explanation: 'Correct! AI voice cloning clones vocal profiles from short social media clips. Always verify emergency stories through alternative contact numbers.' },
          { text: 'His voice matches perfectly. I will send the ₹50,000 UPI immediately to save him!', correct: false, explanation: 'Incorrect! You fell for the panic voice clone. Always verify before executing transactions under emotional pressure.' }
        ]
      },
      {
        id: 'ai_q2',
        text: '"If you hang up to call him, the inspector will lock him up and seize his keys. He won\'t be allowed any calls. Send the money now or his career is ruined!"',
        options: [
          { text: 'Legitimate police procedures do not involve secret UPI transfers to individual accounts. I will report this call to the cyber safety cell.', correct: true, explanation: 'Correct! Scammers block you from hanging up because they know call verification breaks the trick. Police do not collect fines/bail via personal UPI IDs.' },
          { text: 'I cannot risk his career. Sending the money now.', correct: false, explanation: 'Incorrect! The urgency is fabricated. Never send cash to personal UPI addresses during panic calls.' }
        ]
      }
    ]
  }
};
