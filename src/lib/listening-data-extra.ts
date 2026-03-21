import { ListeningPart } from "./celpip-data";

export const listeningPartsExtra: ListeningPart[] = [
  {
    id: "L7",
    title: "02 | 8 Questions | Listening to Problem Solving",
    instruction:
      "You will hear a conversation between two coworkers trying to resolve a workplace issue. Listen carefully and answer the questions.",
    transcript: `Angela: Hey Rob, do you have a minute? I need to talk to you about what happened at the team meeting yesterday.

Rob: Sure, Angela. Is this about the disagreement between you and Kevin over the project timeline?

Angela: Exactly. He completely dismissed my concerns in front of everyone. I said we needed at least three extra weeks to do proper quality assurance testing, and he just rolled his eyes and said we couldn't afford to delay the launch.

Rob: I noticed that. It was uncomfortable for everyone in the room. Have you tried talking to him one-on-one about it?

Angela: I sent him an email this morning, but he hasn't responded. Honestly, this isn't the first time. Last month he overrode my recommendations on the database migration without even consulting me.

Rob: That's frustrating. I think you should bring this up with our manager, Patricia. Not as a complaint, but as a request for clearer decision-making guidelines. If roles and responsibilities are defined better, these clashes won't keep happening.

Angela: That's actually a good idea. I don't want it to seem personal. I just want my expertise to be respected in the process.

Rob: Absolutely. Why don't we set up a meeting with Patricia together? I can back you up since I witnessed both incidents. How about Thursday afternoon?

Angela: That would be great. Let's book it for 2:00 PM if she's available.

Rob: I'll send the invite right now. In the meantime, maybe hold off on replying to any more of Kevin's emails until we've had that chat.

Angela: Good advice. Thanks, Rob.`,
    questions: [
      {
        id: "L7Q1",
        question: "What is Angela upset about?",
        options: [
          "She was passed over for a promotion",
          "Kevin dismissed her concerns in a team meeting",
          "Rob did not support her during the meeting",
          "Patricia assigned her to a different project",
        ],
        correctAnswer: 1,
      },
      {
        id: "L7Q2",
        question: "How much extra time did Angela say was needed for quality assurance?",
        options: [
          "One extra week",
          "Two extra weeks",
          "Three extra weeks",
          "Four extra weeks",
        ],
        correctAnswer: 2,
      },
      {
        id: "L7Q3",
        question: "What previous incident does Angela mention?",
        options: [
          "Kevin took credit for her work",
          "Kevin overrode her recommendations on a database migration",
          "Kevin complained about her to management",
          "Kevin refused to attend a planning session",
        ],
        correctAnswer: 1,
      },
      {
        id: "L7Q4",
        question: "What does Rob suggest Angela do?",
        options: [
          "File a formal complaint with HR",
          "Confront Kevin directly in the next meeting",
          "Talk to their manager Patricia about clearer decision-making guidelines",
          "Transfer to a different team",
        ],
        correctAnswer: 2,
      },
      {
        id: "L7Q5",
        question: "When do Angela and Rob plan to meet with Patricia?",
        options: [
          "Wednesday morning",
          "Thursday at 2:00 PM",
          "Friday afternoon",
          "The following Monday",
        ],
        correctAnswer: 1,
      },
      {
        id: "L7Q6",
        question: "How did Angela first try to reach Kevin after the meeting?",
        options: [
          "She called him on the phone",
          "She spoke to him in person",
          "She sent him an email",
          "She sent him a text message",
        ],
        correctAnswer: 2,
      },
      {
        id: "L7Q7",
        question: "What does Rob advise Angela to do regarding Kevin's emails?",
        options: [
          "Forward them to Patricia",
          "Reply with detailed explanations",
          "Hold off on replying until after meeting with Patricia",
          "Delete them without reading",
        ],
        correctAnswer: 2,
      },
      {
        id: "L7Q8",
        question: "Why does Rob offer to attend the meeting with Patricia?",
        options: [
          "He wants to file his own complaint against Kevin",
          "He witnessed both incidents and can back Angela up",
          "Patricia specifically requested his presence",
          "He is Angela's direct supervisor",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "L8",
    title: "02 | 5 Questions | Listening to a Daily Life Conversation",
    instruction:
      "You will hear a conversation about booking a home repair service. Listen and answer the questions.",
    transcript: `Dispatcher: Good afternoon, Northern Star Plumbing and Heating. How can I help you?

Homeowner: Hi, I've got a pretty serious problem. My basement is flooding. There's water coming in from somewhere near the hot water tank, and it's been getting worse over the past two hours.

Dispatcher: I'm sorry to hear that. Have you been able to locate the main water shutoff valve?

Homeowner: I tried, but I can't find it. The previous owners didn't leave any instructions, and I just moved in three months ago.

Dispatcher: Okay, it's usually near the front of the house, close to where the water line enters the building. Look for a round handle or a lever on a pipe near the foundation wall. In the meantime, I'll get someone out to you.

Homeowner: I found something — is it the red handle near the floor?

Dispatcher: That sounds like it. Turn it clockwise until it stops. That should slow down or stop the water flow.

Homeowner: Okay, I'm turning it now. Yes, the water seems to be slowing down. Thank goodness.

Dispatcher: Great. Now, our earliest available technician is Marcus. He can be there by 4:30 PM today. Our emergency call-out fee is $125, and that covers the first hour of labour. Parts and additional labour are billed separately.

Homeowner: That's fine. My address is 47 Birchwood Crescent in Kanata.

Dispatcher: Got it. Marcus will be there at 4:30. He'll call you about 15 minutes before he arrives.

Homeowner: Perfect. Thank you so much.`,
    questions: [
      {
        id: "L8Q1",
        question: "What is the homeowner's main problem?",
        options: [
          "The furnace has stopped working",
          "There is a gas leak in the kitchen",
          "The basement is flooding near the hot water tank",
          "A pipe burst in the bathroom",
        ],
        correctAnswer: 2,
      },
      {
        id: "L8Q2",
        question: "Why doesn't the homeowner know where the shutoff valve is?",
        options: [
          "The valve was removed during renovations",
          "They just moved in three months ago and the previous owners left no instructions",
          "The valve is hidden behind a wall",
          "A plumber previously told them it was broken",
        ],
        correctAnswer: 1,
      },
      {
        id: "L8Q3",
        question: "How does the homeowner identify the shutoff valve?",
        options: [
          "It has a blue label on it",
          "It is a red handle near the floor",
          "It is behind the hot water tank",
          "It has a digital display",
        ],
        correctAnswer: 1,
      },
      {
        id: "L8Q4",
        question: "How much is the emergency call-out fee?",
        options: ["$75", "$100", "$125", "$150"],
        correctAnswer: 2,
      },
      {
        id: "L8Q5",
        question: "Where does the homeowner live?",
        options: [
          "47 Birchwood Crescent in Kanata",
          "74 Birchwood Drive in Barrhaven",
          "47 Maple Street in Kanata",
          "74 Birchwood Crescent in Orleans",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "L9",
    title: "02 | 6 Questions | Listening for Information",
    instruction:
      "You will hear a university orientation presentation. Listen carefully and answer the questions.",
    transcript: `Good morning, everyone, and welcome to the University of Northern Ontario. I'm Dean Margaret Sullivan, and on behalf of the entire faculty, congratulations on your admission.

Let me walk you through a few key things you need to know for your first semester. First, registration. Online course registration opens this Friday, September 1st, at 8:00 AM through the student portal. First-year students have priority registration until September 5th. After that, upper-year students can also register, and popular courses fill up fast.

Second, academic advising. Every first-year student is assigned an academic advisor. You'll find your advisor's name in your student portal under the Academics tab. I strongly recommend booking your first meeting before classes begin on September 11th. Your advisor can help you choose courses that align with your degree requirements.

Third, campus services. The Northwind Library is open seven days a week, from 7:00 AM to midnight on weekdays and 9:00 AM to 10:00 PM on weekends. The Writing Centre on the second floor of McLaughlin Hall offers free tutoring — you can book up to two sessions per week.

Fourth, student wellness. The campus health clinic is located in Birch Hall and is open Monday through Friday. Counselling services are free and confidential. You can book appointments online or walk in during open hours, which are Tuesdays and Thursdays from 1:00 to 4:00 PM.

Finally, get involved. We have over 150 student clubs and organizations. The clubs fair is happening next Wednesday, September 6th, in the Student Centre gymnasium from 10:00 AM to 3:00 PM.

Enjoy your time here. This is the beginning of an incredible journey.`,
    questions: [
      {
        id: "L9Q1",
        question: "When does online course registration open?",
        options: [
          "August 28th",
          "September 1st",
          "September 5th",
          "September 11th",
        ],
        correctAnswer: 1,
      },
      {
        id: "L9Q2",
        question: "Until when do first-year students have priority registration?",
        options: [
          "September 1st",
          "September 3rd",
          "September 5th",
          "September 11th",
        ],
        correctAnswer: 2,
      },
      {
        id: "L9Q3",
        question: "Where is the Writing Centre located?",
        options: [
          "The Northwind Library",
          "Birch Hall",
          "The second floor of McLaughlin Hall",
          "The Student Centre",
        ],
        correctAnswer: 2,
      },
      {
        id: "L9Q4",
        question: "When are walk-in hours for counselling services?",
        options: [
          "Mondays and Wednesdays from 9:00 AM to noon",
          "Tuesdays and Thursdays from 1:00 to 4:00 PM",
          "Every weekday from 10:00 AM to 2:00 PM",
          "Fridays from 1:00 to 5:00 PM",
        ],
        correctAnswer: 1,
      },
      {
        id: "L9Q5",
        question: "When and where is the clubs fair?",
        options: [
          "September 5th in Birch Hall",
          "September 6th in the Student Centre gymnasium",
          "September 11th in the Northwind Library",
          "September 8th in McLaughlin Hall",
        ],
        correctAnswer: 1,
      },
      {
        id: "L9Q6",
        question: "What are the Northwind Library's weekend hours?",
        options: [
          "8:00 AM to 8:00 PM",
          "9:00 AM to 10:00 PM",
          "10:00 AM to 6:00 PM",
          "7:00 AM to midnight",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "L10",
    title: "02 | 5 Questions | Listening to a News Item",
    instruction:
      "You will hear a news report about a technology company. Listen and answer the questions.",
    transcript: `This is Global News Toronto. I'm Priya Sharma with your business update.

Canadian tech sector celebrations are in order today as NovaTech Solutions, a leading artificial intelligence company headquartered in San Francisco, has announced plans to open a major research and development centre in Waterloo, Ontario. The new facility, which will be located in the David Johnston Research and Technology Park, is expected to create 1,200 high-paying jobs over the next three years.

NovaTech CEO Richard Alvarez made the announcement at a press conference this morning alongside Ontario Premier Doug Morrison. Alvarez cited Canada's strong talent pipeline and competitive research tax credits as key reasons for choosing Waterloo.

"The University of Waterloo produces some of the best computer science and engineering graduates in the world," Alvarez said. "Combined with Ontario's Scientific Research and Experimental Development tax credit, this was an easy decision."

The provincial government has committed $45 million in incentives to support the project, including infrastructure upgrades to the research park and a workforce training partnership with Conestoga College and Wilfrid Laurier University.

Construction on the 200,000-square-foot facility is set to begin in the spring, with the first phase expected to be operational by December of next year. Initial hiring will focus on machine learning engineers, data scientists, and software developers. The company says at least 30% of positions will be reserved for new graduates.

The mayor of Waterloo, Cynthia Tran, called the announcement "transformative" for the region, predicting it will attract additional tech investment and boost the local housing market.`,
    questions: [
      {
        id: "L10Q1",
        question: "Where is NovaTech Solutions headquartered?",
        options: [
          "Toronto",
          "San Francisco",
          "Waterloo",
          "Vancouver",
        ],
        correctAnswer: 1,
      },
      {
        id: "L10Q2",
        question: "How many jobs is the new facility expected to create?",
        options: ["800", "1,000", "1,200", "1,500"],
        correctAnswer: 2,
      },
      {
        id: "L10Q3",
        question: "What reasons did the CEO give for choosing Waterloo?",
        options: [
          "Low cost of living and proximity to the US border",
          "Strong talent pipeline and competitive research tax credits",
          "Existing partnerships with Canadian banks",
          "Access to natural resources and shipping routes",
        ],
        correctAnswer: 1,
      },
      {
        id: "L10Q4",
        question: "How much has the provincial government committed in incentives?",
        options: ["$25 million", "$35 million", "$45 million", "$60 million"],
        correctAnswer: 2,
      },
      {
        id: "L10Q5",
        question: "What percentage of positions will be reserved for new graduates?",
        options: ["At least 20%", "At least 25%", "At least 30%", "At least 40%"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L11",
    title: "02 | 8 Questions | Listening to a Discussion",
    instruction:
      "You will hear a team meeting about planning an event. Listen and answer the questions.",
    transcript: `Jessica: Alright, team, let's get started. We have exactly six weeks until the company's 25th anniversary gala, and there's a lot to finalize. Raj, can you give us an update on the venue?

Raj: Sure. We've confirmed the booking at the Fairmont Royal York in downtown Toronto. The Grand Ballroom holds up to 400 guests. We've negotiated a package rate of $185 per person, which includes a three-course dinner, open bar for four hours, and audiovisual equipment.

Jessica: Great. How are we looking on the guest list, Megan?

Megan: We've sent out 350 invitations so far. As of this morning, we have 210 confirmed RSVPs, 45 declines, and the rest haven't responded yet. The RSVP deadline is two weeks from today. I'll send a reminder email next Monday.

Jessica: Good. We need a minimum of 250 to make the economics work with the venue. Raj, what about entertainment?

Raj: I've got two options. Option one is a jazz quartet from Montreal — they charge $3,500 for a four-hour set. Option two is a DJ service from Toronto at $2,200 for the full evening, including lighting and sound.

Jessica: What does everyone think?

Megan: I think the jazz quartet fits the formal tone better. It's a milestone anniversary, after all.

Raj: I agree. And the $1,300 difference is worth it for the atmosphere.

Jessica: Alright, let's go with the jazz quartet. Now, Megan, I need you to coordinate with the marketing team on a commemorative video. We want a five-minute highlight reel of the company's history to play during dinner. Can you have a draft ready in three weeks?

Megan: Absolutely. I'll set up a meeting with marketing this week.

Jessica: Perfect. Let's reconvene next Tuesday to check progress.`,
    questions: [
      {
        id: "L11Q1",
        question: "What is the event the team is planning?",
        options: [
          "A product launch party",
          "The company's 25th anniversary gala",
          "A holiday celebration",
          "A charity fundraiser",
        ],
        correctAnswer: 1,
      },
      {
        id: "L11Q2",
        question: "What is the per-person rate at the venue?",
        options: ["$150", "$175", "$185", "$200"],
        correctAnswer: 2,
      },
      {
        id: "L11Q3",
        question: "How many confirmed RSVPs have been received so far?",
        options: ["195", "210", "250", "350"],
        correctAnswer: 1,
      },
      {
        id: "L11Q4",
        question: "Which entertainment option does the team choose?",
        options: [
          "A DJ service from Toronto",
          "A rock band from Ottawa",
          "A jazz quartet from Montreal",
          "A solo pianist from Vancouver",
        ],
        correctAnswer: 2,
      },
      {
        id: "L11Q5",
        question: "What does Jessica ask Megan to coordinate with the marketing team?",
        options: [
          "A social media campaign",
          "A commemorative video highlight reel",
          "A printed anniversary booklet",
          "A guest speaker introduction",
        ],
        correctAnswer: 1,
      },
      {
        id: "L11Q6",
        question: "How many invitations have been sent out so far?",
        options: ["250", "300", "350", "400"],
        correctAnswer: 2,
      },
      {
        id: "L11Q7",
        question: "What is the minimum number of guests needed for the economics to work with the venue?",
        options: ["200", "225", "250", "300"],
        correctAnswer: 2,
      },
      {
        id: "L11Q8",
        question: "How much does the jazz quartet charge for a four-hour set?",
        options: ["$2,200", "$2,800", "$3,500", "$4,000"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L12",
    title: "02 | 6 Questions | Listening for Viewpoints",
    instruction:
      "You will hear a debate about public transit versus cars. Listen and answer the questions.",
    transcript: `Moderator: Welcome to City Forum. Tonight's topic: should the city invest more in public transit or road infrastructure for cars? We have two panellists. First, Carla Mendes, a transit advocate and urban planner. Second, Greg Harrison, a suburban councillor and commuter.

Carla: Thank you. The evidence is overwhelming. Cities that invest in public transit see reduced traffic congestion, lower carbon emissions, and more equitable access to jobs and services. Our city's bus ridership has grown 15% in the last two years, even with outdated routes. Imagine what we could do with a modern rapid transit network. The proposed LRT expansion would serve 80,000 daily riders and take 25,000 cars off the road.

Greg: I appreciate Carla's enthusiasm, but let's be realistic. Seventy-two percent of commuters in our region drive to work. That's not going to change overnight. The roads in the eastern suburbs are crumbling. Potholes are causing accidents and damaging vehicles. Before we spend $2.4 billion on an LRT, we should fix what we already have. The road repair backlog alone is estimated at $600 million.

Carla: I understand the need for road maintenance, but widening roads has never solved congestion — it actually induces more traffic. Every dollar we invest in transit returns $4 in economic benefit. That's from a federal infrastructure study published last year.

Greg: That study was based on dense urban cores, not suburban communities where people live 20 kilometres from the nearest bus stop. We need both, but right now the priority should be safety. Last winter, 340 accidents in our district were directly linked to poor road conditions.

Carla: And I'd argue that giving people a reliable transit alternative would reduce the number of cars on those roads in the first place, making them safer for everyone.

Moderator: Thank you both. Clearly, this debate is far from settled.`,
    questions: [
      {
        id: "L12Q1",
        question: "By how much has bus ridership grown in the last two years?",
        options: ["10%", "12%", "15%", "20%"],
        correctAnswer: 2,
      },
      {
        id: "L12Q2",
        question: "How many daily riders would the proposed LRT expansion serve?",
        options: ["50,000", "65,000", "80,000", "100,000"],
        correctAnswer: 2,
      },
      {
        id: "L12Q3",
        question: "What percentage of commuters drive to work according to Greg?",
        options: ["62%", "68%", "72%", "78%"],
        correctAnswer: 2,
      },
      {
        id: "L12Q4",
        question: "How much is the estimated road repair backlog?",
        options: [
          "$400 million",
          "$600 million",
          "$800 million",
          "$1.2 billion",
        ],
        correctAnswer: 1,
      },
      {
        id: "L12Q5",
        question: "According to Carla, how much economic return does every dollar invested in transit generate?",
        options: ["$2", "$3", "$4", "$5"],
        correctAnswer: 2,
      },
      {
        id: "L12Q6",
        question: "How many accidents in Greg's district were linked to poor road conditions last winter?",
        options: ["240", "290", "340", "410"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L13",
    title: "03 | 8 Questions | Listening to Problem Solving",
    instruction:
      "You will hear a couple planning a vacation. Listen carefully and answer the questions.",
    transcript: `Nina: Okay, so we finally have two weeks off in July. I've been looking at options, and I'm really torn between two ideas. What do you think about going to the East Coast — like Nova Scotia and Prince Edward Island?

Derek: That could be fun. I've always wanted to see Peggy's Cove and try fresh lobster. What's the other option?

Nina: A road trip through the Canadian Rockies — Banff, Jasper, and Lake Louise. We could rent a camper van and do some hiking.

Derek: Both sound amazing, honestly. What's the budget looking like?

Nina: Well, the East Coast trip would be cheaper. I found round-trip flights from Toronto to Halifax for $380 each. Hotels would run about $150 a night. For two weeks, including food and activities, I estimate around $4,500 total for both of us.

Derek: And the Rockies?

Nina: More expensive. The camper van rental alone is $175 a day, so that's $2,450 for 14 days. Plus gas, campground fees, park passes, and food — I'd estimate $6,200 total.

Derek: That's a $1,700 difference. But think about it — no flights, no hotel check-ins. Just open road and mountains. And we've been saying for years we want to do more outdoor adventures.

Nina: True. And the camper van has a kitchen, so we'd save on restaurant meals. What if we cut it down to 10 days instead of 14? That would bring the van rental to $1,750 and the total closer to $4,800.

Derek: I like that compromise. Ten days in the Rockies and then four days at home to relax before going back to work. Let's do it.

Nina: Perfect. I'll book the camper van tonight before the July spots fill up.`,
    questions: [
      {
        id: "L13Q1",
        question: "What are the two vacation options Nina is considering?",
        options: [
          "East Coast of Canada or a Caribbean cruise",
          "Nova Scotia and PEI or the Canadian Rockies",
          "A trip to Europe or a camping trip in Ontario",
          "Vancouver Island or the Maritime provinces",
        ],
        correctAnswer: 1,
      },
      {
        id: "L13Q2",
        question: "How much are the round-trip flights to Halifax per person?",
        options: ["$280", "$340", "$380", "$420"],
        correctAnswer: 2,
      },
      {
        id: "L13Q3",
        question: "What is the daily cost of the camper van rental?",
        options: ["$125", "$150", "$175", "$200"],
        correctAnswer: 2,
      },
      {
        id: "L13Q4",
        question: "What compromise do Nina and Derek agree on?",
        options: [
          "Going to the East Coast for 10 days instead",
          "Doing the Rockies trip for 10 days instead of 14",
          "Splitting the trip between both destinations",
          "Postponing the trip until August",
        ],
        correctAnswer: 1,
      },
      {
        id: "L13Q5",
        question: "What does Nina plan to do that evening?",
        options: [
          "Book the flights to Halifax",
          "Research hotels in Banff",
          "Book the camper van",
          "Compare campground fees online",
        ],
        correctAnswer: 2,
      },
      {
        id: "L13Q6",
        question: "What is the estimated total cost of the East Coast trip for both of them?",
        options: ["$3,800", "$4,200", "$4,500", "$5,000"],
        correctAnswer: 2,
      },
      {
        id: "L13Q7",
        question: "What is the price difference between the original Rockies trip and the East Coast trip?",
        options: ["$1,200", "$1,500", "$1,700", "$2,000"],
        correctAnswer: 2,
      },
      {
        id: "L13Q8",
        question: "How does Derek plan to spend the remaining four days of their two-week vacation?",
        options: [
          "Visiting family in Toronto",
          "Exploring Nova Scotia",
          "Relaxing at home before going back to work",
          "Doing day trips near their city",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "L14",
    title: "03 | 5 Questions | Listening to a News Item",
    instruction:
      "You will hear a news report about healthcare policy changes. Listen and answer the questions.",
    transcript: `This is CTV News. I'm Michael Park with a special report on healthcare.

The federal government today announced a landmark $6.8 billion investment in Canada's healthcare system, focused on three key areas: reducing surgical wait times, expanding access to mental health services, and improving rural healthcare delivery.

Health Minister Diane Tremblay unveiled the plan at a press conference in Ottawa. Under the new program, called the Canadian Health Acceleration Plan, provinces will receive targeted funding over the next five years, tied to measurable performance benchmarks.

The largest portion — $3.2 billion — will go toward surgical backlogs. Canada currently has an estimated 900,000 patients waiting for surgeries, with average wait times reaching 27 weeks in some provinces. The funding will support the hiring of 5,000 additional nurses and 800 surgeons across the country.

Mental health services will receive $2.1 billion. The plan includes the creation of 200 new community mental health clinics, with a focus on underserved areas in Northern Ontario, rural Saskatchewan, and Atlantic Canada. The government is also committing to a national mental health crisis hotline, operational by next March.

The remaining $1.5 billion targets rural healthcare. This includes incentives for doctors and nurse practitioners to work in remote communities, mobile health units for Indigenous communities, and telemedicine infrastructure upgrades.

The Canadian Medical Association has cautiously welcomed the plan, with president Dr. Alisha Kapoor calling it "a significant step, but one that must be followed by sustained commitment, not just a one-time injection of funds."

Provincial premiers are expected to respond at next week's Council of the Federation meeting in Halifax.`,
    questions: [
      {
        id: "L14Q1",
        question: "What is the total investment announced by the federal government?",
        options: [
          "$4.5 billion",
          "$5.6 billion",
          "$6.8 billion",
          "$8.2 billion",
        ],
        correctAnswer: 2,
      },
      {
        id: "L14Q2",
        question: "How much funding is allocated to reducing surgical backlogs?",
        options: [
          "$2.1 billion",
          "$2.8 billion",
          "$3.2 billion",
          "$3.5 billion",
        ],
        correctAnswer: 2,
      },
      {
        id: "L14Q3",
        question: "How many patients are currently estimated to be waiting for surgeries in Canada?",
        options: [
          "500,000",
          "700,000",
          "900,000",
          "1.2 million",
        ],
        correctAnswer: 2,
      },
      {
        id: "L14Q4",
        question: "How many new community mental health clinics will be created?",
        options: ["100", "150", "200", "250"],
        correctAnswer: 2,
      },
      {
        id: "L14Q5",
        question: "What did the Canadian Medical Association president call the plan?",
        options: [
          "Insufficient and disappointing",
          "A significant step that must be followed by sustained commitment",
          "The most important healthcare reform in decades",
          "A good start but far too limited in scope",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "L15",
    title: "03 | 8 Questions | Listening to a Discussion",
    instruction:
      "You will hear a panel discussion about artificial intelligence in education. Listen and answer the questions.",
    transcript: `Host: Welcome to Education Matters. Today we're discussing AI in education. Our panellists are Professor Yuki Tanaka from the University of British Columbia, high school teacher Sam Okonkwo from Calgary, and edtech entrepreneur Laura Bianchi from Montreal.

Professor Tanaka: Thank you. I believe AI has enormous potential in education, but we must proceed thoughtfully. My research shows that AI tutoring systems can improve student performance by up to 22% in mathematics when used alongside traditional teaching. However, the key phrase is "alongside." AI should augment the teacher, not replace them.

Sam: I agree with Professor Tanaka. In my classroom, I've been using an AI-powered platform called LearnAssist for about eight months. It generates personalized practice problems for each student based on their performance data. My students' average test scores went up by 14 points in the first semester. But I've also noticed that some students become too dependent on the instant feedback and struggle when they have to work through problems independently.

Laura: That's a real concern, Sam, and it's something we think about a lot at my company. We build AI tools for schools, and our philosophy is that the technology should make teachers more effective, not more redundant. Our newest product helps teachers identify at-risk students three weeks earlier than traditional methods by analyzing patterns in homework completion, attendance, and quiz performance.

Host: What about concerns around data privacy?

Professor Tanaka: Critical issue. A study from the University of Toronto found that 68% of educational AI platforms share student data with third parties. We need strict federal regulations, similar to what the EU has done with its AI Act. Student data must be protected by law, not just by company policy.

Sam: As a teacher, I'd also add that equity is a huge concern. Schools in wealthier districts get the best AI tools, while underfunded schools are left behind. If we're not careful, AI will widen the achievement gap rather than close it.

Laura: That's why we offer our platform at a 75% discount to Title I equivalent schools. The private sector has a responsibility here too, not just government.

Host: Fascinating perspectives. Thank you all.`,
    questions: [
      {
        id: "L15Q1",
        question: "According to Professor Tanaka's research, by how much can AI tutoring systems improve student math performance?",
        options: ["Up to 15%", "Up to 18%", "Up to 22%", "Up to 28%"],
        correctAnswer: 2,
      },
      {
        id: "L15Q2",
        question: "How long has Sam been using the AI platform LearnAssist?",
        options: [
          "About four months",
          "About six months",
          "About eight months",
          "About twelve months",
        ],
        correctAnswer: 2,
      },
      {
        id: "L15Q3",
        question: "What does Laura's newest product help teachers do?",
        options: [
          "Grade essays automatically",
          "Create lesson plans using AI",
          "Identify at-risk students three weeks earlier than traditional methods",
          "Translate materials into multiple languages",
        ],
        correctAnswer: 2,
      },
      {
        id: "L15Q4",
        question: "What did the University of Toronto study find about educational AI platforms?",
        options: [
          "42% of them have security vulnerabilities",
          "68% of them share student data with third parties",
          "55% of teachers are dissatisfied with them",
          "73% of students prefer them to textbooks",
        ],
        correctAnswer: 1,
      },
      {
        id: "L15Q5",
        question: "What discount does Laura's company offer to underfunded schools?",
        options: ["50%", "60%", "75%", "90%"],
        correctAnswer: 2,
      },
      {
        id: "L15Q6",
        question: "By how many points did Sam's students' average test scores increase in the first semester?",
        options: ["8 points", "11 points", "14 points", "18 points"],
        correctAnswer: 2,
      },
      {
        id: "L15Q7",
        question: "What concern does Sam raise about AI in education beyond data privacy?",
        options: [
          "Teachers will lose their jobs",
          "Students will cheat more easily",
          "Equity — wealthier schools get better AI tools while underfunded schools are left behind",
          "AI tools are too difficult for teachers to learn",
        ],
        correctAnswer: 2,
      },
      {
        id: "L15Q8",
        question: "What negative effect has Sam noticed with some students using the AI platform?",
        options: [
          "They spend less time on homework",
          "They become too dependent on instant feedback and struggle working independently",
          "They lose interest in the subject",
          "They copy answers from each other",
        ],
        correctAnswer: 1,
      },
    ],
  },
];
