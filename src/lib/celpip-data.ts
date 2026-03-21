export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  passage?: string;
}

export interface ListeningPart {
  id: string;
  title: string;
  instruction: string;
  transcript: string;
  questions: Question[];
}

export interface ReadingPart {
  id: string;
  title: string;
  instruction: string;
  passage: string;
  questions: Question[];
  paid?: boolean;
}

export interface WritingTask {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords: number;
}

export interface SpeakingTask {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  prepTime: number;
  responseTime: number;
}

import { listeningPartsExtra } from "./listening-data-extra";
import { readingPartsExtra } from "./reading-data-extra";
import { madEnglishTask1Parts } from "./mad-english-task1-correspondence";
import { madEnglishTask2Parts } from "./mad-english-task2-diagram";
import { madEnglishTask3Parts } from "./mad-english-task3-information";
import { madEnglishTask4Parts } from "./mad-english-task4-viewpoints";
import { speakingTasksExtra } from "./speaking-data-extra";
import { writingTasksExtra } from "./writing-data-extra";

// ─── LISTENING ─────────────────────────────────────────

const listeningPartsBase: ListeningPart[] = [
  {
    id: "L0",
    title: "Practice Task (unscored)",
    instruction:
      "This is a practice task to help you get familiar with the listening test format. Your answer will not be scored.",
    transcript: `Woman: Excuse me, could you tell me where the nearest post office is?

Man: Sure. Go straight down this street for two blocks, then turn left at the traffic light. The post office is on the right side, next to the library. You can't miss it.

Woman: Great, thanks. Do you know what time it closes?

Man: I think it closes at 5 PM on weekdays, but it might close earlier on Saturdays — maybe around 1 PM.

Woman: Okay, I'd better hurry then. Thanks for your help!`,
    questions: [
      {
        id: "L0Q1",
        question: "Where is the post office located?",
        options: [
          "Next to the bank",
          "Next to the library",
          "Across from the traffic light",
          "Behind the grocery store",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "L1",
    title: "Part 1: Listening to Problem Solving",
    instruction:
      "You will hear a conversation between two people discussing a problem. Listen carefully and answer the questions.",
    transcript: `Sarah: Hey Mike, I just got an email from the landlord. He says our lease is up next month and he wants to increase the rent by $300.

Mike: Three hundred dollars? That's a huge jump. We're already paying $1,800 a month. Can he even do that legally?

Sarah: I looked it up. In our province, there's a rent increase guideline of about 2.5% per year, which would only be around $45. But he's claiming he did major renovations to the building.

Mike: What renovations? They fixed the elevator and painted the hallway. That hardly seems major.

Sarah: I agree. I think we should write back and mention the provincial guidelines. If he insists, we can file a complaint with the Landlord and Tenant Board.

Mike: That's a good plan. But maybe we should also start looking at other options, just in case. My colleague mentioned there are some new apartments near the subway station that are in our budget.

Sarah: True. Let's do both — respond to the landlord and also check out those apartments this weekend. Can you draft the letter?

Mike: Sure. I'll have it ready by tonight.`,
    questions: [
      {
        id: "L1Q1",
        question: "What is the main problem Sarah and Mike are discussing?",
        options: [
          "Their apartment needs repairs",
          "Their rent is being increased significantly",
          "They want to move to a new city",
          "Their landlord is selling the building",
        ],
        correctAnswer: 1,
      },
      {
        id: "L1Q2",
        question: "How much is the landlord trying to increase the rent?",
        options: ["$45", "$180", "$300", "$1,800"],
        correctAnswer: 2,
      },
      {
        id: "L1Q3",
        question:
          "According to Sarah, what is the provincial rent increase guideline?",
        options: ["About 1.5%", "About 2.5%", "About 5%", "About 10%"],
        correctAnswer: 1,
      },
      {
        id: "L1Q4",
        question: "What does Mike suggest as a backup plan?",
        options: [
          "Moving in with his colleague",
          "Hiring a lawyer immediately",
          "Looking at apartments near the subway",
          "Asking for a month-to-month lease",
        ],
        correctAnswer: 2,
      },
      {
        id: "L1Q5",
        question: "Who will draft the letter to the landlord?",
        options: ["Sarah", "Mike", "Their lawyer", "A tenant association"],
        correctAnswer: 1,
      },
      {
        id: "L1Q6",
        question:
          "What reason does the landlord give for the large rent increase?",
        options: [
          "Rising property taxes",
          "Major renovations to the building",
          "Increased utility costs",
          "New amenities added to the building",
        ],
        correctAnswer: 1,
      },
      {
        id: "L1Q7",
        question:
          "What does Sarah plan to do if the landlord insists on the increase?",
        options: [
          "Hire a lawyer to sue the landlord",
          "Accept the increase and stay",
          "File a complaint with the Landlord and Tenant Board",
          "Organize a tenant protest",
        ],
        correctAnswer: 2,
      },
      {
        id: "L1Q8",
        question: "What do Sarah and Mike agree to do this weekend?",
        options: [
          "Meet with the landlord in person",
          "Visit the Landlord and Tenant Board office",
          "Check out apartments near the subway station",
          "Move their belongings to a storage unit",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L2",
    title: "Part 2: Listening to a Daily Life Conversation",
    instruction:
      "You will hear a conversation in a daily life context. Listen and answer the questions.",
    transcript: `Receptionist: Good morning, Greenfield Medical Clinic. How can I help you?

Patient: Hi, I'd like to book an appointment with Dr. Chen. I've been having some persistent headaches.

Receptionist: I'm sorry to hear that. Dr. Chen is quite booked this week. The earliest I can offer is next Tuesday at 2:30 PM. Would that work?

Patient: That's almost a week away. Is there anything sooner? The headaches are getting worse.

Receptionist: Let me check... Actually, we had a cancellation. I can fit you in this Thursday at 10:15 AM. But it would be with Dr. Patel instead of Dr. Chen. Dr. Patel is also excellent with neurological concerns.

Patient: That works better. I'll take the Thursday appointment. Do I need to bring anything?

Receptionist: Please bring your health card and a list of any medications you're currently taking. Also, since this is your first visit, please arrive 15 minutes early to fill out the new patient forms.

Patient: Great. My name is James Morrison. M-O-R-R-I-S-O-N.

Receptionist: Got it. You're all set for Thursday, October 12th at 10:15 AM with Dr. Patel.`,
    questions: [
      {
        id: "L2Q1",
        question: "Why is the patient calling the clinic?",
        options: [
          "To renew a prescription",
          "To book an appointment for headaches",
          "To get test results",
          "To cancel an appointment",
        ],
        correctAnswer: 1,
      },
      {
        id: "L2Q2",
        question: "Why can't the patient see Dr. Chen this week?",
        options: [
          "Dr. Chen is on vacation",
          "Dr. Chen is fully booked",
          "Dr. Chen doesn't treat headaches",
          "The clinic is closed this week",
        ],
        correctAnswer: 1,
      },
      {
        id: "L2Q3",
        question: "When is the appointment the patient accepts?",
        options: [
          "Tuesday at 2:30 PM",
          "Wednesday at 10:15 AM",
          "Thursday at 10:15 AM",
          "Friday at 2:30 PM",
        ],
        correctAnswer: 2,
      },
      {
        id: "L2Q4",
        question:
          "What should the patient bring to the appointment? (Select the best answer)",
        options: [
          "Only a health card",
          "Health card and medication list",
          "A referral letter from another doctor",
          "Previous medical records",
        ],
        correctAnswer: 1,
      },
      {
        id: "L2Q5",
        question: "Why should the patient arrive 15 minutes early?",
        options: [
          "To meet Dr. Patel beforehand",
          "To get blood work done",
          "To fill out new patient forms",
          "To find parking",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L3",
    title: "Part 3: Listening to Information",
    instruction:
      "You will hear an informational presentation. Listen carefully and answer the questions.",
    transcript: `Welcome to the City of Maplewood's annual community update. I'm Mayor Linda Park, and I'm here to share some exciting developments for the coming year.

First, transportation. Our new light rail transit line connecting downtown to the eastern suburbs will begin construction in April. The project is expected to take 18 months to complete and will feature six new stations. During construction, bus routes 14, 22, and 31 will be temporarily rerouted.

Second, parks and recreation. We're investing $4.2 million to renovate Riverside Park. The plan includes a new splash pad for children, upgraded walking trails, and an outdoor amphitheater for community events. Work begins in June.

Third, I'd like to address housing. We've approved the development of 350 new affordable housing units in the Westgate neighbourhood. Priority will go to families with children and seniors. Applications open on March 1st through the city's housing portal.

Finally, a note on public safety. We're hiring 40 additional firefighters and opening a new fire station on Oak Street. This will reduce response times in the northern district by approximately 4 minutes.

Thank you for being engaged citizens. Questions can be directed to our new community hotline at 311.`,
    questions: [
      {
        id: "L3Q1",
        question: "When will construction of the light rail begin?",
        options: ["January", "March", "April", "June"],
        correctAnswer: 2,
      },
      {
        id: "L3Q2",
        question: "How many stations will the new light rail have?",
        options: ["Four", "Five", "Six", "Eight"],
        correctAnswer: 2,
      },
      {
        id: "L3Q3",
        question:
          "How much money is being invested in Riverside Park renovations?",
        options: [
          "$2.4 million",
          "$3.5 million",
          "$4.2 million",
          "$5.1 million",
        ],
        correctAnswer: 2,
      },
      {
        id: "L3Q4",
        question: "Who gets priority for the new affordable housing units?",
        options: [
          "First-time homebuyers",
          "City employees",
          "Families with children and seniors",
          "University students",
        ],
        correctAnswer: 2,
      },
      {
        id: "L3Q5",
        question:
          "By how much will fire response times be reduced in the northern district?",
        options: [
          "About 2 minutes",
          "About 4 minutes",
          "About 6 minutes",
          "About 10 minutes",
        ],
        correctAnswer: 1,
      },
      {
        id: "L3Q6",
        question:
          "How can residents contact the city with questions about these developments?",
        options: [
          "By emailing the mayor directly",
          "By visiting city hall in person",
          "By calling the community hotline at 311",
          "By attending a town hall meeting",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L4",
    title: "Part 4: Listening to a News Item",
    instruction: "You will hear a news report. Listen and answer the questions.",
    transcript: `This is CBC News at Six. I'm Rachel Nguyen.

A major winter storm is bearing down on southern British Columbia, and Environment Canada has issued warnings for the Greater Vancouver area and the Fraser Valley. The storm, which originated in the Gulf of Alaska, is expected to bring 25 to 40 centimetres of snow between tonight and Saturday morning.

TransLink has announced that SkyTrain service may be reduced to 15-minute intervals if conditions worsen. BC Ferries has already cancelled all sailings between Tsawwassen and Swartz Bay for tomorrow. Vancouver International Airport is advising travellers to check their flight status before heading to the airport, as delays and cancellations are expected.

The City of Vancouver has activated its emergency response plan and opened three additional warming centres for people experiencing homelessness. The centres are located at the Vancouver Convention Centre, the Roundhouse Community Centre, and Britannia Secondary School.

Residents are advised to stock up on essentials, keep their phones charged, and avoid unnecessary travel. Power outages are possible, particularly in the North Shore mountains.

Environment Canada forecaster David Liu says this could be the most significant snowfall event in Vancouver since 2017.`,
    questions: [
      {
        id: "L4Q1",
        question: "Where did the storm originate?",
        options: [
          "The Pacific Northwest",
          "The Gulf of Alaska",
          "The Arctic Circle",
          "Northern Alberta",
        ],
        correctAnswer: 1,
      },
      {
        id: "L4Q2",
        question: "How much snow is expected?",
        options: [
          "10 to 20 cm",
          "15 to 30 cm",
          "25 to 40 cm",
          "40 to 60 cm",
        ],
        correctAnswer: 2,
      },
      {
        id: "L4Q3",
        question: "What has BC Ferries done?",
        options: [
          "Reduced ferry sizes",
          "Increased ticket prices",
          "Cancelled sailings between Tsawwassen and Swartz Bay",
          "Added extra sailings",
        ],
        correctAnswer: 2,
      },
      {
        id: "L4Q4",
        question: "How many additional warming centres have been opened?",
        options: ["Two", "Three", "Four", "Five"],
        correctAnswer: 1,
      },
      {
        id: "L4Q5",
        question:
          "When was the last time Vancouver had a comparable snowfall event?",
        options: ["2012", "2015", "2017", "2019"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L5",
    title: "Part 5: Listening to a Discussion",
    instruction:
      "You will hear a discussion between colleagues. Listen and answer the questions.",
    transcript: `Manager (Karen): Thanks for coming in, everyone. As you know, our quarterly sales numbers are in, and we need to talk about the results and plan for next quarter.

Tom: I can start. Our online sales grew by 12% this quarter, which is solid. But our in-store numbers dropped by 8%. I think that's partly due to the road construction on Main Street. Foot traffic has been way down.

Lisa: I agree with Tom on that. But I also think we need to look at our product mix. Our premium line isn't selling as well as it used to. Customers are asking for more mid-range options.

Karen: That's a valid point. What about the loyalty program? We launched that in September.

Tom: Actually, the loyalty program has been a bright spot. We've signed up 2,300 members in just two months, and repeat purchases from members are up 18%.

Lisa: The problem is the sign-up process. It's too complicated. I've had customers abandon it at the register. If we simplify it to just an email address, I think we'll get even more sign-ups.

Karen: Good feedback. Let's do this — Tom, can you pull together a proposal for expanding the mid-range product line? Lisa, work with IT to simplify the loyalty sign-up. I want both proposals by next Friday.

Tom: Will do.

Lisa: Sounds good.`,
    questions: [
      {
        id: "L5Q1",
        question: "By how much did online sales grow this quarter?",
        options: ["8%", "10%", "12%", "18%"],
        correctAnswer: 2,
      },
      {
        id: "L5Q2",
        question:
          "What does Tom believe caused the drop in in-store sales?",
        options: [
          "Poor customer service",
          "Road construction reducing foot traffic",
          "Higher prices",
          "Competition from a new store",
        ],
        correctAnswer: 1,
      },
      {
        id: "L5Q3",
        question:
          "What product change does Lisa suggest?",
        options: [
          "Dropping the premium line entirely",
          "Adding more luxury items",
          "Offering more mid-range options",
          "Focusing only on online products",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q4",
        question: "How many loyalty program members have signed up?",
        options: ["1,800", "2,000", "2,300", "3,200"],
        correctAnswer: 2,
      },
      {
        id: "L5Q5",
        question: "What does Karen ask Lisa to do?",
        options: [
          "Train new staff on the loyalty program",
          "Contact customers about the premium line",
          "Work with IT to simplify the loyalty sign-up",
          "Prepare a marketing campaign",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q6",
        question:
          "By how much did in-store sales drop this quarter?",
        options: ["4%", "8%", "12%", "18%"],
        correctAnswer: 1,
      },
      {
        id: "L5Q7",
        question:
          "What is the issue Lisa identifies with the loyalty program sign-up?",
        options: [
          "It requires a monthly fee",
          "It is only available online",
          "The sign-up process is too complicated",
          "Customers are not aware it exists",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q8",
        question:
          "By when does Karen want the proposals from Tom and Lisa?",
        options: [
          "By the end of the day",
          "By next Wednesday",
          "By next Friday",
          "By the end of the month",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L6",
    title: "Part 6: Listening to Viewpoints",
    instruction:
      "You will hear a discussion presenting different viewpoints. Listen and answer the questions.",
    transcript: `Host: Welcome to Community Voices. Today we're discussing whether the city should ban single-use plastics. I have two guests: Dr. Amy Foster, an environmental scientist, and Mark Sullivan, who represents the local restaurant association.

Dr. Foster: Thank you for having me. The case is clear. Single-use plastics are clogging our waterways, harming wildlife, and filling our landfills. Over 80% of ocean plastic comes from land-based sources, and cities that have implemented bans have seen measurable reductions in plastic pollution. We need to act now.

Mark: I appreciate Dr. Foster's passion, but a total ban would devastate small businesses. Many restaurants run on thin margins. Switching to compostable containers costs three to four times more. We need a gradual transition, not an overnight ban.

Dr. Foster: I understand the cost concern, and that's why I'm proposing a phased approach — start with plastic bags and straws, then move to containers over two years. The city could also subsidize the transition for small businesses.

Mark: A subsidy program would help, but who pays for it? Taxpayers? And what about consumer choice? Many of our customers actually prefer plastic takeout containers because they're leak-proof and microwave-safe.

Dr. Foster: Consumer preferences can shift. Look at what happened when stores started charging for plastic bags — usage dropped by 70% in the first year. People adapt. And the long-term healthcare and environmental costs of plastic pollution far outweigh the short-term transition costs.

Host: Thank you both. It's clear this is a nuanced issue that needs careful planning.`,
    questions: [
      {
        id: "L6Q1",
        question: "What is Dr. Foster's main argument?",
        options: [
          "Plastics are too expensive for businesses",
          "Single-use plastics are causing serious environmental harm",
          "The city should invest in recycling instead",
          "Restaurants should use glass containers",
        ],
        correctAnswer: 1,
      },
      {
        id: "L6Q2",
        question: "What is Mark's primary concern about a plastic ban?",
        options: [
          "It would hurt tourism",
          "It would reduce food quality",
          "It would increase costs for small businesses",
          "It would create more landfill waste",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q3",
        question: "What does Dr. Foster suggest as a compromise?",
        options: [
          "Ban all plastics immediately",
          "Only ban plastics in parks",
          "A phased approach starting with bags and straws",
          "Let businesses decide on their own",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q4",
        question:
          "How much more expensive are compostable containers according to Mark?",
        options: [
          "Twice as much",
          "Three to four times more",
          "Five times more",
          "Ten times more",
        ],
        correctAnswer: 1,
      },
      {
        id: "L6Q5",
        question:
          "What happened when stores started charging for plastic bags?",
        options: [
          "Sales increased",
          "Usage dropped by 50%",
          "Usage dropped by 70%",
          "Customers stopped shopping",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q6",
        question:
          "According to Dr. Foster, what percentage of ocean plastic comes from land-based sources?",
        options: [
          "Over 50%",
          "Over 60%",
          "Over 70%",
          "Over 80%",
        ],
        correctAnswer: 3,
      },
    ],
  },
];

export const listeningParts: ListeningPart[] = [...listeningPartsBase, ...listeningPartsExtra];
// Official CELPIP test set (1 practice + 6 parts = 7 items, 39 questions)
export const listeningPartsOfficial: ListeningPart[] = listeningPartsBase;

// ─── READING ───────────────────────────────────────────

const readingPartsBase: ReadingPart[] = [
  {
    id: "R0",
    title: "Practice Task (unscored)",
    instruction:
      "This is a practice task to help you get familiar with the reading test format. Your answer will not be scored.",
    passage: `NOTICE — GREENFIELD PUBLIC LIBRARY

Holiday Hours: The library will be closed on Monday, February 17 (Family Day). Regular hours resume on Tuesday, February 18.

Book returns can be made at any time using the outdoor drop box located to the left of the main entrance. Late fees will not be charged for items due on February 17.

If you need to renew items, please use our online portal at www.greenfieldlibrary.ca or call 905-555-0142 during regular business hours.`,
    questions: [
      {
        id: "R0Q1",
        question: "How can you bring back a borrowed item on the day the library is closed for the holiday?",
        options: [
          "Wait until the library reopens on February 18",
          "Use the outdoor drop box by the main entrance",
          "Call the library to arrange a special return",
          "Bring it to the nearest community centre",
        ],
        correctAnswer: 1,
      },
    ],
  },
  (() => {
    const passageA = `From: HR Department <hr@techsolutions.ca>
To: All Employees
Subject: Updated Remote Work Policy — Effective January 15

Dear Team,

Following our company-wide survey and consultation with department heads, we are pleased to announce our updated remote work policy, effective January 15th.

Key Changes:

1. Hybrid Model: All employees may work remotely up to 3 days per week. The remaining 2 days must be spent in the office. Each department will designate which days are mandatory in-office days.

2. Core Hours: Regardless of location, all employees must be available between 10:00 AM and 3:00 PM Eastern Time. Outside these hours, flexible scheduling is permitted with manager approval.

3. Equipment: The company will provide a one-time $500 stipend for home office setup. Receipts must be submitted to Finance by March 1st for reimbursement.

4. Performance Reviews: Remote work eligibility will be reviewed quarterly. Employees who do not meet performance targets may be required to return to full-time in-office work.

5. Team Meetings: All-hands meetings will be held in person on the first Monday of each month. Attendance is mandatory unless you have prior written approval from your direct supervisor.

Please review the full policy document on the company intranet. If you have questions, contact your HR representative or email hr@techsolutions.ca.

Best regards,
Jennifer Walsh
Director of Human Resources`;

    const passageB = `From: David Park <d.park@techsolutions.ca>
To: HR Department <hr@techsolutions.ca>
Subject: RE: Updated Remote Work Policy — Effective January 15

Dear Jennifer,

Thank you for sharing the updated remote work policy. I appreciate the effort that went into gathering employee feedback and consulting with department heads. I have a few questions and concerns that I would like to raise on behalf of the Marketing Department.

First, regarding the mandatory in-office days, our team frequently collaborates with external clients who are based in the Pacific Time Zone. Having our in-office days fixed by the department could ___ [7] with key client meetings. Would it be possible for individual teams within a department to negotiate their in-office schedules based on client-facing obligations?

Second, I wanted to ask about the home office stipend. Several members of my team already invested in home office equipment during the previous remote work arrangement in 2022. Will employees who purchased equipment at their own expense before this policy be eligible for any ___ [8], or does the $500 stipend apply only to new purchases made after January 15th?

Third, I am concerned about the quarterly performance review process for remote work eligibility. Our department's major campaigns typically launch in Q1 and Q3, which means our workload and measurable output vary significantly throughout the year. Could you clarify whether ___ [9] will be taken into account when evaluating remote work eligibility?

Finally, regarding the monthly all-hands meetings, the first Monday of the month often coincides with our campaign launch preparation days. Would it be feasible to provide at least ___ [10] of the meeting agenda so that teams can plan accordingly? Additionally, for employees who travel for business, will ___ [11] be accepted as an alternative when travel conflicts arise?

I look forward to your response and any additional guidance on these matters.

Best regards,
David Park
Senior Marketing Manager`;

    return {
      id: "R1",
      title: "Part 1: Reading Correspondence",
      instruction:
        "Read the following email exchange. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: passageA,
      questions: [
        {
          id: "R1Q1",
          question: "How often are staff permitted to work from home each week?",
          options: ["1 day", "2 days", "3 days", "4 days"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R1Q2",
          question: "During which mandatory availability window must all staff be reachable?",
          options: [
            "8:00 AM to 4:00 PM",
            "9:00 AM to 5:00 PM",
            "10:00 AM to 3:00 PM",
            "9:00 AM to 3:00 PM",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R1Q3",
          question: "What is the financial allowance provided for setting up a workspace at home?",
          options: ["$250", "$400", "$500", "$750"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R1Q4",
          question:
            "What consequence may follow if a worker fails to achieve their productivity goals?",
          options: [
            "They receive a warning",
            "They lose their stipend",
            "They may have to return to full-time in-office",
            "They are automatically terminated",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R1Q5",
          question: "How frequently do company-wide gatherings take place, and on what schedule?",
          options: [
            "Every Friday",
            "The first Monday of each month",
            "The last Wednesday of each month",
            "Every two weeks",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "R1Q6",
          question: "On what date do the new telecommuting guidelines come into force?",
          options: [
            "December 1",
            "January 1",
            "January 15",
            "February 1",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R1Q7",
          question: "Having our in-office days fixed by the department could ___ with key client meetings.",
          options: [
            "interfere",
            "conflict",
            "compete",
            "overlap",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R1Q8",
          question: "Will employees who purchased equipment at their own expense before this policy be eligible for any ___?",
          options: [
            "tax deduction",
            "bonus payment",
            "retroactive reimbursement",
            "equipment exchange",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R1Q9",
          question: "Could you clarify whether ___ will be taken into account when evaluating remote work eligibility?",
          options: [
            "employee seniority",
            "seasonal variations in productivity",
            "department budgets",
            "client satisfaction scores",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R1Q10",
          question: "Would it be feasible to provide at least ___ of the meeting agenda so that teams can plan accordingly?",
          options: [
            "one week's advance notice",
            "two weeks' advance notice",
            "three days' advance notice",
            "one month's advance notice",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R1Q11",
          question: "For employees who travel for business, will ___ be accepted as an alternative when travel conflicts arise?",
          options: [
            "sending a delegate",
            "submitting a written report",
            "rescheduling their trip",
            "virtual attendance",
          ],
          correctAnswer: 3,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "R2",
    title: "Part 2: Reading to Apply a Diagram",
    instruction:
      "Read the following schedule and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `MAPLEWOOD COMMUNITY CENTRE — WINTER PROGRAM SCHEDULE

Registration opens: November 15 | Programs begin: January 8

SWIMMING POOL SCHEDULE:
| Time Slot       | Monday      | Tuesday     | Wednesday   | Thursday    | Friday      | Saturday    |
|-----------------|-------------|-------------|-------------|-------------|-------------|-------------|
| 6:00–8:00 AM    | Lap Swim    | Aqua Fit    | Lap Swim    | Aqua Fit    | Lap Swim    | Family Swim |
| 9:00–11:00 AM   | Seniors     | Lessons L1  | Seniors     | Lessons L1  | Seniors     | Lessons L2  |
| 12:00–2:00 PM   | Public Swim | Public Swim | Public Swim | Public Swim | Public Swim | Public Swim |
| 3:00–5:00 PM    | Lessons L2  | Lessons L3  | Lessons L2  | Lessons L3  | Closed*     | Closed      |
| 6:00–8:00 PM    | Public Swim | Aqua Fit    | Public Swim | Aqua Fit    | Closed*     | Closed      |

*Friday afternoons and evenings: pool closed for maintenance

FEES (per 12-week session):
- Lap Swim Pass: $85
- Aqua Fit: $120
- Swim Lessons (all levels): $150
- Public Swim (drop-in): $5/visit or $45 for a 10-visit pass
- Seniors Swim: Free for residents 65+; $3/visit for non-residents
- Family Swim: $8/family (up to 2 adults + 3 children)

NOTES:
- All swimmers must pass a swim test before registering for Level 3 lessons.
- Children under 8 must be accompanied by an adult during public swim.
- Locker rentals: $25/session. Limited availability — first come, first served.

---

Hi Karen,

I just picked up the new winter schedule from Maplewood Community Centre. I think we should sign the kids up for swimming lessons! Registration opens on ___ [1], so we need to act fast.

I was looking at the schedule and I think Level 2 lessons would work best. They're offered on ___ [2], which means I could drop the kids off on my way to my Saturday errands. The weekday afternoon Level 2 sessions are on Monday and Wednesday, but those conflict with Emma's piano lessons.

I also noticed they have an Aqua Fit class in the early mornings. I know you've been looking for an exercise class — it runs on ___ [3] at 6:00 AM. The cost for the full session would be ___ [4].

One more thing — since Mom is visiting in January, she might enjoy the seniors program. The good news is that since she's 70 and lives here, ___ [5]. I think she'd love the weekday morning sessions.

Let me know what you think and I'll register everyone online.

Talk soon,
Megan`,
    questions: [
      {
        id: "R2Q1",
        question: "Registration opens on ___.",
        options: [
          "October 15",
          "November 1",
          "November 15",
          "January 8",
        ],
        correctAnswer: 2,
      },
      {
        id: "R2Q2",
        question: "They're offered on ___.",
        options: [
          "Tuesday and Thursday mornings",
          "Saturday mornings",
          "Monday and Wednesday afternoons",
          "Friday mornings",
        ],
        correctAnswer: 1,
      },
      {
        id: "R2Q3",
        question: "It runs on ___ at 6:00 AM.",
        options: [
          "Monday and Wednesday",
          "Monday through Friday",
          "Tuesday and Thursday",
          "Saturday and Sunday",
        ],
        correctAnswer: 2,
      },
      {
        id: "R2Q4",
        question: "The cost for the full session would be ___.",
        options: ["$85", "$120", "$150", "$45"],
        correctAnswer: 1,
      },
      {
        id: "R2Q5",
        question: "Since she's 70 and lives here, ___.",
        options: [
          "she would pay $3 per visit",
          "she would need a doctor's note",
          "it would be free for her",
          "she could get a 10-visit pass for $45",
        ],
        correctAnswer: 2,
      },
      {
        id: "R2Q6",
        question: "Why did Megan rule out the weekday afternoon Level 2 sessions?",
        options: [
          "They are too expensive",
          "They conflict with Emma's piano lessons",
          "The pool is closed for maintenance",
          "Karen works on those days",
        ],
        correctAnswer: 1,
      },
      {
        id: "R2Q7",
        question: "What requirement would the children need to meet before moving to Level 3?",
        options: [
          "A doctor's note",
          "Completion of Level 2",
          "A swim test",
          "Parental consent",
        ],
        correctAnswer: 2,
      },
      {
        id: "R2Q8",
        question: "Megan and Karen are most likely ___.",
        options: [
          "coworkers",
          "neighbours",
          "sisters or partners who share a family",
          "friends from the community centre",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "R3",
    title: "Part 3: Reading for Information",
    instruction: "Read the following article. For each statement below, identify which paragraph (A, B, C, or D) the information is found in. If the information is not found in any paragraph, choose E.",
    passage: `A. Urban farming — growing food in cities — is no longer a fringe movement. Across Canada, municipalities, non-profits, and everyday citizens are turning empty lots, rooftops, and even parking garages into productive green spaces. The trend has accelerated since 2020, driven by concerns about food security, environmental sustainability, and community well-being.

B. In Montreal, the Lufa Farms network operates the world's largest commercial rooftop greenhouse, spanning over 163,000 square feet across four locations. They deliver fresh vegetables to over 20,000 subscribers weekly, reducing food transportation distances dramatically. Their model proves that urban agriculture can be commercially viable at scale. Vancouver has taken a different approach, focusing on community gardens. The city now has over 100 community garden sites, with a waiting list of more than 3,000 people. In 2023, the city council approved a rezoning bylaw that allows urban farming on any residentially zoned lot, removing a significant regulatory barrier. Toronto's approach combines technology with tradition. Several vertical farming startups have set up operations in former industrial buildings in the city's east end. These facilities use LED lighting and hydroponic systems to grow leafy greens year-round, using 95% less water than conventional farming.

C. Critics argue that urban farming can never replace traditional agriculture at the scale needed to feed growing cities. Dr. Helena Marchetti, an agricultural economist at the University of Guelph, points out that "urban farms excel at growing leafy greens and herbs, but staple crops like wheat, corn, and potatoes still require vast tracts of rural farmland." However, proponents counter that urban farming addresses food deserts — neighbourhoods with limited access to fresh, affordable food. A 2023 report by Food Secure Canada found that 4.4 million Canadians live in food-insecure households. Community gardens and local farms can improve access and reduce reliance on long supply chains that are vulnerable to disruption.

D. The economic potential is also significant. The Canadian Urban Farm Association estimates that the urban agriculture sector in Canada is now worth $2.8 billion annually and supports approximately 14,000 full-time jobs. As cities continue to grow, the integration of food production into urban planning is likely to become not just desirable but necessary.

E. Not in any of the paragraphs`,
    questions: [
      {
        id: "R3Q1",
        question: "A commercial farm delivers fresh vegetables to thousands of customers on a weekly basis.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "R3Q2",
        question: "A city government changed its land-use regulations to remove a barrier to urban agriculture.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "R3Q3",
        question: "Indoor growing facilities use significantly less water than conventional farming methods.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "R3Q4",
        question: "An expert questions whether urban farms can produce essential staple crops at a large enough scale.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "R3Q5",
        question: "Millions of Canadians live in households that do not have reliable access to adequate food.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "R3Q6",
        question: "The growth of urban farming has been driven by worries about food security and the environment.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "R3Q7",
        question: "High demand for shared growing spaces in one city has resulted in a long waiting list.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "R3Q8",
        question: "The urban agriculture sector provides a significant number of full-time employment opportunities.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "R3Q9",
        question: "The Canadian government has announced a national strategy to fund urban farming initiatives.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 4,
      },
    ],
  },
  {
    id: "R4",
    title: "Part 4: Reading for Viewpoints",
    instruction:
      "Read the following article and response. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
    passage: `SHOULD CANADA ADOPT A FOUR-DAY WORK WEEK?

The four-day work week is gaining momentum worldwide, and Canada is paying attention. Pilot programs in Iceland, the UK, and Japan have consistently shown that when employees work four days instead of five, productivity stays the same or even improves. In Iceland's landmark trial involving over 2,500 workers, productivity remained steady while employee well-being scores increased dramatically.

The benefits extend beyond individual well-being. Reduced commuting means lower carbon emissions. Fewer office days mean lower operational costs for businesses. And in a tight labour market, offering a four-day week can be a powerful recruitment and retention tool. A recent survey by Indeed Canada found that 67% of Canadian workers would consider taking a pay cut of up to 5% for a four-day schedule.

However, critics argue the model is impractical for many industries. David Chen, a logistics company owner with 45 employees, points out that his clients expect deliveries six days a week. If his drivers worked only four days, he would need to hire 20% more staff to maintain the same service level. The pilot programs cited by advocates mostly involved office-based, knowledge-economy workers and don't represent the reality of manufacturing, healthcare, retail, or logistics.

Labour economist Dr. Sandra Okafor suggests that the goal shouldn't be a mandated four-day week but rather a framework that empowers businesses and employees to negotiate arrangements suited to their context. In her research, the most successful work-time reduction models are sector-specific: hospitals use compressed shifts, tech companies offer flexible Fridays, and retail businesses rotate shorter weeks among staff. She argues that legislation should protect workers who negotiate alternative schedules from discrimination, noting that requesting reduced hours can currently signal a lack of commitment, especially for women and caregivers.

---

As someone who has worked in logistics for 15 years, I think this article raises some important points. The Iceland trial sounds impressive, but I doubt the results would ___ [6]. David Chen is right that in our industry, switching to four days would ___ [7]. I've seen companies try compressed schedules before, and the result was ___ [8]. Dr. Okafor's idea about sector-specific models makes the most sense to me. What we really need is ___ [9]. The article mentions that 67% of workers would accept a pay cut, but I suspect most of those people are already ___ [10].`,
    questions: [
      { id: "R4Q1", question: "What did the Iceland trial demonstrate about the four-day work week?", options: ["Productivity declined slightly but was acceptable", "Productivity stayed the same or improved while well-being increased", "Workers were less satisfied with their jobs", "Companies saved money but workers were unhappy"], correctAnswer: 1 },
      { id: "R4Q2", question: "What trade-off would a majority of Canadian workers be willing to accept for a four-day schedule?", options: ["Quitting their current job", "Moving to a different city for better hours", "Taking a pay cut of up to 5%", "Working longer hours for higher pay"], correctAnswer: 2 },
      { id: "R4Q3", question: "Why does David Chen believe the four-day work week is impractical for his business?", options: ["His employees don't want shorter weeks", "His clients expect deliveries six days a week and he would need 20% more staff", "His company has already tried it and failed", "Government regulations prevent him from changing schedules"], correctAnswer: 1 },
      { id: "R4Q4", question: "What does Dr. Okafor believe is the most effective approach to work-time reduction?", options: ["A mandatory four-day week for all industries", "Sector-specific models with legal protections for workers", "Letting each company decide without any government involvement", "Eliminating overtime pay entirely"], correctAnswer: 1 },
      { id: "R4Q5", question: "According to Dr. Okafor, what stigma do workers face when requesting reduced hours?", options: ["They lose health benefits", "They are paid less per hour", "They may be seen as less committed, especially women and caregivers", "Their contracts are automatically terminated"], correctAnswer: 2 },
      { id: "R4Q6", question: "I doubt the results would ___.", options: ["apply to physically demanding jobs like logistics", "be repeated in any other country", "impress Canadian politicians", "change the way people think about work"], correctAnswer: 0 },
      { id: "R4Q7", question: "Switching to four days would ___.", options: ["improve driver morale immediately", "have no effect on our operations", "force us to hire more people and raise costs", "make our clients switch to competitors"], correctAnswer: 2 },
      { id: "R4Q8", question: "I've seen companies try compressed schedules before, and the result was ___.", options: ["a huge success for everyone involved", "employee burnout from longer daily shifts", "an increase in company profits", "better customer satisfaction"], correctAnswer: 1 },
      { id: "R4Q9", question: "What we really need is ___.", options: ["a law requiring all companies to adopt a four-day week", "flexible arrangements that fit different types of work", "higher wages instead of shorter hours", "more government-funded research on the topic"], correctAnswer: 1 },
      { id: "R4Q10", question: "I suspect most of those people are already ___.", options: ["working in physically demanding jobs", "unhappy with their current employers", "earning enough to afford a small pay cut", "planning to quit their jobs"], correctAnswer: 2 },
    ],
  },
];

export const readingParts: ReadingPart[] = [...readingPartsBase, ...readingPartsExtra, ...madEnglishTask1Parts, ...madEnglishTask2Parts, ...madEnglishTask3Parts, ...madEnglishTask4Parts];
// Official CELPIP test set (1 practice + 4 parts = 5 items, 39 questions)
export const readingPartsOfficial: ReadingPart[] = readingPartsBase;

// ─── WRITING ───────────────────────────────────────────

const writingTasksBase: WritingTask[] = [
  {
    id: "W1",
    title: "Task 1: Writing an Email",
    instruction:
      "Read the following situation and write an email of about 150–200 words.",
    prompt: `You recently moved into a new apartment. After the first week, you noticed several problems: the kitchen faucet leaks constantly, the heating system doesn't work properly in the bedroom, and there is a crack in the bathroom window.

Write an email to your landlord. In your email:
- Describe the problems you have found
- Explain how these problems are affecting you
- Request that the repairs be made promptly`,
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "W2",
    title: "Task 2: Responding to Survey Questions",
    instruction:
      "Read the following information and write a response of about 150–200 words.",
    prompt: `Your city council is considering two options for developing an empty lot in your neighbourhood:

Option A: Build a community sports centre with an indoor pool, gym, and basketball courts.
Option B: Build a public library with a children's reading area, computer lab, and study rooms.

Choose the option you prefer and explain why. Support your choice with reasons and examples.`,
    minWords: 150,
    maxWords: 200,
  },
];

export const writingTasks: WritingTask[] = [...writingTasksBase, ...writingTasksExtra];
// Official CELPIP test set (2 tasks)
export const writingTasksOfficial: WritingTask[] = writingTasksBase;

// ─── SPEAKING ──────────────────────────────────────────

const speakingTasksBase: SpeakingTask[] = [
  {
    id: "S0",
    title: "Practice Task (unscored)",
    instruction:
      "This is a practice task. It will not be scored. Respond to the prompt below to warm up.",
    prompt:
      "Talk about a place you like to visit on weekends. Describe what you do there and why you enjoy it.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S1",
    title: "Task 1: Giving Advice",
    instruction:
      "A friend is asking you for advice. Respond as if you are speaking to them.",
    prompt:
      'Your friend has been offered a job in another city. The job pays 30% more than their current salary, but they would have to leave their family and friends behind. They ask you: "Should I take this job offer?" Give them your advice.',
    prepTime: 30,
    responseTime: 90,
  },
  {
    id: "S2",
    title: "Task 2: Talking About a Personal Experience",
    instruction: "Describe a personal experience based on the prompt below.",
    prompt:
      "Talk about a time when you had to learn something new quickly. What was the situation? What did you do? How did it turn out?",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S3",
    title: "Task 3: Describing a Scene",
    instruction:
      "Describe the scene below in as much detail as possible. Imagine you are describing it to someone who cannot see it.",
    prompt:
      "Scene: A busy farmer's market on a Saturday morning. There are colourful stalls selling fruits, vegetables, baked goods, and flowers. A musician is playing guitar near the entrance. Children are running between the stalls while parents browse. An elderly couple is sitting on a bench sharing a pastry.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S4",
    title: "Task 4: Making Predictions",
    instruction: "Make predictions about the situation described below.",
    prompt:
      "A major technology company has just announced that it will open a large office in a small Canadian town of 15,000 people. The office will employ 2,000 workers. What do you think will happen to the town? Discuss both positive and negative effects.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S5",
    title: "Task 5: Comparing and Persuading",
    instruction:
      "Compare the two options below and persuade your friend to choose the one you prefer.",
    prompt:
      "Your friend wants to get healthier and is deciding between two options: (A) Joining a gym with a personal trainer, or (B) Starting to bike to work every day instead of driving. Compare these two options and persuade your friend to choose the one you think is better.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S6",
    title: "Task 6: Dealing with a Difficult Situation",
    instruction: "Respond to the difficult situation described below.",
    prompt:
      "You are a team leader at work. One of your team members, who is usually very reliable, has been arriving late and missing deadlines for the past two weeks. Other team members are starting to complain. How would you handle this situation? What would you say to the team member?",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S7",
    title: "Task 7: Expressing Opinions",
    instruction: "Express your opinion on the topic below.",
    prompt:
      "Some people believe that social media has made people more connected, while others think it has made people more isolated. What is your opinion? Give reasons and examples to support your view.",
    prepTime: 30,
    responseTime: 90,
  },
  {
    id: "S8",
    title: "Task 8: Describing an Unusual Situation",
    instruction:
      "Describe what is happening in the unusual situation below and explain what you think might have led to it.",
    prompt:
      "You arrive at your office on a Monday morning and find that all the furniture has been rearranged. Desks are facing the walls, the break room table is in the lobby, and there are sticky notes with smiley faces on every computer screen. No one else seems to know what happened. Describe this situation and suggest what might have caused it.",
    prepTime: 30,
    responseTime: 60,
  },
];

export const speakingTasks: SpeakingTask[] = [...speakingTasksBase, ...speakingTasksExtra];
// Official CELPIP test set (1 practice + 8 tasks = 9 items)
export const speakingTasksOfficial: SpeakingTask[] = speakingTasksBase;

// ─── SCORING ───────────────────────────────────────────

export function calculateCelpipScore(
  correctAnswers: number,
  totalQuestions: number
): number {
  const percentage = correctAnswers / totalQuestions;
  if (percentage >= 0.95) return 12;
  if (percentage >= 0.88) return 11;
  if (percentage >= 0.8) return 10;
  if (percentage >= 0.72) return 9;
  if (percentage >= 0.64) return 8;
  if (percentage >= 0.55) return 7;
  if (percentage >= 0.46) return 6;
  if (percentage >= 0.37) return 5;
  if (percentage >= 0.28) return 4;
  if (percentage >= 0.18) return 3;
  return 2;
}

export function estimateWritingScore(wordCount: number, minWords: number, maxWords: number): number {
  if (wordCount < minWords * 0.5) return 4;
  if (wordCount < minWords * 0.75) return 5;
  if (wordCount < minWords) return 6;
  if (wordCount <= maxWords) return 8;
  if (wordCount <= maxWords * 1.25) return 7;
  return 6;
}

export function estimateSpeakingScore(wordCount: number): number {
  if (wordCount < 20) return 4;
  if (wordCount < 40) return 5;
  if (wordCount < 60) return 6;
  if (wordCount < 100) return 7;
  if (wordCount < 150) return 8;
  return 9;
}

export const SECTION_TIME_LIMITS = {
  listening: 47 * 60,
  reading: 55 * 60,
  writing: 53 * 60,
  speaking: 20 * 60,
};
