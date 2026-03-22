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
    title: "01 | 8 Questions | Listening to Problem Solving",
    instruction:
      "You will hear a conversation between two people discussing a problem. Listen carefully and answer the questions.",
    transcript: `Sarah: Hey Mike, I just got an email from the landlord. He says our lease is up at the end of next month and he wants to increase the rent by $300. I honestly couldn't believe it when I read it.

Mike: Three hundred dollars? That's a huge jump. We're already paying $1,800 a month. That would bring us up to $2,100, which is way more than we budgeted for when we moved in. Can he even do that legally?

Sarah: I spent about an hour looking it up last night. In our province, there's an annual rent increase guideline of about 2.5% per year, which would only be around $45 on our current rent. But he's claiming he did major renovations to the building, and apparently landlords can apply for an above-guideline increase if they've made significant capital improvements.

Mike: Major renovations? Come on. They fixed the elevator that had been broken for six months — which they were legally obligated to do anyway — and they painted the lobby and the hallway on our floor. That hardly qualifies as a capital improvement. They didn't upgrade the plumbing, the heating system, or anything structural.

Sarah: Exactly what I was thinking. I also checked the Residential Tenancies Act, and it says the landlord has to give us at least 90 days' written notice for any increase, and the notice has to be on the proper government form. The email he sent definitely doesn't meet those requirements. I think we have solid grounds to push back.

Mike: That's reassuring. So what do you think our next step should be?

Sarah: I think we should write back and formally mention the provincial guidelines and the notice requirements. We should keep it professional but firm. If he insists on the $300 increase after that, we can file a complaint with the Landlord and Tenant Board. They have an online portal now, so the process is actually pretty straightforward.

Mike: That's a good plan. But maybe we should also start looking at other options, just in case things don't go our way. My colleague David mentioned there are some new apartment buildings that just opened near the Bloor subway station. He said the one-bedrooms start at $1,750, and they include parking and a gym membership.

Sarah: Really? That's actually less than what we're paying now, and we'd get more amenities. It might be worth checking out even if we resolve things with our landlord. Let's do both — respond to the landlord this week and also visit those apartments this weekend. Can you draft the letter?

Mike: Sure. I'll have a draft ready by tonight so you can review it before we send it. I'll also look up the specific section of the Tenancies Act about above-guideline increases so we can reference it.

Sarah: Perfect. And I'll call the Landlord and Tenant Board's information line tomorrow during my lunch break to make sure we're not missing anything. Better to be thorough about this.`,
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
    title: "01 | 5 Questions | Listening to a Daily Life Conversation",
    instruction:
      "You will hear a conversation in a daily life context. Listen and answer the questions.",
    transcript: `Receptionist: Good morning, Greenfield Medical Clinic. How can I help you?

Patient: Hi, I'd like to book an appointment with Dr. Chen, if possible. I've been having some persistent headaches for the past couple of weeks, and they seem to be getting worse. I usually get them in the afternoon, and over-the-counter painkillers aren't really helping anymore.

Receptionist: I'm sorry to hear that. Dr. Chen is quite booked this week, unfortunately. She's been seeing a lot of patients with seasonal issues, and her schedule is completely full until next week. The earliest I can offer with Dr. Chen is next Tuesday at 2:30 PM. Would that work for you?

Patient: That's almost a week away, and these headaches are really affecting my work. I've had to leave the office early twice this week already. Is there anything sooner, even with a different doctor?

Receptionist: Let me check the system... Actually, we had a cancellation just this morning. I can fit you in this Thursday, October 12th, at 10:15 AM. But it would be with Dr. Patel instead of Dr. Chen. Dr. Patel has been with our clinic for over eight years and is also excellent with neurological concerns. He completed his residency at Toronto General Hospital and regularly handles referrals for headaches and migraines.

Patient: That sounds great, actually. I'll take the Thursday appointment with Dr. Patel. Do I need to bring anything specific?

Receptionist: Yes, please bring your provincial health card and a list of any medications you're currently taking, including dosages and how often you take them. If you've had any recent blood work or imaging done at another clinic, it would be helpful to bring those results as well. Also, since this is your first visit to our clinic, please arrive 15 minutes early to fill out the new patient forms. There's a registration package that covers your medical history, allergies, and emergency contact information.

Patient: Got it. Fifteen minutes early with my health card and medication list. My name is James Morrison. That's M-O-R-R-I-S-O-N.

Receptionist: Thank you, Mr. Morrison. You're all confirmed for Thursday, October 12th at 10:15 AM with Dr. Patel. If anything changes or you need to reschedule, please give us at least 24 hours' notice so we can offer the slot to another patient. Is there anything else I can help you with?

Patient: No, that's everything. Thank you so much for fitting me in.

Receptionist: You're welcome. We'll see you Thursday. Take care.`,
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
    title: "01 | 6 Questions | Listening for Information",
    instruction:
      "You will hear an informational presentation. Listen carefully and answer the questions.",
    transcript: `Welcome to the City of Maplewood's annual community update. I'm Mayor Linda Park, and I'm delighted to be here this evening to share some exciting developments and important changes that are coming to our community in the year ahead.

First, let me talk about transportation, which I know is a priority for many of you. After three years of planning and environmental assessments, our new light rail transit line connecting downtown to the eastern suburbs will officially begin construction in April. The project, which carries a budget of $1.2 billion, is expected to take approximately 18 months to complete and will feature six new stations, including a major transfer hub at Maplewood Centre. The line will run from Union Station East all the way to Riverside Terminal, with trains operating every eight minutes during peak hours. During the construction phase, bus routes 14, 22, and 31 will be temporarily rerouted, and we'll be posting detailed detour maps on the city website by the end of this month. I encourage all commuters to check the transit authority's app for real-time updates.

Second, parks and recreation. We're investing $4.2 million to completely renovate Riverside Park, which hasn't seen a major upgrade since 2008. The plan includes a new splash pad and playground for children, upgraded walking and cycling trails with improved lighting for evening use, and an outdoor amphitheater that will seat up to 500 people for community events and summer concerts. We're also adding 120 new parking spaces along the southern entrance. Work begins in June and should be completed by the following spring.

Third, I'd like to address housing, which remains one of our most pressing challenges. The city council has approved the development of 350 new affordable housing units in the Westgate neighbourhood, in partnership with the Maplewood Housing Corporation. Priority will be given to families with children under 12 and seniors over 65 who have been on the waiting list for more than two years. Applications open on March 1st through the city's online housing portal, and information sessions will be held at the Westgate Community Centre on February 15th and 22nd.

Finally, a note on public safety. We're hiring 40 additional firefighters and paramedics, and we're opening a brand-new fire station on Oak Street in the northern district. This station will house two engine companies and an ambulance unit, and it will reduce emergency response times in that area by approximately 4 minutes — from an average of 11 minutes down to 7.

Thank you for being engaged citizens. Questions and comments can be directed to our new community hotline at 311, which is staffed Monday through Saturday from 8 AM to 8 PM.`,
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
    title: "01 | 5 Questions | Listening to a News Item",
    instruction: "You will hear a news report. Listen and answer the questions.",
    transcript: `This is CBC News at Six. I'm Rachel Nguyen.

A major winter storm is bearing down on southern British Columbia tonight, and Environment Canada has issued severe weather warnings for the Greater Vancouver area, the Fraser Valley, and the Sea-to-Sky corridor. The storm system, which originated in the Gulf of Alaska and has been intensifying as it moves southeast, is expected to bring between 25 and 40 centimetres of snow to lower elevations between tonight and Saturday morning, with even heavier accumulations possible in the North Shore mountains and higher terrain.

The storm is already affecting transportation across the region. TransLink has announced that SkyTrain service on the Expo and Millennium lines may be reduced to 15-minute intervals if conditions worsen overnight, and several bus routes in the hillier parts of Burnaby and North Vancouver have already been suspended. BC Ferries has cancelled all sailings between Tsawwassen and Swartz Bay for tomorrow and says it will reassess conditions on Saturday morning before making a decision about weekend service. Vancouver International Airport is advising all travellers to check their flight status online or through their airline's app before heading to the airport, as significant delays and cancellations are expected throughout the day tomorrow. As of this evening, 47 flights have already been cancelled.

On the ground, the City of Vancouver has activated its emergency response plan. Three additional warming centres have been opened for people experiencing homelessness, bringing the total to seven across the city. The new centres are located at the Vancouver Convention Centre, the Roundhouse Community Centre, and Britannia Secondary School, and they will remain open around the clock until the storm passes.

City officials are urging residents to stock up on essentials, keep their mobile phones charged, and avoid all unnecessary travel until at least Saturday afternoon. BC Hydro has warned that power outages are likely, particularly in the North Shore mountains and parts of the Fraser Valley where heavy wet snow could bring down power lines and tree branches. Crews have been placed on standby across the region.

Environment Canada senior forecaster David Liu told reporters this afternoon that this could be the most significant snowfall event in the Vancouver area since the major storm of December 2017, which dumped 34 centimetres on the city and caused widespread disruptions for nearly a week.`,
    questions: [
      {
        id: "L4Q1",
        question: "The storm originated in ___.",
        options: [
          "the Pacific Northwest",
          "the Gulf of Alaska",
          "the Arctic Circle",
          "northern Alberta",
        ],
        correctAnswer: 1,
      },
      {
        id: "L4Q2",
        question: "The storm is expected to bring ___ of snow.",
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
        question: "BC Ferries has ___ for tomorrow.",
        options: [
          "reduced ferry sizes",
          "increased ticket prices",
          "cancelled all sailings between Tsawwassen and Swartz Bay",
          "added extra sailings",
        ],
        correctAnswer: 2,
      },
      {
        id: "L4Q4",
        question: "The city has opened ___ additional warming centres.",
        options: ["two", "three", "four", "five"],
        correctAnswer: 1,
      },
      {
        id: "L4Q5",
        question: "The last comparable snowfall event in Vancouver was in ___.",
        options: ["2012", "2015", "2017", "2019"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L5",
    title: "01 | 8 Questions | Listening to a Discussion",
    instruction:
      "You will hear a discussion between colleagues. Listen and answer the questions.",
    transcript: `Manager (Karen): Thanks for coming in, everyone. I know we're all busy, so I appreciate you making the time. As you know, our quarterly sales numbers came in last Friday, and I've had a chance to go through them in detail. There's some good news and some areas of concern, so I want to talk through the results and start planning our strategy for next quarter.

Tom: I can start with the overview. Our online sales grew by 12% this quarter compared to the same period last year, which is solid and actually ahead of our target of 10%. We saw particularly strong performance in the home accessories and seasonal décor categories. However, our in-store numbers tell a different story — they dropped by 8%, which is the second consecutive quarter of decline. I think that's partly due to the road construction on Main Street that's been going on since July. Foot traffic at the storefront has been way down, and several of our regular customers have told me they're shopping online instead of coming in because parking has been so difficult.

Lisa: I agree with Tom on the construction issue — it's definitely a factor. But I also think we need to take a hard look at our product mix. Our premium line, which used to account for about 30% of in-store revenue, isn't selling as well as it used to. I've been tracking customer feedback, and a lot of people are saying our premium items are nice but overpriced for what they are. Customers are consistently asking for more mid-range options — quality products in the $40 to $80 range, rather than the $120 to $200 pieces we're currently pushing.

Karen: That's a really valid point, and it aligns with what I've been seeing in the industry reports. The mid-range segment is growing across the retail sector right now. What about the loyalty program? We launched that in September, and I'm curious how it's performing.

Tom: Actually, the loyalty program has been one of our real bright spots this quarter. We've signed up 2,300 members in just two months, which exceeded our initial projection of 1,500. Even more encouraging, repeat purchases from loyalty members are up 18% compared to non-members, and their average order value is about $15 higher.

Lisa: Those numbers are impressive, but I do want to flag an issue with the sign-up process. It's too complicated. Right now, customers have to fill out a form with their name, address, phone number, and email, and then create a password. I've personally watched customers abandon the process at the register because it takes too long, especially when there's a line behind them. If we could simplify it to just an email address — or even a phone number — I think we'd see significantly more sign-ups and fewer abandoned registrations.

Karen: That's excellent feedback, and I think you're right. Let's do this — Tom, can you pull together a proposal for expanding the mid-range product line? I want to see a list of potential suppliers, price points, and a projected timeline for getting new inventory in. Lisa, work with the IT team to simplify the loyalty sign-up process. See if we can get it down to a single step. I want both proposals on my desk by next Friday so we can review them at our Monday meeting.

Tom: Will do. I've actually already been in touch with a couple of suppliers, so I should be able to move quickly on that.

Lisa: Sounds good. I'll set up a meeting with IT first thing tomorrow morning.`,
    questions: [
      {
        id: "L5Q1",
        question: "Online sales grew by ___ this quarter.",
        options: ["8%", "10%", "12%", "18%"],
        correctAnswer: 2,
      },
      {
        id: "L5Q2",
        question: "Tom believes the drop in in-store sales was caused by ___.",
        options: [
          "poor customer service",
          "road construction reducing foot traffic",
          "higher prices",
          "competition from a new store",
        ],
        correctAnswer: 1,
      },
      {
        id: "L5Q3",
        question: "Lisa suggests the company should ___.",
        options: [
          "drop the premium line entirely",
          "add more luxury items",
          "offer more mid-range options",
          "focus only on online products",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q4",
        question: "The loyalty program has signed up ___ members.",
        options: ["1,800", "2,000", "2,300", "3,200"],
        correctAnswer: 2,
      },
      {
        id: "L5Q5",
        question: "Karen asks Lisa to ___.",
        options: [
          "train new staff on the loyalty program",
          "contact customers about the premium line",
          "work with IT to simplify the loyalty sign-up",
          "prepare a marketing campaign",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q6",
        question: "In-store sales dropped by ___ this quarter.",
        options: ["4%", "8%", "12%", "18%"],
        correctAnswer: 1,
      },
      {
        id: "L5Q7",
        question: "Lisa identifies the issue with the loyalty program as ___.",
        options: [
          "it requires a monthly fee",
          "it is only available online",
          "the sign-up process is too complicated",
          "customers are not aware it exists",
        ],
        correctAnswer: 2,
      },
      {
        id: "L5Q8",
        question: "Karen wants the proposals ___.",
        options: [
          "by the end of the day",
          "by next Wednesday",
          "by next Friday",
          "by the end of the month",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L6",
    title: "01 | 6 Questions | Listening for Viewpoints",
    instruction:
      "You will hear a discussion presenting different viewpoints. Listen and answer the questions.",
    transcript: `Host: Welcome to Community Voices. I'm your host, Patricia Wong. Today we're tackling a controversial topic that's been generating a lot of debate at city hall: should our municipality follow the lead of other Canadian cities and implement a ban on single-use plastics? I have two guests with very different perspectives on this issue. First, Dr. Amy Foster, an environmental scientist at the University of British Columbia who specializes in marine pollution research. And second, Mark Sullivan, the president of the Greater Vancouver Restaurant Association, which represents over 3,400 food service businesses in the region.

Dr. Foster: Thank you for having me, Patricia. I think the scientific case for action is overwhelming at this point. Single-use plastics are clogging our waterways, killing marine wildlife, and filling our landfills at an alarming rate. Our research team at UBC conducted a study last year of the Fraser River estuary, and we found microplastic concentrations that were 40% higher than they were just five years ago. Nationally, over 80% of ocean plastic pollution comes from land-based sources — that's everyday items like bags, straws, cups, and takeout containers that end up in storm drains and eventually in our rivers and oceans. Cities like Victoria and Montreal that have already implemented bans are seeing measurable reductions in plastic pollution within the first year. We need to act now, before the problem gets worse.

Mark: I appreciate Dr. Foster's passion and her research, and I want to be clear — nobody in the restaurant industry wants to pollute the environment. But a total ban would be devastating for small businesses, many of which are still recovering from the economic challenges of the past few years. The restaurant industry runs on extremely thin margins, often between 3% and 5%. Switching from plastic to compostable containers and utensils costs three to four times more per unit. For a busy takeout restaurant that goes through a thousand containers a week, that's an additional $15,000 to $20,000 a year in packaging costs alone. We need a gradual, supported transition — not an overnight ban that could push businesses under.

Dr. Foster: I completely understand the cost concern, Mark, and that's exactly why I'm not proposing an overnight ban. What I'm advocating for is a phased approach. Start with the easiest wins — plastic bags and straws — which already have affordable alternatives widely available. Then give businesses 18 to 24 months to transition away from plastic containers and cutlery. The city should also establish a green business subsidy fund to help small businesses offset the initial costs of switching to sustainable packaging. Several cities in Europe have done this very successfully.

Mark: A subsidy program would certainly help, and I'd welcome that conversation. But there are practical questions. Who pays for it — taxpayers? And how long does the subsidy last? What happens when the funding runs out and businesses are stuck with higher ongoing costs? And frankly, there's also the question of consumer choice. Many of our customers actively prefer plastic takeout containers because they're leak-proof, stackable, microwave-safe, and lightweight. The compostable alternatives don't always perform as well — some of them get soggy, they can't handle hot liquids, and they don't seal properly for delivery orders.

Dr. Foster: Those are fair points about product quality, and the industry is improving rapidly. But I'd argue that consumer preferences can and do shift when the right incentives are in place. Look at what happened when grocery stores across the country started charging five or ten cents for plastic bags — usage dropped by 70% in the first year alone. People adapted, they started bringing reusable bags, and now most consumers don't even think about it. The same thing will happen with other single-use plastics. And when you factor in the long-term healthcare costs of microplastic contamination in our food and water supply, plus the environmental cleanup costs, the economic argument for a ban is actually very strong. We're simply shifting costs from the future to the present.

Host: Thank you both for such a thoughtful discussion. It's clear this is a nuanced issue that will require careful planning, collaboration between government and industry, and a realistic timeline for implementation.`,
    questions: [
      {
        id: "L6Q1",
        question: "Dr. Foster's main argument is that ___.",
        options: [
          "plastics are too expensive for businesses",
          "single-use plastics are causing serious environmental harm",
          "the city should invest in recycling instead",
          "restaurants should use glass containers",
        ],
        correctAnswer: 1,
      },
      {
        id: "L6Q2",
        question: "Mark's primary concern about a plastic ban is that ___.",
        options: [
          "it would hurt tourism",
          "it would reduce food quality",
          "it would increase costs for small businesses",
          "it would create more landfill waste",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q3",
        question: "Dr. Foster suggests ___ as a compromise.",
        options: [
          "banning all plastics immediately",
          "only banning plastics in parks",
          "a phased approach starting with bags and straws",
          "letting businesses decide on their own",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q4",
        question: "According to Mark, compostable containers cost ___.",
        options: [
          "twice as much",
          "three to four times more",
          "five times more",
          "ten times more",
        ],
        correctAnswer: 1,
      },
      {
        id: "L6Q5",
        question: "When stores started charging for plastic bags, usage ___.",
        options: [
          "increased",
          "dropped by 50%",
          "dropped by 70%",
          "caused customers to stop shopping",
        ],
        correctAnswer: 2,
      },
      {
        id: "L6Q6",
        question: "According to Dr. Foster, ___ of ocean plastic comes from land-based sources.",
        options: [
          "over 50%",
          "over 60%",
          "over 70%",
          "over 80%",
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
    id: "Reading-Practice",
    title: "Practice Task (unscored)",
    instruction:
      "This is a practice task to help you get familiar with the reading test format. Your answer will not be scored.",
    passage: `NOTICE — GREENFIELD PUBLIC LIBRARY

Holiday Hours: The library will be closed on Monday, February 17 (Family Day). Regular hours resume on Tuesday, February 18.

Book returns can be made at any time using the outdoor drop box located to the left of the main entrance. Late fees will not be charged for items due on February 17.

If you need to renew items, please use our online portal at www.greenfieldlibrary.ca or call 905-555-0142 during regular business hours.`,
    questions: [
      {
        id: "Reading-Practice-Q1",
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

Following our company-wide survey and consultation with department heads, we are pleased to announce our updated remote work policy, effective January 15th. This policy replaces all previous remote work arrangements and applies to all full-time and part-time employees across every department.

Key Changes:

1. Hybrid Model: All employees may work remotely up to 3 days per week. The remaining 2 days must be spent in the office. Each department will designate which days are mandatory in-office days. Employees who wish to work remotely for more than 3 days in a given week must submit a written request to their manager at least one week in advance.

2. Core Hours: Regardless of location, all employees must be available between 10:00 AM and 3:00 PM Eastern Time. Outside these hours, flexible scheduling is permitted with manager approval. Employees working from different time zones must coordinate with their teams to ensure adequate overlap during core hours.

3. Equipment: The company will provide a one-time $500 stipend for home office setup. Receipts must be submitted to Finance by March 1st for reimbursement. The stipend covers items such as monitors, keyboards, ergonomic chairs, and internet upgrades, but does not include general furniture or personal electronics.

4. Performance Reviews: Remote work eligibility will be reviewed quarterly. Employees who do not meet performance targets may be required to return to full-time in-office work. Managers will use the standard performance evaluation framework, and employees will receive written feedback at least two weeks before any change to their remote work status.

5. Team Meetings: All-hands meetings will be held in person on the first Monday of each month. Attendance is mandatory unless you have prior written approval from your direct supervisor. Department-level meetings may be held virtually at the discretion of each department head.

Please review the full policy document on the company intranet. If you have questions, contact your HR representative or email hr@techsolutions.ca.

Best regards,
Jennifer Walsh
Director of Human Resources`;

    const passageB = `From: David Park <d.park@techsolutions.ca>
To: HR Department <hr@techsolutions.ca>
Subject: RE: Updated Remote Work Policy — Effective January 15

Dear Jennifer,

Thank you for sharing the updated remote work policy. I appreciate the effort that went into gathering employee feedback and consulting with department heads. Overall, I think the new framework is a positive step forward for the company. However, I have a few questions and concerns that I would like to raise on behalf of the Marketing Department.

First, regarding the mandatory in-office days, our team frequently collaborates with external clients who are based in the Pacific Time Zone. Having our in-office days fixed by the department could ___ [7] with key client meetings. Would it be possible for individual teams within a department to negotiate their in-office schedules based on client-facing obligations?

Second, I wanted to ask about the home office stipend. Several members of my team already invested in home office equipment during the previous remote work arrangement in 2022. Some spent well over $500 on ergonomic setups and high-speed internet upgrades at that time. Will employees who purchased equipment at their own expense before this policy be eligible for any ___ [8], or does the $500 stipend apply only to new purchases made after January 15th?

Third, I am concerned about the quarterly performance review process for remote work eligibility. Our department's major campaigns typically launch in Q1 and Q3, which means our workload and measurable output vary significantly throughout the year. During off-peak quarters, our metrics naturally dip even though we are preparing for the next campaign cycle. Could you clarify whether ___ [9] will be taken into account when evaluating remote work eligibility? Without that context, some of our strongest performers could unfairly lose their remote work privileges.

Finally, regarding the monthly all-hands meetings, the first Monday of the month often coincides with our campaign launch preparation days. Would it be feasible to provide at least ___ [10] of the meeting agenda so that teams can plan accordingly? Additionally, for employees who travel for business, will ___ [11] be accepted as an alternative when travel conflicts arise?

I look forward to your response and any additional guidance on these matters.

Best regards,
David Park
Senior Marketing Manager`;

    return {
      id: "Reading-Part1-01",
      title: "01 | 11 Questions | Reading Correspondence",
      instruction:
        "Read the following email exchange. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: passageA,
      questions: [
        {
          id: "Reading-Part1-01-Q1",
          question: "What is the maximum number of days per week an employee can telecommute under the new arrangement?",
          options: ["1 day", "2 days", "3 days", "5 days"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q2",
          question: "What happens if an employee needs to work from a different time zone?",
          options: [
            "They are exempt from core hours",
            "They must coordinate with their team to overlap during core hours",
            "They must return to the office full-time",
            "They need to switch to the Eastern Time schedule permanently",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q3",
          question: "Which of the following items would NOT be covered by the home office stipend?",
          options: [
            "A computer monitor",
            "An ergonomic keyboard",
            "A personal tablet",
            "An internet upgrade",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q4",
          question: "Before an employee's remote work status is changed due to performance, the company must ___.",
          options: [
            "hold a formal hearing with HR present",
            "give the employee written feedback at least two weeks in advance",
            "offer the employee a transfer to another department",
            "consult with the employee's direct reports",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q5",
          question: "Under what condition can an employee skip a mandatory all-hands meeting?",
          options: [
            "If they are working remotely that day",
            "If their department head approves",
            "If they have prior written approval from their direct supervisor",
            "If they attend virtually instead",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q6",
          question: "Which previous policy does the new remote work framework replace?",
          options: [
            "Only the 2022 temporary arrangement",
            "The core hours policy from last year",
            "All previous remote work arrangements",
            "The department-level scheduling policy",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-01-Q7",
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
          id: "Reading-Part1-01-Q8",
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
          id: "Reading-Part1-01-Q9",
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
          id: "Reading-Part1-01-Q10",
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
          id: "Reading-Part1-01-Q11",
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
    id: "Reading-Part2-01",
    title: "01 | 8 Questions | Reading to Apply a Diagram",
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
        id: "Reading-Part2-01-Q1",
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
        id: "Reading-Part2-01-Q2",
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
        id: "Reading-Part2-01-Q3",
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
        id: "Reading-Part2-01-Q4",
        question: "The cost for the full session would be ___.",
        options: ["$85", "$120", "$150", "$45"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-01-Q5",
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
        id: "Reading-Part2-01-Q6",
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
        id: "Reading-Part2-01-Q7",
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
        id: "Reading-Part2-01-Q8",
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
    id: "Reading-Part3-01",
    title: "01 | 9 Questions | Reading for Information",
    instruction: "Read the following article. For each statement below, identify which paragraph (A, B, C, or D) the information is found in. If the information is not found in any paragraph, choose E.",
    passage: `A. Urban farming — growing food in cities — is no longer a fringe movement. Across Canada, municipalities, non-profits, and everyday citizens are turning empty lots, rooftops, and even parking garages into productive green spaces. The trend has accelerated since 2020, driven by concerns about food security, environmental sustainability, and community well-being.

B. In Montreal, the Lufa Farms network operates the world's largest commercial rooftop greenhouse, spanning over 163,000 square feet across four locations. They deliver fresh vegetables to over 20,000 subscribers weekly, reducing food transportation distances dramatically. Their model proves that urban agriculture can be commercially viable at scale. Vancouver has taken a different approach, focusing on community gardens. The city now has over 100 community garden sites, with a waiting list of more than 3,000 people. In 2023, the city council approved a rezoning bylaw that allows urban farming on any residentially zoned lot, removing a significant regulatory barrier. Toronto's approach combines technology with tradition. Several vertical farming startups have set up operations in former industrial buildings in the city's east end. These facilities use LED lighting and hydroponic systems to grow leafy greens year-round, using 95% less water than conventional farming.

C. Critics argue that urban farming can never replace traditional agriculture at the scale needed to feed growing cities. Dr. Helena Marchetti, an agricultural economist at the University of Guelph, points out that "urban farms excel at growing leafy greens and herbs, but staple crops like wheat, corn, and potatoes still require vast tracts of rural farmland." However, proponents counter that urban farming addresses food deserts — neighbourhoods with limited access to fresh, affordable food. A 2023 report by Food Secure Canada found that 4.4 million Canadians live in food-insecure households. Community gardens and local farms can improve access and reduce reliance on long supply chains that are vulnerable to disruption.

D. The economic potential is also significant. The Canadian Urban Farm Association estimates that the urban agriculture sector in Canada is now worth $2.8 billion annually and supports approximately 14,000 full-time jobs. As cities continue to grow, the integration of food production into urban planning is likely to become not just desirable but necessary.

E. Not in any of the paragraphs`,
    questions: [
      {
        id: "Reading-Part3-01-Q1",
        question: "A commercial farm delivers fresh vegetables to thousands of customers on a weekly basis.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-01-Q2",
        question: "A city government changed its land-use regulations to remove a barrier to urban agriculture.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-01-Q3",
        question: "Indoor growing facilities use significantly less water than conventional farming methods.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-01-Q4",
        question: "An expert questions whether urban farms can produce essential staple crops at a large enough scale.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-01-Q5",
        question: "Millions of Canadians live in households that do not have reliable access to adequate food.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-01-Q6",
        question: "The growth of urban farming has been driven by worries about food security and the environment.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-01-Q7",
        question: "High demand for shared growing spaces in one city has resulted in a long waiting list.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-01-Q8",
        question: "The urban agriculture sector provides a significant number of full-time employment opportunities.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-01-Q9",
        question: "The Canadian government has announced a national strategy to fund urban farming initiatives.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 4,
      },
    ],
  },
  {
    id: "Reading-Part4-01",
    title: "01 | 10 Questions | Reading for Viewpoints",
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
      { id: "Reading-Part4-01-Q1", question: "What did the Iceland trial demonstrate about the four-day work week?", options: ["Productivity declined slightly but was acceptable", "Productivity stayed the same or improved while well-being increased", "Workers were less satisfied with their jobs", "Companies saved money but workers were unhappy"], correctAnswer: 1 },
      { id: "Reading-Part4-01-Q2", question: "What trade-off would a majority of Canadian workers be willing to accept for a four-day schedule?", options: ["Quitting their current job", "Moving to a different city for better hours", "Taking a pay cut of up to 5%", "Working longer hours for higher pay"], correctAnswer: 2 },
      { id: "Reading-Part4-01-Q3", question: "Why does David Chen believe the four-day work week is impractical for his business?", options: ["His employees don't want shorter weeks", "His clients expect deliveries six days a week and he would need 20% more staff", "His company has already tried it and failed", "Government regulations prevent him from changing schedules"], correctAnswer: 1 },
      { id: "Reading-Part4-01-Q4", question: "What does Dr. Okafor believe is the most effective approach to work-time reduction?", options: ["A mandatory four-day week for all industries", "Sector-specific models with legal protections for workers", "Letting each company decide without any government involvement", "Eliminating overtime pay entirely"], correctAnswer: 1 },
      { id: "Reading-Part4-01-Q5", question: "According to Dr. Okafor, what stigma do workers face when requesting reduced hours?", options: ["They lose health benefits", "They are paid less per hour", "They may be seen as less committed, especially women and caregivers", "Their contracts are automatically terminated"], correctAnswer: 2 },
      { id: "Reading-Part4-01-Q6", question: "I doubt the results would ___.", options: ["apply to physically demanding jobs like logistics", "be repeated in any other country", "impress Canadian politicians", "change the way people think about work"], correctAnswer: 0 },
      { id: "Reading-Part4-01-Q7", question: "Switching to four days would ___.", options: ["improve driver morale immediately", "have no effect on our operations", "force us to hire more people and raise costs", "make our clients switch to competitors"], correctAnswer: 2 },
      { id: "Reading-Part4-01-Q8", question: "I've seen companies try compressed schedules before, and the result was ___.", options: ["a huge success for everyone involved", "employee burnout from longer daily shifts", "an increase in company profits", "better customer satisfaction"], correctAnswer: 1 },
      { id: "Reading-Part4-01-Q9", question: "What we really need is ___.", options: ["a law requiring all companies to adopt a four-day week", "flexible arrangements that fit different types of work", "higher wages instead of shorter hours", "more government-funded research on the topic"], correctAnswer: 1 },
      { id: "Reading-Part4-01-Q10", question: "I suspect most of those people are already ___.", options: ["working in physically demanding jobs", "unhappy with their current employers", "earning enough to afford a small pay cut", "planning to quit their jobs"], correctAnswer: 2 },
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
    title: "01 | 1 Task | Writing an Email",
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
    title: "01 | 1 Task | Responding to Survey Questions",
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
    title: "01 | 1 Task | Giving Advice",
    instruction:
      "A friend is asking you for advice. Respond as if you are speaking to them.",
    prompt:
      'Your friend has been offered a job in another city. The job pays 30% more than their current salary, but they would have to leave their family and friends behind. They ask you: "Should I take this job offer?" Give them your advice.',
    prepTime: 30,
    responseTime: 90,
  },
  {
    id: "S2",
    title: "01 | 1 Task | Talking About a Personal Experience",
    instruction: "Describe a personal experience based on the prompt below.",
    prompt:
      "Talk about a time when you had to learn something new quickly. What was the situation? What did you do? How did it turn out?",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S3",
    title: "01 | 1 Task | Describing a Scene",
    instruction:
      "Describe the scene below in as much detail as possible. Imagine you are describing it to someone who cannot see it.",
    prompt:
      "Scene: A busy farmer's market on a Saturday morning. There are colourful stalls selling fruits, vegetables, baked goods, and flowers. A musician is playing guitar near the entrance. Children are running between the stalls while parents browse. An elderly couple is sitting on a bench sharing a pastry.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S4",
    title: "01 | 1 Task | Making Predictions",
    instruction: "Make predictions about the situation described below.",
    prompt:
      "A major technology company has just announced that it will open a large office in a small Canadian town of 15,000 people. The office will employ 2,000 workers. What do you think will happen to the town? Discuss both positive and negative effects.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S5",
    title: "01 | 1 Task | Comparing and Persuading",
    instruction:
      "Compare the two options below and persuade your friend to choose the one you prefer.",
    prompt:
      "Your friend wants to get healthier and is deciding between two options: (A) Joining a gym with a personal trainer, or (B) Starting to bike to work every day instead of driving. Compare these two options and persuade your friend to choose the one you think is better.",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S6",
    title: "01 | 1 Task | Dealing with a Difficult Situation",
    instruction: "Respond to the difficult situation described below.",
    prompt:
      "You are a team leader at work. One of your team members, who is usually very reliable, has been arriving late and missing deadlines for the past two weeks. Other team members are starting to complain. How would you handle this situation? What would you say to the team member?",
    prepTime: 30,
    responseTime: 60,
  },
  {
    id: "S7",
    title: "01 | 1 Task | Expressing Opinions",
    instruction: "Express your opinion on the topic below.",
    prompt:
      "Some people believe that social media has made people more connected, while others think it has made people more isolated. What is your opinion? Give reasons and examples to support your view.",
    prepTime: 30,
    responseTime: 90,
  },
  {
    id: "S8",
    title: "01 | 1 Task | Describing an Unusual Situation",
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
