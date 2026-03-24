import { ListeningPart } from "./celpip-data";

export const listeningPartsExtra: ListeningPart[] = [
  {
    id: "Listening-Part1-02",
    title: "02 | 8 Questions | Listening to Problem Solving",
    instruction:
      "You will hear a conversation between two coworkers trying to resolve a workplace issue. Listen carefully and answer the questions.",
    transcript: `Angela: Hey Rob, do you have a minute? I really need to talk to someone about what happened at the team meeting yesterday, and I trust your judgment on these things.

Rob: Of course, Angela. Grab a seat. Is this about the disagreement between you and Kevin over the project timeline? I could tell things got pretty tense toward the end.

Angela: Exactly. He completely dismissed my concerns in front of the entire team — there were probably twelve people in that room. I presented data showing that we needed at least three extra weeks to do proper quality assurance testing on the payment processing module. I had benchmarks, test case estimates, everything prepared. And Kevin just rolled his eyes, cut me off mid-sentence, and said we couldn't afford any delay to the launch because the marketing team had already committed to the September 15th date with our retail partners.

Rob: I noticed that, and I could see how frustrated you were. Honestly, it was uncomfortable for everyone in the room. I think a couple of people from the design team looked really surprised by how he handled it. Have you tried talking to him one-on-one about it since then?

Angela: I sent him a detailed email this morning explaining my position and asking if we could discuss it over coffee, but he hasn't responded. And honestly, Rob, this isn't the first time something like this has happened. Last month, he completely overrode my recommendations on the database migration strategy without even consulting me or the two other senior developers who had concerns. He just went ahead and approved the vendor's proposal at the budget meeting. When I found out, the contract had already been signed.

Rob: That's really frustrating, especially since database architecture is literally your area of expertise. I think you should bring this up with our manager, Patricia. But I'd frame it carefully — not as a personal complaint about Kevin, but as a request for clearer decision-making guidelines and a more structured approval process. If roles, responsibilities, and sign-off authority are defined better and documented in writing, these kinds of clashes won't keep happening. It protects everyone on the team, not just you.

Angela: That's actually a really good idea. I definitely don't want it to seem like a personal conflict or like I'm just venting. I respect Kevin's skills as a project manager. I just want my technical expertise to be genuinely respected and factored into the process, not dismissed or bypassed when it's inconvenient for the schedule.

Rob: Absolutely, and I think Patricia will understand that. Why don't we set up a meeting with her together? I can attend as well, since I witnessed both the meeting incident and I was aware of the database migration situation. Having a second perspective might make the conversation more productive. How about Thursday afternoon?

Angela: That would be great. Let's try to book it for 2:00 PM if she's available. That gives me a day to organize my thoughts and put together a summary of both incidents with dates and specifics.

Rob: Smart approach. I'll send the calendar invite right now and cc you. In the meantime, I'd suggest holding off on replying to any more of Kevin's emails about the timeline until we've had that conversation with Patricia. You don't want to say anything in writing that could be taken out of context.

Angela: Good advice. I'll focus on my regular tasks and wait until after Thursday. Thanks, Rob — I feel a lot better already just having talked this through.`,
    questions: [
      {
        id: "Listening-Part1-02-Q1",
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
        id: "Listening-Part1-02-Q2",
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
        id: "Listening-Part1-02-Q3",
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
        id: "Listening-Part1-02-Q4",
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
        id: "Listening-Part1-02-Q5",
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
        id: "Listening-Part1-02-Q6",
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
        id: "Listening-Part1-02-Q7",
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
        id: "Listening-Part1-02-Q8",
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
    id: "Listening-Part2-02",
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
        id: "Listening-Part2-02-Q1",
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
        id: "Listening-Part2-02-Q2",
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
        id: "Listening-Part2-02-Q3",
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
        id: "Listening-Part2-02-Q4",
        question: "How much is the emergency call-out fee?",
        options: ["$75", "$100", "$125", "$150"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part2-02-Q5",
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
    id: "Listening-Part3-02",
    title: "02 | 6 Questions | Listening for Information",
    instruction:
      "You will hear a university orientation presentation. Listen carefully and answer the questions.",
    transcript: `Good morning, everyone, and welcome to the University of Northern Ontario. I'm Dean Margaret Sullivan, and on behalf of the entire faculty and administration, I'd like to offer my sincere congratulations on your admission. We reviewed over 14,000 applications this year, and each of you earned your place here through hard work and dedication.

Let me walk you through several key things you'll need to know as you prepare for your first semester. I'll try to cover the essentials, but please don't worry about writing everything down — this entire presentation, along with all the links and resources I'll mention, will be emailed to you by the end of today.

First, let's talk about registration. Online course registration opens this Friday, September 1st, at 8:00 AM through the student portal. You'll access it at portal.uno.ca using the login credentials that were mailed to you with your acceptance package. First-year students have priority registration from September 1st through September 5th — this is a significant advantage, because once priority registration ends and upper-year students can also register, popular courses fill up extremely fast. I'd particularly recommend registering early if you're interested in any of the introductory science labs or the first-year writing seminars, as those tend to reach capacity within hours.

Second, academic advising. Every incoming first-year student is automatically assigned an academic advisor based on your declared program of study. You'll find your advisor's name and contact information in your student portal under the Academics tab. I strongly recommend booking your first advising meeting before classes begin on September 11th. Your advisor can help you choose courses that align with your degree requirements, plan your four-year course map, and make sure you're not missing any prerequisites.

Third, campus services. The Northwind Library is open seven days a week — 7:00 AM to midnight on weekdays and 9:00 AM to 10:00 PM on weekends. It houses over 1.2 million volumes and has 400 individual study carrels and 35 group study rooms that can be booked online. The Writing Centre, located on the second floor of McLaughlin Hall, offers free one-on-one tutoring with graduate student mentors who can help you with essays, lab reports, and research papers. You can book up to two sessions per week, and I highly recommend taking advantage of this service early and often — students who use the Writing Centre regularly see an average grade improvement of half a letter grade.

Fourth, student wellness. Mental and physical health are priorities for us. The campus health clinic is located in Birch Hall, Room 105, and is open Monday through Friday from 8:30 AM to 5:00 PM. You can see a doctor or nurse practitioner for non-emergency medical needs at no additional cost with your student health plan. Counselling services are also free and completely confidential. You can book appointments online through the wellness portal, or you can walk in during open counselling hours, which are Tuesdays and Thursdays from 1:00 to 4:00 PM.

Finally, I encourage every one of you to get involved in campus life beyond the classroom. We have over 150 student clubs and organizations covering everything from debate and Model United Nations to rock climbing and competitive gaming. The annual clubs fair is happening next Wednesday, September 6th, in the Student Centre gymnasium from 10:00 AM to 3:00 PM. It's a fantastic opportunity to meet upper-year students, find your community, and explore new interests.

Enjoy your time here. This is truly the beginning of an incredible journey, and we're proud to have you as part of the UNO family.`,
    questions: [
      {
        id: "Listening-Part3-02-Q1",
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
        id: "Listening-Part3-02-Q2",
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
        id: "Listening-Part3-02-Q3",
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
        id: "Listening-Part3-02-Q4",
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
        id: "Listening-Part3-02-Q5",
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
        id: "Listening-Part3-02-Q6",
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
    id: "Listening-Part4-02",
    title: "02 | 5 Questions | Listening to a News Item",
    instruction:
      "You will hear a news report about a technology company. Listen and answer the questions.",
    transcript: `This is Global News Toronto. I'm Priya Sharma with your business update.

There's major news for Canada's tech sector today. NovaTech Solutions, a leading artificial intelligence company headquartered in San Francisco with offices in London and Singapore, has announced plans to open a major research and development centre in Waterloo, Ontario. The new facility, which will be located in the David Johnston Research and Technology Park adjacent to the University of Waterloo campus, is expected to create 1,200 high-paying jobs over the next three years, with average salaries estimated at over $95,000 per year.

NovaTech CEO Richard Alvarez made the announcement at a press conference this morning alongside Ontario Premier Doug Morrison and federal Innovation Minister Helena Park. Alvarez cited Canada's strong talent pipeline and competitive research tax credits as the two key reasons for choosing Waterloo over competing bids from Austin, Texas and Dublin, Ireland.

"The University of Waterloo produces some of the best computer science and engineering graduates in the world," Alvarez told reporters. "Our company already employs over 200 Waterloo alumni in our San Francisco headquarters. Combined with Ontario's Scientific Research and Experimental Development tax credit, which is one of the most generous in the G7, this was an easy decision for our board."

The provincial government has committed $45 million in incentives to support the project, including infrastructure upgrades to the research park, improved transit connections, and a workforce training partnership with Conestoga College and Wilfrid Laurier University designed to ensure local graduates have the skills NovaTech needs.

Construction on the 200,000-square-foot facility is set to begin in the spring, with the first phase expected to be fully operational by December of next year. Initial hiring, which begins in January, will focus on machine learning engineers, data scientists, and senior software developers. The company has committed that at least 30% of all positions will be reserved for recent graduates and co-op students.

The mayor of Waterloo, Cynthia Tran, called the announcement "transformative" for the region, predicting it will attract additional tech investment from other companies and further boost the already competitive local housing market.`,
    questions: [
      {
        id: "Listening-Part4-02-Q1",
        question: "NovaTech Solutions is headquartered in ___.",
        options: [
          "Toronto",
          "San Francisco",
          "Waterloo",
          "Vancouver",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part4-02-Q2",
        question: "The new facility is expected to create ___ jobs.",
        options: ["800", "1,000", "1,200", "1,500"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-02-Q3",
        question: "The CEO chose Waterloo because of ___.",
        options: [
          "low cost of living and proximity to the US border",
          "a strong talent pipeline and competitive research tax credits",
          "existing partnerships with Canadian banks",
          "access to natural resources and shipping routes",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part4-02-Q4",
        question: "The provincial government has committed ___ in incentives.",
        options: ["$25 million", "$35 million", "$45 million", "$60 million"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-02-Q5",
        question: "___ of positions will be reserved for new graduates.",
        options: ["At least 20%", "At least 25%", "At least 30%", "At least 40%"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "Listening-Part5-02",
    title: "02 | 8 Questions | Listening to a Discussion",
    instruction:
      "You will hear a team meeting about planning an event. Listen and answer the questions.",
    transcript: `Jessica: Alright, team, let's get started. I know we're all juggling a lot right now, so I want to make sure we use this time efficiently. We have exactly six weeks until the company's 25th anniversary gala, and there are several major items we still need to finalize. Raj, can you kick us off with an update on the venue situation?

Raj: Sure thing. So, after visiting four different venues over the past two weeks, we've confirmed the booking at the Fairmont Royal York in downtown Toronto. The Grand Ballroom is a beautiful space — it holds up to 400 guests with round table seating, and it has its own private entrance from the lobby, which is nice for a high-profile event. We've negotiated a package rate of $185 per person, which includes a three-course dinner with two entrée options, an open bar for four hours featuring domestic and imported selections, and full audiovisual equipment including a projector, screen, wireless microphones, and a dedicated AV technician for the evening. I'm pretty happy with the rate — the standard price was $220, so we saved quite a bit.

Jessica: That's excellent work, Raj. A $35 per person saving really adds up. Okay, how are we looking on the guest list, Megan?

Megan: So, we've sent out 350 invitations in total — that includes current employees, board members, retired executives, and about 40 key clients and partners. As of this morning, we have 210 confirmed RSVPs, 45 formal declines, and the remaining 95 people haven't responded yet. The RSVP deadline is two weeks from today. I'm planning to send a follow-up reminder email next Monday, and for anyone who still hasn't responded by the following Wednesday, I'll make personal phone calls.

Jessica: Good, that's a solid approach. We need a minimum of 250 confirmed guests to make the economics work with the venue's minimum spend requirement. If we drop below that, we'd still owe the full amount. So let's push hard on those outstanding RSVPs. Raj, what about entertainment?

Raj: I've narrowed it down to two options. Option one is the Laurent Ensemble, a jazz quartet based in Montreal. They specialize in corporate events and have excellent reviews. They charge $3,500 for a four-hour set, and they can learn two or three custom songs if we want them to play something specific to the company. Option two is a professional DJ service from Toronto called SoundWave Events. They charge $2,200 for the full evening, and that includes lighting effects, a sound system, and a fog machine.

Jessica: Interesting. What does everyone think? Which one fits the vibe better?

Megan: Honestly, I think the jazz quartet is the way to go. This is a formal, milestone anniversary for the company — 25 years is a big deal. Live jazz would set a really elegant, sophisticated tone, especially during dinner. A DJ feels more like a holiday party to me.

Raj: I agree completely. And when you think about it, the $1,300 difference is absolutely worth it for the quality of the atmosphere and the impression it makes on our clients and partners.

Jessica: Alright, that settles it — let's go with the jazz quartet. Raj, please confirm the booking with them by end of day tomorrow. Now, one more thing. Megan, I need you to coordinate with the marketing team on a commemorative video. We want a five-minute highlight reel of the company's history — key milestones, founding story, major product launches — to play during the dinner service. Can you have a rough draft ready for review in three weeks?

Megan: Absolutely. I've actually already spoken with two people on the marketing team who are excited about it. I'll set up a formal kickoff meeting with them this week to go over the timeline and content outline.

Jessica: Perfect. This is all coming together nicely. Let's reconvene next Tuesday at the same time to check progress on all fronts.`,
    questions: [
      {
        id: "Listening-Part5-02-Q1",
        question: "The team is planning ___.",
        options: [
          "a product launch party",
          "the company's 25th anniversary gala",
          "a holiday celebration",
          "a charity fundraiser",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part5-02-Q2",
        question: "The per-person rate at the venue is ___.",
        options: ["$150", "$175", "$185", "$200"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-02-Q3",
        question: "So far, ___ confirmed RSVPs have been received.",
        options: ["195", "210", "250", "350"],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part5-02-Q4",
        question: "The team chooses ___ for entertainment.",
        options: [
          "a DJ service from Toronto",
          "a rock band from Ottawa",
          "a jazz quartet from Montreal",
          "a solo pianist from Vancouver",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-02-Q5",
        question: "Jessica asks Megan to coordinate ___ with the marketing team.",
        options: [
          "a social media campaign",
          "a commemorative video highlight reel",
          "a printed anniversary booklet",
          "a guest speaker introduction",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part5-02-Q6",
        question: "___ invitations have been sent out so far.",
        options: ["250", "300", "350", "400"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-02-Q7",
        question: "A minimum of ___ guests are needed for the economics to work.",
        options: ["200", "225", "250", "300"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-02-Q8",
        question: "The jazz quartet charges ___ for a four-hour set.",
        options: ["$2,200", "$2,800", "$3,500", "$4,000"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "Listening-Part6-02",
    title: "02 | 6 Questions | Listening for Viewpoints",
    instruction:
      "You will hear a debate about public transit versus cars. Listen and answer the questions.",
    transcript: `Moderator: Welcome to City Forum. I'm David Chen, and tonight we're tackling one of the most hotly debated infrastructure questions facing our region: should the city prioritize investment in public transit or road infrastructure for cars? This question is especially timely, as city council will be voting on the proposed $2.4 billion light rail transit expansion next month. We have two panellists with strong but very different views. First, Carla Mendes, a transit advocate and certified urban planner who has consulted for three Canadian municipalities. And second, Greg Harrison, a councillor representing Ward 7 in the eastern suburbs and a daily car commuter.

Carla: Thank you, David. I'm glad we're having this conversation, because the evidence supporting transit investment is truly overwhelming at this point. Research from cities around the world consistently shows that communities that invest in public transit see reduced traffic congestion, lower carbon emissions, improved air quality, and — importantly — more equitable access to jobs, healthcare, and educational opportunities for people who can't afford to own a car. Right here in our own city, bus ridership has grown by 15% in just the last two years, and that's with an outdated route network that hasn't been redesigned since the 1990s. Imagine what we could achieve with a modern rapid transit system. The proposed LRT expansion would serve an estimated 80,000 daily riders within its first three years of operation and would take approximately 25,000 cars off the road during peak hours.

Greg: I appreciate Carla's enthusiasm and her expertise, but I think we need to be realistic about the situation on the ground. Seventy-two percent of commuters in our region drive to work every day. That's nearly three quarters of the workforce. That reality isn't going to change overnight, no matter how good the transit system is. Meanwhile, the roads in the eastern suburbs are literally crumbling. I drive through my ward every day, and the potholes aren't just an inconvenience — they're a genuine safety hazard that's causing accidents and costing residents hundreds of dollars in vehicle repairs. Before we commit $2.4 billion of taxpayer money to an LRT that primarily benefits the downtown core, we should invest in fixing the infrastructure we already have. The road repair backlog alone across the region is estimated at $600 million, and it grows every year we delay.

Carla: Greg raises a fair point about road maintenance, and I'm not suggesting we completely ignore roads. But I want to challenge the idea that building and widening roads solves congestion, because decades of transportation research tells us it doesn't — it actually induces more traffic. It's called induced demand. People see a wider road, they decide to drive instead of taking transit, and within a few years you're right back to gridlock. What does work is giving people attractive alternatives. And the economic case is strong: every dollar we invest in public transit returns $4 in economic benefit through job creation, increased property values, and reduced healthcare costs from cleaner air. That figure comes from a federal infrastructure study published just last year.

Greg: I've read that study, and it's important to note that it was primarily based on data from dense urban cores like Toronto, Montreal, and Vancouver — not suburban communities like mine, where many residents live 15 to 20 kilometres from the nearest bus stop and there's simply no practical transit route to their workplace. In those areas, cars aren't a luxury; they're a necessity. I agree we need both roads and transit, but the immediate priority has to be safety. Last winter alone, 340 accidents in my district were directly linked to poor road conditions — cracked asphalt, missing signage, and inadequate snow clearing. That's 340 families affected.

Carla: And I would argue that one of the best ways to make those suburban roads safer is to give people a reliable, fast transit alternative so that fewer cars are on those roads in the first place. If even 15% of current drivers switched to the proposed LRT for their daily commute, that's a meaningful reduction in wear and tear on suburban roads and a significant improvement in safety for everyone who still needs to drive.

Moderator: Thank you both for such a substantive discussion. It's clear that this is a complex issue with legitimate arguments on both sides. City council will have a lot to consider when they vote next month.`,
    questions: [
      {
        id: "Listening-Part6-02-Q1",
        question: "Bus ridership has grown by ___ in the last two years.",
        options: ["10%", "12%", "15%", "20%"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part6-02-Q2",
        question: "The proposed LRT expansion would serve ___ daily riders.",
        options: ["50,000", "65,000", "80,000", "100,000"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part6-02-Q3",
        question: "According to Greg, ___ of commuters drive to work.",
        options: ["62%", "68%", "72%", "78%"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part6-02-Q4",
        question: "The estimated road repair backlog is ___.",
        options: [
          "$400 million",
          "$600 million",
          "$800 million",
          "$1.2 billion",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part6-02-Q5",
        question: "According to Carla, every dollar invested in transit generates ___ in economic return.",
        options: ["$2", "$3", "$4", "$5"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part6-02-Q6",
        question: "In Greg's district, ___ accidents were linked to poor road conditions last winter.",
        options: ["240", "290", "340", "410"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "Listening-Part1-03",
    title: "03 | 8 Questions | Listening to Problem Solving",
    instruction:
      "You will hear a couple planning a vacation. Listen carefully and answer the questions.",
    transcript: `Nina: Okay, so we finally have two weeks off in July — July 8th through the 21st — and I've been spending the last few evenings researching vacation options. I'm really torn between two ideas, and I'd love to talk them through with you. What would you think about going to the East Coast — specifically Nova Scotia and Prince Edward Island?

Derek: That could be really fun, actually. I've always wanted to see Peggy's Cove and try fresh lobster right on the wharf. My coworker went last summer and said the seafood alone was worth the trip. He also mentioned the Cabot Trail in Cape Breton, which is supposed to be one of the most scenic drives in the country. What's the other option you're thinking about?

Nina: A road trip through the Canadian Rockies — Banff, Jasper, and Lake Louise. We could rent a camper van from a company in Calgary and spend two weeks driving through the mountains, hiking, and camping. I've been looking at photos online, and the scenery is absolutely unreal — turquoise lakes, glacier-fed waterfalls, wildlife everywhere.

Derek: Honestly, both options sound amazing to me. I could go either way. What's the budget looking like for each one? Because that might be the deciding factor.

Nina: Well, the East Coast trip would definitely be the cheaper option. I found round-trip flights from Toronto to Halifax for $380 each through WestJet, and I checked availability at several bed and breakfasts along our planned route. Hotels and B&Bs would average about $150 a night, some more, some less. For the full two weeks, including food, whale-watching tours, ferry tickets to PEI, and other activities, I estimate around $4,500 total for both of us. That's a pretty reasonable budget.

Derek: Not bad at all. And the Rockies trip?

Nina: Significantly more expensive, I'm not going to lie. The camper van rental alone from Rocky Mountain Campers is $175 a day, and that's for a mid-size van with a double bed, a small kitchen, and a propane heater. For 14 days, the rental comes to $2,450. Then you add gas — and gas prices in Alberta and BC aren't cheap — plus campground reservation fees, which average about $35 a night at the national parks, Parks Canada discovery passes at $140 per person, and food and supplies. All in, I'd estimate roughly $6,200 total for the two of us.

Derek: So that's about a $1,700 difference. That's not trivial. But think about it this way — with the camper van, there are no flights to catch, no hotel check-in times to worry about, no packing and unpacking at different places every night. It's just open road and mountains and total freedom to go wherever we want, whenever we want. And we've been saying for literally years that we want to do more outdoor adventure travel instead of just sitting on a beach somewhere.

Nina: You make a really compelling case. And the camper van has a fully equipped kitchen, so we'd save quite a bit on restaurant meals — we could cook most of our own dinners and just pack lunches for the trail. What if we shortened the trip a bit to bring the cost down? Say 10 days instead of 14? That would bring the van rental down to $1,750 and the total budget closer to $4,800. That's only $300 more than the East Coast option.

Derek: I really like that compromise. Ten days in the Rockies, and then we'd have four days at home to unpack, do laundry, rest up, and mentally prepare before going back to work on the 22nd. I always hate going straight from vacation to the office with no buffer. Let's do it — I'm sold on the Rockies.

Nina: Perfect. I'm going to book the camper van tonight before the July availability is completely gone. They told me on the phone that July is their busiest month, and the mid-size vans usually sell out by early May.`,
    questions: [
      {
        id: "Listening-Part1-03-Q1",
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
        id: "Listening-Part1-03-Q2",
        question: "How much are the round-trip flights to Halifax per person?",
        options: ["$280", "$340", "$380", "$420"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part1-03-Q3",
        question: "What is the daily cost of the camper van rental?",
        options: ["$125", "$150", "$175", "$200"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part1-03-Q4",
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
        id: "Listening-Part1-03-Q5",
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
        id: "Listening-Part1-03-Q6",
        question: "What is the estimated total cost of the East Coast trip for both of them?",
        options: ["$3,800", "$4,200", "$4,500", "$5,000"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part1-03-Q7",
        question: "What is the price difference between the original Rockies trip and the East Coast trip?",
        options: ["$1,200", "$1,500", "$1,700", "$2,000"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part1-03-Q8",
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
    id: "Listening-Part4-03",
    title: "03 | 5 Questions | Listening to a News Item",
    instruction:
      "You will hear a news report about healthcare policy changes. Listen and answer the questions.",
    transcript: `This is CTV News. I'm Michael Park with a special report on healthcare.

The federal government today announced what it's calling a landmark $6.8 billion investment in Canada's healthcare system, the largest single federal health funding commitment in over a decade. The plan focuses on three key areas that have been at the centre of public concern for years: reducing surgical wait times, expanding access to mental health services, and improving healthcare delivery in rural and remote communities.

Health Minister Diane Tremblay unveiled the details of the plan at a press conference in Ottawa this morning, flanked by the chief public health officer and representatives from several provincial health authorities. Under the new program, officially called the Canadian Health Acceleration Plan or CHAP, provinces and territories will receive targeted funding over the next five years. However, the funding comes with strings attached — it's tied to measurable performance benchmarks, and provinces that fail to meet agreed-upon targets could see their allocations reduced in subsequent years.

The largest portion of the funding — $3.2 billion — will go directly toward addressing surgical backlogs, which have ballooned since the pandemic. Canada currently has an estimated 900,000 patients on waiting lists for surgeries ranging from hip replacements to cardiac procedures, with average wait times reaching 27 weeks in some provinces, well above the medically recommended benchmarks. The funding will support the hiring of 5,000 additional nurses and 800 surgeons across the country, as well as the creation of dedicated surgical centres in eight cities to handle high-volume procedures like cataract surgeries and knee replacements.

Mental health services will receive $2.1 billion, the second-largest allocation. The plan includes the creation of 200 new community mental health clinics, with a particular focus on underserved areas in Northern Ontario, rural Saskatchewan, and Atlantic Canada — regions where residents currently have to travel hours to access a psychiatrist or counsellor. The government is also committing to launching a national mental health crisis hotline, staffed by trained counsellors 24 hours a day, seven days a week, which is expected to be fully operational by next March.

The remaining $1.5 billion targets rural and remote healthcare infrastructure. This includes financial incentives and student loan forgiveness programs for doctors, nurses, and nurse practitioners who commit to working in remote communities for a minimum of three years. It also funds mobile health units for Indigenous communities and significant telemedicine infrastructure upgrades to improve virtual care access in areas with limited broadband connectivity.

The Canadian Medical Association has cautiously welcomed the plan. CMA president Dr. Alisha Kapoor told reporters it represents "a significant step forward, but one that must be followed by sustained, long-term commitment from Ottawa, not just a one-time injection of funds that fades with the next election cycle."

Provincial premiers are expected to formally respond to the plan at next week's Council of the Federation meeting in Halifax.`,
    questions: [
      {
        id: "Listening-Part4-03-Q1",
        question: "The federal government announced a total investment of ___.",
        options: [
          "$4.5 billion",
          "$5.6 billion",
          "$6.8 billion",
          "$8.2 billion",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-03-Q2",
        question: "___ is allocated to reducing surgical backlogs.",
        options: [
          "$2.1 billion",
          "$2.8 billion",
          "$3.2 billion",
          "$3.5 billion",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-03-Q3",
        question: "An estimated ___ patients are currently waiting for surgeries in Canada.",
        options: [
          "500,000",
          "700,000",
          "900,000",
          "1.2 million",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-03-Q4",
        question: "The plan includes the creation of ___ new community mental health clinics.",
        options: ["100", "150", "200", "250"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part4-03-Q5",
        question: "The CMA president called the plan ___.",
        options: [
          "insufficient and disappointing",
          "a significant step that must be followed by sustained commitment",
          "the most important healthcare reform in decades",
          "a good start but far too limited in scope",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "Listening-Part5-03",
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
        id: "Listening-Part5-03-Q1",
        question: "AI tutoring systems can improve student math performance by ___.",
        options: ["up to 15%", "up to 18%", "up to 22%", "up to 28%"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q2",
        question: "Sam has been using the AI platform LearnAssist for ___.",
        options: [
          "about four months",
          "about six months",
          "about eight months",
          "about twelve months",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q3",
        question: "Laura's newest product helps teachers ___.",
        options: [
          "grade essays automatically",
          "create lesson plans using AI",
          "identify at-risk students three weeks earlier than traditional methods",
          "translate materials into multiple languages",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q4",
        question: "The University of Toronto study found that ___ of educational AI platforms share student data with third parties.",
        options: [
          "42%",
          "68%",
          "55%",
          "73%",
        ],
        correctAnswer: 1,
      },
      {
        id: "Listening-Part5-03-Q5",
        question: "Laura's company offers a ___ discount to underfunded schools.",
        options: ["50%", "60%", "75%", "90%"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q6",
        question: "Sam's students' average test scores increased by ___ in the first semester.",
        options: ["8 points", "11 points", "14 points", "18 points"],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q7",
        question: "Beyond data privacy, Sam raises the concern of ___.",
        options: [
          "teachers losing their jobs",
          "students cheating more easily",
          "equity — wealthier schools get better AI tools while underfunded schools are left behind",
          "AI tools being too difficult for teachers to learn",
        ],
        correctAnswer: 2,
      },
      {
        id: "Listening-Part5-03-Q8",
        question: "Sam has noticed that some students ___.",
        options: [
          "spend less time on homework",
          "become too dependent on instant feedback and struggle working independently",
          "lose interest in the subject",
          "copy answers from each other",
        ],
        correctAnswer: 1,
      },
    ],
  },
];
