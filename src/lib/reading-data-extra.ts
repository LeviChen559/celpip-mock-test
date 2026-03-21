import { ReadingPart } from "./celpip-data";

export const readingPartsExtra: ReadingPart[] = [
  (() => {
    const passageA = `From: Sarah Nguyen, CEO <s.nguyen@prairietech.ca>
To: All Staff
Subject: Announcement — Merger with Northern Digital Solutions

Dear Colleagues,

I am writing to share some exciting news. After several months of discussions, Prairie Tech Inc. and Northern Digital Solutions have agreed to merge, forming a new company called PrairieNorth Technologies. The merger will take effect on April 1st.

What This Means for You:

1. Job Security: All current employees of both companies will retain their positions for a minimum of 18 months following the merger. After that period, any restructuring will be handled with full transparency and generous severance packages where necessary.

2. Office Locations: Our Winnipeg headquarters will remain the primary office. The Northern Digital office in Thunder Bay will continue operating as a regional hub. Employees will not be required to relocate.

3. Benefits: A new combined benefits package will be introduced by June 1st. Until then, your current benefits remain unchanged. The new package is expected to include enhanced dental coverage and an increased annual wellness spending account of $1,200.

4. Reporting Structure: Department heads from both companies will meet during the week of March 15th to finalize the new organizational chart. Your direct manager will share updates with your team by March 25th.

5. Company Culture: We are committed to preserving the best aspects of both organizations. A Culture Integration Committee, made up of volunteers from both companies, will be formed to plan team-building activities and establish shared values.

If you have questions or concerns, please do not hesitate to reach out to your manager or to the merger transition team at merger@prairietech.ca.

Thank you for your continued dedication.

Warm regards,
Sarah Nguyen
CEO, Prairie Tech Inc.`;

    const passageB = `From: James Whitfield, Senior Developer <j.whitfield@northerndigital.ca>
To: Sarah Nguyen, CEO <s.nguyen@prairietech.ca>
Cc: merger@prairietech.ca
Subject: Re: Announcement — Merger with Northern Digital Solutions

Dear Ms. Nguyen,

Thank you for the detailed announcement regarding the merger. I have been with Northern Digital Solutions in the Thunder Bay office for over seven years, and I appreciate the transparency in your message. However, I do have a few questions and concerns that I hope can be addressed.

First, while I understand that the Thunder Bay office will remain open as a regional hub, I am wondering whether the scope of our work here will change. Currently, our team of 14 developers handles all back-end infrastructure for Northern Digital's client projects. Will the Thunder Bay team continue to ___ [7], or will responsibilities be redistributed to the Winnipeg office after the merger?

Second, regarding the new benefits package, several colleagues and I are currently enrolled in Northern Digital's extended health plan, which includes coverage for physiotherapy and mental health counselling up to $3,000 per year. We would like to know whether these specific benefits will be ___ [8] under the new combined package.

Third, I noticed that the Culture Integration Committee will be made up of volunteers. I would like to ___ [9] for this committee. I believe representation from the Thunder Bay office is essential to ensure our team's perspective is included.

Finally, I want to raise a practical concern about communication. Since the merger announcement, there has been a great deal of ___ [10] among staff here. Many of my colleagues feel that most of the planning discussions have been centred in Winnipeg, and they worry that decisions affecting our office may be made without ___ [11] from Thunder Bay employees.

I appreciate your openness to questions and look forward to hearing back from the transition team.

Best regards,
James Whitfield
Senior Developer, Thunder Bay Office
Northern Digital Solutions`;

    return {
      id: "Reading-Part1-02",
      title: "02 | 11 Questions | Reading Correspondence",
      instruction:
        "Read the following email exchange. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: passageA,
      questions: [
        {
          id: "Reading-Part1-02-Q1",
          question: "What will the combined organization be called after the two businesses join together?",
          options: [
            "Prairie Digital Inc.",
            "Northern Prairie Tech",
            "PrairieNorth Technologies",
            "Prairie Tech Solutions",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q2",
          question:
            "How many months of job protection are promised to staff after the corporate change?",
          options: ["6", "12", "18", "24"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q3",
          question: "Which city will serve as the main headquarters for the new entity?",
          options: ["Thunder Bay", "Toronto", "Winnipeg", "Ottawa"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q4",
          question:
            "How much will employees receive yearly for health and wellness expenses under the updated plan?",
          options: ["$800", "$1,000", "$1,200", "$1,500"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q5",
          question: "By what date will employees learn about the updated reporting structure from their managers?",
          options: [
            "By March 15th",
            "By March 25th",
            "By April 1st",
            "By June 1st",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q6",
          question: "On what date does the corporate union officially begin?",
          options: [
            "March 15th",
            "March 25th",
            "April 1st",
            "June 1st",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-02-Q7",
          question: "Will the Thunder Bay team continue to ___?",
          options: [
            "report to the same manager",
            "manage these projects independently",
            "work on front-end development",
            "hire new staff from Winnipeg",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "Reading-Part1-02-Q8",
          question: "We would like to know whether these specific benefits will be ___ under the new combined package.",
          options: [
            "expanded or improved",
            "eliminated entirely",
            "preserved or reduced",
            "transferred to a private plan",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-02-Q9",
          question: "I would like to ___ for this committee.",
          options: [
            "nominate a colleague",
            "put my name forward",
            "submit an application form",
            "request an interview",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "Reading-Part1-02-Q10",
          question: "There has been a great deal of ___ among staff here.",
          options: [
            "excitement",
            "frustration",
            "uncertainty",
            "resistance",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-02-Q11",
          question: "They worry that decisions affecting our office may be made without ___ from Thunder Bay employees.",
          options: [
            "written approval",
            "financial support",
            "sufficient input",
            "formal consent",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "Reading-Part2-02",
    title: "02 | 8 Questions | Reading to Apply a Diagram",
    instruction:
      "Read the following transit information and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `CITY OF EDMONTON — VALLEY LINE LRT RIDER GUIDE

Route Overview:
The Valley Line LRT runs from Mill Woods in the southeast to Lewis Farms in the west, passing through downtown Edmonton. The full route has 27 stops and takes approximately 52 minutes end to end.

Key Stations and Connections:
- Mill Woods (terminal): Bus connections to routes 52, 58, and 70. Park-and-ride lot with 450 spaces available on a first-come, first-served basis.
- Bonnie Doon: Transfer point for the Route 95 express bus to Sherwood Park.
- Churchill (downtown): Transfer to the Capital Line LRT heading north to NAIT or south to Century Park.
- Government Centre: Nearest stop for the Alberta Legislature and the Royal Alberta Museum.
- West Edmonton Mall: Direct access to the mall via an underground pedway from the station platform.
- Lewis Farms (terminal): Bus connections to routes 100, 101, and the Spruce Grove commuter shuttle.

Fares and Passes:
- Single adult ride: $3.50 (valid for 90 minutes of unlimited transfers).
- Day pass: $10.25 (unlimited rides from first tap until 3:30 AM the next day).
- Monthly pass: $100.00 for adults, $75.00 for seniors (65+), and $75.00 for youth (ages 13–17).
- Children 12 and under ride free with a fare-paying adult (maximum 3 children per adult).

Service Hours:
- Monday to Friday: 5:15 AM to 1:00 AM. Trains run every 5 minutes during peak hours (6:30–9:00 AM and 3:30–6:30 PM) and every 10 minutes at other times.
- Saturday: 6:00 AM to 1:00 AM, with trains every 10 minutes.
- Sunday and Holidays: 7:00 AM to 11:00 PM, with trains every 15 minutes.

Accessibility:
All stations are fully accessible, with elevators, tactile guide paths, and priority seating on every train. Service animals are welcome at all times.

---

Hey Marcus,

Great news — the new Valley Line LRT is finally open! I looked into it for our family trip to West Edmonton Mall this Sunday. We can catch the train at Mill Woods and get off right at the mall. The whole trip takes about ___ [1], so it's way faster than driving in traffic.

I checked the fares and since we're bringing the kids (ages 6 and 9), they would ___ [2] as long as one of us pays. I think a day pass would be worth it at ___ [3] each, since we'll probably want to hop on and off if we visit the museum near Government Centre too.

One thing to keep in mind — on Sundays the trains only run every ___ [4], so we should check the schedule and not cut it too close. Also, when we get to the mall station, we don't even need to go outside — there's ___ [5] that takes you right into the building.

Let me know if Sunday works for you!

Tanya`,
    questions: [
      {
        id: "Reading-Part2-02-Q1",
        question: "The whole trip takes about ___.",
        options: [
          "27 minutes",
          "42 minutes",
          "52 minutes",
          "90 minutes",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-02-Q2",
        question: "They would ___ as long as one of us pays.",
        options: [
          "need a youth pass",
          "each pay $3.50",
          "ride free",
          "need their own day pass",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-02-Q3",
        question: "I think a day pass would be worth it at ___ each.",
        options: ["$3.50", "$7.00", "$10.25", "$75.00"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-02-Q4",
        question: "On Sundays the trains only run every ___.",
        options: [
          "5 minutes",
          "10 minutes",
          "15 minutes",
          "20 minutes",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-02-Q5",
        question: "There's ___ that takes you right into the building.",
        options: [
          "a shuttle bus",
          "an underground pedway from the platform",
          "a sky bridge",
          "a street-level entrance",
        ],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-02-Q6",
        question: "Where would Tanya and Marcus need to transfer if they wanted to visit the Royal Alberta Museum?",
        options: [
          "Churchill",
          "Bonnie Doon",
          "Government Centre",
          "Lewis Farms",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-02-Q7",
        question: "Why does Tanya suggest they check the schedule carefully on Sunday?",
        options: [
          "The trains stop running early in the evening",
          "The trains run less frequently on Sundays",
          "Some stations are closed on weekends",
          "The park-and-ride lot fills up quickly",
        ],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-02-Q8",
        question: "Tanya and Marcus are most likely ___.",
        options: [
          "coworkers planning a team outing",
          "tourists visiting Edmonton for the first time",
          "a couple or family members planning a day trip",
          "neighbours who commute together",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "Reading-Part3-02",
    title: "02 | 9 Questions | Reading for Information",
    instruction:
      "Read the following article. For each statement below, identify which paragraph (A, B, C, or D) the information is found in. If the information is not found in any paragraph, choose E.",
    passage: `A. Immigration, Refugees and Citizenship Canada (IRCC) has announced significant changes to the Express Entry system, introducing category-based selection rounds designed to address specific labour market shortages across the country. Under the previous system, candidates were ranked solely by their Comprehensive Ranking System (CRS) score, which considers factors such as age, education, language proficiency, and work experience. While this approach was effective at selecting highly skilled immigrants, critics argued that it did not sufficiently target sectors facing acute shortages.

B. Beginning this year, IRCC will conduct targeted draws for candidates with experience in healthcare, STEM fields (science, technology, engineering, and mathematics), skilled trades, agriculture, and transport. Candidates in these categories may be selected even if their CRS score falls below the general cutoff, provided they meet a minimum threshold of 380 points. Dr. Amara Okafor, a policy analyst at the Conference Board of Canada, explained that the changes reflect a broader shift in immigration strategy. "Canada's aging population means we need workers in very specific fields. A software engineer and a nurse are both valuable, but the nurse addresses a more urgent gap in many communities," she said.

C. The government has also increased the total number of permanent residence invitations for the year to 485,000, up from 465,000 the previous year. Of these, approximately 110,000 will be issued through Express Entry, with at least 40 percent allocated to category-based draws.

D. Provincial Nominee Programs (PNPs) will continue to operate alongside Express Entry. Several provinces, including British Columbia and Ontario, have already aligned their PNP streams with the new federal categories to avoid duplication and improve processing times. Applicants are encouraged to update their Express Entry profiles to accurately reflect their work experience, as the system will now cross-reference occupation codes with the targeted categories during each draw.

E. Not in any of the paragraphs`,
    questions: [
      {
        id: "Reading-Part3-02-Q1",
        question: "Candidates with experience in certain fields may be selected even if their general score is below the usual cutoff.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-02-Q2",
        question: "The previous ranking system was criticized for not targeting sectors with the most urgent worker shortages.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-02-Q3",
        question: "The total number of permanent residence invitations has increased compared to the previous year.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-02-Q4",
        question: "Some provinces have aligned their nominee programs with the new federal categories.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-02-Q5",
        question: "A policy expert explains that nurses address a more urgent gap than software engineers in many communities.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-02-Q6",
        question: "Applicants should update their profiles so the system can match their occupation to the targeted categories.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-02-Q7",
        question: "At least 40 percent of Express Entry invitations will go to category-based draws.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-02-Q8",
        question: "The government plans to create a new immigration stream specifically for international students graduating from Canadian universities.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 4,
      },
      {
        id: "Reading-Part3-02-Q9",
        question: "The CRS score takes into account factors such as age, education, and language proficiency.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
    ],
  },
  (() => {
    const vpA = `SHOULD COMPANIES ALLOW PERMANENT WORK-FROM-HOME ARRANGEMENTS?

Viewpoint A — Marcus Thiessen, Operations Manager, Calgary:

The pandemic proved that remote work is not only possible but often more productive. Our company saw a 12 percent increase in output when employees switched to working from home, and our overhead costs dropped by nearly $200,000 annually because we downsized our office space. Employees report higher satisfaction, spend less time commuting, and have more flexibility to manage family responsibilities. For companies in expensive cities like Toronto or Vancouver, remote work also opens the door to hiring talented people from smaller communities who would never relocate. The idea that people must sit in an office to be effective is outdated. I believe permanent remote work should be the default, with occasional in-person meetings for collaboration when truly needed.`;

    const vpB = `SHOULD COMPANIES ALLOW PERMANENT WORK-FROM-HOME ARRANGEMENTS?

Viewpoint B — Linda Carreiro, Human Resources Director, Halifax:

While remote work has clear benefits, making it permanent comes with serious drawbacks that many people overlook. In my experience, team cohesion suffers significantly when people never see each other face to face. New employees especially struggle to build relationships and learn the company culture through a screen. Mental health is another concern — many remote workers report feelings of isolation and difficulty separating work from personal life, leading to burnout. There is also the issue of fairness: not every role can be done remotely, so allowing some employees to work from home permanently while others must come in creates resentment. A hybrid model — perhaps three days in the office and two at home — offers the best balance. It preserves flexibility while maintaining the human connections that make workplaces thrive.`;

    return {
      id: "Reading-Part4-02",
      title: "02 | 10 Questions | Reading for Viewpoints",
      instruction:
        "Read the following article and response. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: vpA + `

` + vpB + `

---

As a mid-career professional who has worked both remotely and in an office, I think this debate misses some important nuances. Marcus is right that productivity can ___ [6] when employees work from home, but Linda makes a fair point that ___ [7]. In my own experience, the biggest challenge of remote work was ___ [8]. I think the best solution is what Linda suggests — a hybrid model — because it ___ [9]. However, companies need to make sure that remote workers are not ___ [10] compared to those who come into the office every day.`,
      questions: [
        { id: "Reading-Part4-02-Q1", question: "What productivity gain did Marcus's organization experience after staff began working from home?", options: ["8%", "10%", "12%", "15%"], correctAnswer: 2 },
        { id: "Reading-Part4-02-Q2", question: "What challenge does Linda highlight for recently hired staff in a fully remote setting?", options: ["They lack technical skills for remote tools", "They struggle to build relationships and learn company culture", "They are less productive than experienced workers", "They demand higher salaries for remote positions"], correctAnswer: 1 },
        { id: "Reading-Part4-02-Q3", question: "What yearly cost reduction did Marcus's firm achieve by reducing its physical workspace?", options: ["$100,000", "$150,000", "$200,000", "$250,000"], correctAnswer: 2 },
        { id: "Reading-Part4-02-Q4", question: "What type of work arrangement does Linda propose as the ideal compromise?", options: ["Full-time remote work", "Full-time office work", "A hybrid model with three office days and two home days", "Alternating weeks between office and home"], correctAnswer: 2 },
        { id: "Reading-Part4-02-Q5", question: "What equity problem does Linda identify with allowing some staff to always work from home?", options: ["Senior employees get preferential treatment", "Not every role can be done remotely, creating resentment", "Remote workers receive lower pay than office workers", "Managers cannot evaluate remote employees accurately"], correctAnswer: 1 },
        { id: "Reading-Part4-02-Q6", question: "Marcus is right that productivity can ___.", options: ["stay the same or improve with remote work", "only improve with strict monitoring", "decline without proper management", "be difficult to measure at home"], correctAnswer: 0 },
        { id: "Reading-Part4-02-Q7", question: "Linda makes a fair point that ___.", options: ["remote work should be banned entirely", "new employees struggle to build relationships through a screen", "all workers prefer to be in the office", "technology cannot replace face-to-face meetings"], correctAnswer: 1 },
        { id: "Reading-Part4-02-Q8", question: "The biggest challenge of remote work was ___.", options: ["learning new software tools", "dealing with slow internet", "feeling isolated and disconnected from colleagues", "managing household distractions"], correctAnswer: 2 },
        { id: "Reading-Part4-02-Q9", question: "A hybrid model is best because it ___.", options: ["eliminates the need for office space entirely", "preserves flexibility while maintaining human connections", "allows managers to monitor employees more closely", "reduces the company's tax obligations"], correctAnswer: 1 },
        { id: "Reading-Part4-02-Q10", question: "Companies need to make sure that remote workers are not ___.", options: ["paid more than office workers", "given too much flexibility", "overlooked for promotions and opportunities", "allowed to work on weekends"], correctAnswer: 2 },
      ],
    };
  })(),
  (() => {
    const passageA = `From: Maplewood Property Management <info@maplewoodpm.ca>
To: All Residents — 245 Lakeshore Drive, Burlington, ON
Subject: Important Notice — Building Renovation Schedule

Dear Residents,

We are pleased to announce that the long-awaited renovation of 245 Lakeshore Drive will begin on May 5th. This project will significantly improve the building's energy efficiency, appearance, and common areas. We appreciate your patience as we work through this process.

Phase 1 (May 5 – June 30): Lobby and Main Entrance
The lobby will be completely redesigned with new flooring, lighting, and a modern security desk. During this phase, residents will use the side entrance on Maple Avenue. New key fobs will be distributed at the concierge desk between April 20th and May 3rd. Your current fob will be deactivated on May 5th.

Phase 2 (July 1 – August 31): Elevator Modernization
One of the two elevators will be taken out of service at a time. Wait times may increase, and we ask that residents use the stairs for trips of three floors or fewer when possible. Residents with mobility concerns should contact the management office to arrange priority access.

Phase 3 (September 1 – October 15): Balcony Repairs and Window Replacement
Workers will need access to individual units for window installation. You will receive a minimum of 72 hours' notice before your unit is scheduled. Each unit's window work will take approximately one full day. Personal items should be moved at least one metre away from all windows before the scheduled date.

Throughout the renovation, construction hours will be Monday to Friday, 8:00 AM to 5:00 PM. No work will take place on weekends or statutory holidays. A monthly newsletter will provide updates on progress and any schedule changes.

For questions, please contact our project coordinator, David Park, at d.park@maplewoodpm.ca or 905-555-0178.

Thank you for your cooperation,
Maplewood Property Management`;

    const passageB = `From: Anita Sharma, Unit 1204 <anita.sharma@gmail.com>
To: David Park <d.park@maplewoodpm.ca>
Cc: Maplewood Property Management <info@maplewoodpm.ca>
Subject: Re: Important Notice — Building Renovation Schedule

Dear Mr. Park,

Thank you for the detailed renovation notice. I have lived at 245 Lakeshore Drive for nearly nine years and I am glad to see the building finally receiving these upgrades. However, after reading the schedule carefully, I have several questions and concerns that I hope you can address.

Regarding Phase 1, the side entrance on Maple Avenue is quite far from the underground parking garage. Since I work from home three days a week and rely on reliable building access, I am wondering whether the ___ [7] could remain operational during this phase. Also, I was unable to visit the concierge desk during regular hours last week. Could the new key fobs be ___ [8] to residents who cannot pick them up in person?

My biggest concern relates to Phase 2. I live on the 12th floor and I have a ___ [9] that makes it very difficult to use the stairs. I noticed the email mentions priority elevator access for residents with mobility concerns, but it does not explain how this would work in practice. I would appreciate more specific details, as two months with only one working elevator serving a 15-storey building with over 200 units could create serious delays.

As for Phase 3, I have floor-to-ceiling windows and several large bookcases positioned directly against the window walls. Moving these heavy items on my own is not feasible. Will management provide any ___ [10]? Additionally, I have two cats, and I am worried about them escaping through open windows or doors during the installation.

Finally, I would like to suggest that management hold ___ [11] for residents before May 5th. Many of my neighbours have similar questions, and the party room on the ground floor would be an ideal venue.

I appreciate your time and look forward to your response.

Sincerely,
Anita Sharma
Unit 1204, 245 Lakeshore Drive`;

    return {
      id: "Reading-Part1-03",
      title: "03 | 11 Questions | Reading Correspondence",
      instruction:
        "Read the following email exchange. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: passageA,
      questions: [
        {
          id: "Reading-Part1-03-Q1",
          question:
            "What is the deadline for tenants to collect their replacement access devices?",
          options: [
            "By April 15th",
            "By May 3rd",
            "By May 5th",
            "By June 30th",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q2",
          question:
            "How will tenants enter the building while the front foyer is being redesigned?",
          options: [
            "The main entrance",
            "The parking garage entrance",
            "The side entrance on Maple Avenue",
            "The rear entrance on Lakeshore Drive",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q3",
          question:
            "How many hours ahead of time will tenants be informed before glass installation begins in their apartment?",
          options: ["24", "48", "72", "168"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q4",
          question:
            "What preparation step must tenants complete before the glass installation crew arrives?",
          options: [
            "Remove all furniture from the room",
            "Move personal items at least one metre from windows",
            "Cover windows with plastic sheeting",
            "Stay out of the unit for the entire day",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q5",
          question: "On what date does the lift upgrade stage of the project start?",
          options: ["May 5th", "June 30th", "July 1st", "September 1st"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q6",
          question: "What is the location of the property undergoing improvements?",
          options: [
            "100 Maple Avenue, Burlington",
            "245 Lakeshore Drive, Burlington",
            "320 King Street, Hamilton",
            "450 Ontario Street, Oakville",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-03-Q7",
          question: "I am wondering whether the ___ could remain operational during this phase.",
          options: [
            "main lobby entrance",
            "garage-level entrance",
            "concierge desk",
            "side entrance on Maple Avenue",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "Reading-Part1-03-Q8",
          question: "Could the new key fobs be ___ to residents who cannot pick them up in person?",
          options: [
            "emailed",
            "delivered by a neighbour",
            "mailed",
            "left at the door",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-03-Q9",
          question: "I have a ___ that makes it very difficult to use the stairs.",
          options: [
            "back injury",
            "heart condition",
            "knee condition",
            "respiratory illness",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-03-Q10",
          question: "Will management provide any ___?",
          options: [
            "financial compensation for the inconvenience",
            "temporary storage units on each floor",
            "assistance with moving furniture",
            "replacement bookcases after the renovation",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-03-Q11",
          question: "I would like to suggest that management hold ___.",
          options: [
            "a video conference for each floor",
            "an in-person information session",
            "a written Q&A on the building website",
            "one-on-one meetings with each resident",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "Reading-Part2-03",
    title: "03 | 8 Questions | Reading to Apply a Diagram",
    instruction:
      "Read the following guide and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `LAKEHEAD UNIVERSITY — COURSE REGISTRATION GUIDE FOR NEW STUDENTS

Welcome to Lakehead University! This guide will help you navigate the course registration process for the upcoming fall semester. Please read carefully and follow each step.

Step 1: Activate Your Student Account
Visit myinfo.lakeheadu.ca and enter the student ID number from your acceptance letter. Create a password and set up two-factor authentication using your mobile phone. Your account must be activated at least 48 hours before your registration window opens.

Step 2: Check Your Registration Window
Registration opens in stages based on your program year. Fourth-year students register first, followed by third-year, second-year, and finally first-year students. First-year students can begin registering on July 15th. Your exact date and time appear under the "Registration" tab in your student portal.

Step 3: Plan Your Courses
Use the online Course Timetable tool to search for available courses. Full-time students must register for a minimum of 3 courses (9 credit hours) and a maximum of 5 courses (15 credit hours) per semester. Your academic advisor can help you choose courses that satisfy your degree requirements. Walk-in advising hours are Monday through Thursday, 9:00 AM to 4:00 PM, in Room 214 of the Student Central building.

Step 4: Register Online
Log in to your student portal and select "Add/Drop Courses." Enter the Course Reference Number (CRN) for each course or search by subject and course number. Confirm your selection and verify that there are no time conflicts. The system will not allow you to register for courses with overlapping schedules.

Step 5: Pay Your Tuition Deposit
A non-refundable tuition deposit of $500 is required within 7 days of registration to confirm your enrolment. Payment can be made online via credit card, debit, or bank transfer. The deposit will be applied to your total tuition balance. Students who do not pay the deposit may have their course selections removed.

Important Dates:
- Last day to add courses: September 20th
- Last day to drop courses without academic penalty: November 8th
- Final exams: December 9th to 20th

---

Hey Priya,

I just read through the registration guide for Lakehead and wanted to share what I found. Since we're both first-year students, our registration window opens on ___ [1]. Make sure you activate your student account at least ___ [2] before that so you don't get locked out!

I'm planning to take 4 courses this semester. According to the guide, full-time students need at least ___ [3] to keep their status. I also want to visit an advisor to make sure I'm picking the right ones — walk-in hours are in ___ [4].

One important thing — after we register, we need to pay a ___ [5] within 7 days or they might remove our courses. I'm going to pay mine by bank transfer right away.

Let me know if you want to go to the advising office together!

Nadia`,
    questions: [
      {
        id: "Reading-Part2-03-Q1",
        question: "Our registration window opens on ___.",
        options: ["June 1st", "June 15th", "July 1st", "July 15th"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part2-03-Q2",
        question: "Make sure you activate your student account at least ___ before that.",
        options: ["12 hours", "24 hours", "48 hours", "72 hours"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-03-Q3",
        question: "Full-time students need at least ___ to keep their status.",
        options: ["2 courses", "3 courses", "4 courses", "5 courses"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-03-Q4",
        question: "Walk-in hours are in ___.",
        options: [
          "Room 100 of the Library",
          "Room 214 of the Student Central building",
          "the Registrar's Office",
          "Room 310 of the Arts building",
        ],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-03-Q5",
        question: "We need to pay a ___ within 7 days.",
        options: ["$250 deposit", "$350 deposit", "$500 deposit", "$750 deposit"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-03-Q6",
        question:
          "By what date must students withdraw from a class to avoid a negative mark on their transcript?",
        options: [
          "September 20th",
          "October 15th",
          "November 8th",
          "December 9th",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-03-Q7",
        question:
          "What is the maximum number of courses a full-time student can take per semester?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-03-Q8",
        question:
          "Nadia and Priya are most likely ___.",
        options: [
          "professors planning next semester's courses",
          "incoming first-year students at Lakehead University",
          "academic advisors helping new students",
          "fourth-year students mentoring freshmen",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "Reading-Part3-03",
    title: "03 | 9 Questions | Reading for Information",
    instruction:
      "Read the following article. For each statement below, identify which paragraph (A, B, C, or D) the information is found in. If the information is not found in any paragraph, choose E.",
    passage: `A. A comprehensive study led by researchers at the University of Manitoba and Environment and Climate Change Canada has confirmed that the Arctic is warming nearly four times faster than the global average, with far-reaching consequences for northern communities, wildlife, and global weather patterns. The study, published in the journal Nature Climate Change, analyzed temperature data from 1979 to the present across the entire Arctic region. It found that average temperatures in the Arctic have risen by 3.1 degrees Celsius over this period, compared to 0.8 degrees globally. The most dramatic warming has occurred in the Barents Sea region north of Scandinavia, where temperatures have risen by as much as 5.2 degrees.

B. One of the most visible effects of Arctic warming is the decline of sea ice. September sea ice extent — the month when ice reaches its annual minimum — has decreased by approximately 13 percent per decade since satellite measurements began in 1979. Scientists project that the Arctic could experience ice-free summers by the 2040s.

C. For Canada's northern communities, the effects are already being felt. Permafrost thaw is destabilizing buildings and roads in towns like Tuktoyaktuk in the Northwest Territories, where several homes have had to be relocated. Changing ice conditions have also disrupted traditional hunting routes used by Inuit communities for generations, threatening food security and cultural practices. Dr. Siku Naqitarvik, a climate scientist and member of the Inuit community in Iqaluit, emphasized the human dimension. "Climate models are important, but we must also listen to Indigenous knowledge holders who have observed these changes firsthand over decades," she said.

D. The study recommends that Canada invest $2.4 billion over the next ten years in Arctic infrastructure adaptation, including elevated building foundations, improved drainage systems, and expanded climate monitoring stations to track permafrost conditions.

E. Not in any of the paragraphs`,
    questions: [
      {
        id: "Reading-Part3-03-Q1",
        question: "Average temperatures in the Arctic have risen by 3.1 degrees Celsius since 1979.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-03-Q2",
        question: "September sea ice coverage has been shrinking by about 13 percent every decade.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-03-Q3",
        question: "Thawing permafrost has forced the relocation of homes in a northern Canadian town.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-03-Q4",
        question: "Researchers recommend billions of dollars in investment for Arctic infrastructure.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-03-Q5",
        question: "The Barents Sea region has experienced the most extreme temperature increase.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-03-Q6",
        question: "An Inuit climate scientist stressed the importance of listening to Indigenous knowledge holders.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-03-Q7",
        question: "Scientists predict the Arctic could have ice-free summers within the next two decades.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-03-Q8",
        question: "Changing ice conditions have disrupted traditional Inuit hunting routes.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-03-Q9",
        question: "The Canadian government has already approved the recommended funding for Arctic adaptation.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 4,
      },
    ],
  },
  (() => {
    const vpA = `SHOULD CANADA INTRODUCE A UNIVERSAL BASIC INCOME?

Viewpoint A — Priya Dhawan, Economist, University of Toronto:

Canada should seriously consider implementing a universal basic income (UBI). The concept is simple: every adult citizen receives a guaranteed monthly payment — say $1,500 — regardless of employment status. This would replace the patchwork of existing social assistance programs, many of which are inefficient and stigmatizing. A UBI pilot project in Ontario from 2017 to 2019 showed that participants experienced improved mental health, better nutrition, and many used the money to pursue education or start small businesses. Automation is eliminating jobs in manufacturing, retail, and transportation, and we need a safety net that reflects this new reality. Finland, Kenya, and several U.S. cities have run successful UBI experiments with encouraging results. The cost would be significant — roughly $85 billion annually — but it could be funded through a combination of eliminating redundant programs, modest tax increases on high earners, and the economic growth that comes when people have stable financial footing.`;

    const vpB = `SHOULD CANADA INTRODUCE A UNIVERSAL BASIC INCOME?

Viewpoint B — Trevor Makenzie, Senior Policy Advisor, Fraser Institute:

While the idea of universal basic income sounds appealing, the economics simply do not add up. At $1,500 per month for every Canadian adult, the annual cost would exceed $85 billion — nearly a third of the entire federal budget. Even with cuts to existing programs, the funding gap would require massive tax increases that could drive businesses and investment out of the country. Furthermore, a guaranteed income risks reducing the incentive to work. The Ontario pilot project was too small and too short to draw meaningful conclusions; participants knew the program was temporary, which likely influenced their behaviour. Instead of UBI, Canada should invest in targeted programs: expanded employment insurance, affordable childcare, and skills retraining for workers displaced by automation. These approaches address specific problems without the enormous fiscal risk of handing money to every citizen, including those who do not need it.`;

    return {
      id: "Reading-Part4-03",
      title: "03 | 10 Questions | Reading for Viewpoints",
      instruction:
        "Read the following article and response. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: vpA + `

` + vpB + `

---

As someone who lost their job during the pandemic, the idea of a universal basic income is very personal to me. Priya makes a compelling case, especially when she points out that existing social programs are ___ [6]. I was surprised to learn that the Ontario pilot showed participants experienced ___ [7]. However, Trevor raises a valid concern about the cost — $85 billion annually is ___ [8]. I think the best approach would be a compromise: rather than giving money to everyone, the government should ___ [9]. That way, the people who truly need help would receive it without the ___ [10] that Trevor warns about.`,
      questions: [
        { id: "Reading-Part4-03-Q1", question: "What dollar amount per month does Priya propose as a guaranteed income for every adult?", options: ["$1,000", "$1,200", "$1,500", "$2,000"], correctAnswer: 2 },
        { id: "Reading-Part4-03-Q2", question: "What flaw does Trevor point out regarding the trial program that ran in Ontario?", options: ["It was conducted in the wrong province", "It was too small and too short to draw meaningful conclusions", "It showed that participants stopped working entirely", "It was more expensive than projected"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q3", question: "What beneficial results does Priya cite from the provincial trial program?", options: ["Higher employment rates and increased tax revenue", "Improved mental health, better nutrition, and pursuit of education", "Reduced crime rates and lower healthcare costs", "More home ownership and decreased personal debt"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q4", question: "What alternative approaches does Trevor favour over a universal guaranteed income?", options: ["A smaller UBI payment of $500 per month", "Higher minimum wages across all provinces", "Expanded employment insurance, affordable childcare, and skills retraining", "Tax credits for low-income families"], correctAnswer: 2 },
        { id: "Reading-Part4-03-Q5", question: "How many billions of dollars would the guaranteed income program cost the country each year?", options: ["$50", "$65", "$85", "$100"], correctAnswer: 2 },
        { id: "Reading-Part4-03-Q6", question: "Existing social programs are ___.", options: ["well-funded and effective", "inefficient and stigmatizing", "only available in large cities", "too generous to recipients"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q7", question: "The Ontario pilot showed participants experienced ___.", options: ["no significant changes in their lives", "improved mental health, better nutrition, and pursuit of education", "reduced motivation to find employment", "increased spending on non-essential items"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q8", question: "$85 billion annually is ___.", options: ["a reasonable investment for such a large country", "an enormous amount that would be difficult to fund", "roughly equal to the current healthcare budget", "less than what is spent on existing social programs"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q9", question: "The government should ___.", options: ["implement UBI for all citizens immediately", "target support to those who need it most", "eliminate all existing social assistance programs", "let private charities handle income support"], correctAnswer: 1 },
        { id: "Reading-Part4-03-Q10", question: "The people who truly need help would receive it without the ___.", options: ["stigma of applying for welfare", "enormous fiscal risk", "need for government involvement", "burden of paying taxes"], correctAnswer: 1 },
      ],
    };
  })(),
  (() => {
    const passageA = `From: Oakville Community Association <events@oakvilleca.org>
To: Members and Neighbours
Subject: Annual Spring Clean-Up and Community BBQ — Saturday, April 26th

Hello neighbours,

Spring has arrived and it is time for our 8th Annual Spring Clean-Up! This year's event will take place on Saturday, April 26th, and we have an exciting day planned for everyone.

Morning Clean-Up (9:00 AM – 12:00 PM):
Volunteers will meet at Coronation Park pavilion at 9:00 AM for registration and a light breakfast of coffee, juice, and muffins. Teams of 4 to 6 people will be assigned to different zones covering local parks, trails, and streets. All supplies will be provided, including gloves, garbage bags, and high-visibility vests. Please wear sturdy shoes and dress for the weather. Children under 14 must be accompanied by a parent or guardian.

This year, we are also partnering with the Halton Region Recycling Program. A special collection truck will be stationed at the park from 10:00 AM to 1:00 PM to accept household electronics, small appliances, and batteries for responsible recycling. Please note that the truck cannot accept paint, chemicals, or tires.

Community BBQ (12:00 PM – 3:00 PM):
After the clean-up, join us for a free community BBQ right at the pavilion. The menu includes burgers, veggie burgers, hot dogs, coleslaw, and watermelon. Halal and vegetarian options will be available. Local band The Lakeshore Four will perform from 1:00 PM to 2:30 PM. There will also be face painting, a bouncy castle, and a plant swap table — bring a potted plant and take one home.

Volunteer Registration:
While drop-ins are welcome, we encourage you to register in advance at oakvilleca.org/spring-cleanup so we can plan supplies. Registered volunteers will receive a free Oakville Community Association t-shirt.

We need a minimum of 60 volunteers to cover all zones. Last year we had 85 participants and collected over 1,200 kilograms of litter. Let us beat that record.

Questions? Email events@oakvilleca.org or call 905-555-0234.

See you there!
The Oakville Community Association`;

    const passageB = `From: Meera Kapoor <meera.kapoor@gmail.com>
To: Oakville Community Association <events@oakvilleca.org>
Subject: Re: Annual Spring Clean-Up and Community BBQ — Saturday, April 26th

Dear Oakville Community Association,

Thank you so much for organizing the Spring Clean-Up and BBQ again this year. My family and I have participated in the last three clean-ups and it is always a highlight of our spring. I am writing to confirm our attendance, volunteer for some additional tasks, and raise a few questions.

Volunteering:
My husband Arjun and I would like to register as ___ [7] for one of the clean-up zones, if possible. We are both familiar with the Sixteen Mile Creek trail area and would be happy to lead a group there. We led a team along that same stretch in 2024 and managed to fill ___ [8] in just under two hours. Our two children, ages 10 and 12, will also be joining us.

I would also like to volunteer to help coordinate the plant swap table during the BBQ. I could bring approximately 15 potted herb seedlings to contribute.

Food Donation Offer:
Additionally, I run a small home baking business and would love to donate ___ [9] for the BBQ dessert table. I carry a valid food handler's certificate from Halton Region, if that helps.

Questions and Suggestions:
1. Will there be a designated ___ [10] at Coronation Park this year? Last year, one of the volunteers on our team got a minor cut from broken glass, and the nearest kit was back at the pavilion, which was quite a walk.

2. Finally, could the association consider adding a brief ___ [11] this year to recognize top volunteer teams or individuals? I think a small gesture like that would encourage even more participation next year.

We are very excited about the event and look forward to another successful clean-up.

Warm regards,
Meera Kapoor
128 Trafalgar Road, Oakville`;

    return {
      id: "Reading-Part1-04",
      title: "04 | 11 Questions | Reading Correspondence",
      instruction:
        "Read the following email exchange. Choose the best answer to each question, or fill in each blank with the best word or phrase.",
      passage: passageA,
      questions: [
        {
          id: "Reading-Part1-04-Q1",
          question: "At what hour should helpers arrive for sign-in and a morning snack?",
          options: ["8:00 AM", "8:30 AM", "9:00 AM", "10:00 AM"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q2",
          question:
            "What types of goods will the special disposal vehicle accept from residents?",
          options: [
            "Paint and chemicals",
            "Tires and batteries",
            "Household electronics and small appliances",
            "Furniture and mattresses",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q3",
          question:
            "What bonus item is given to people who sign up ahead of time?",
          options: [
            "A gift card",
            "A free lunch voucher",
            "A free t-shirt",
            "A reusable water bottle",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q4",
          question: "How many kilograms of trash were gathered during the previous year's neighbourhood tidy-up?",
          options: [
            "800",
            "1,000",
            "1,200",
            "1,500",
          ],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q5",
          question:
            "How old must young people be to take part in the event on their own, without adult supervision?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q6",
          question: "Which musical group will provide live entertainment at the afternoon gathering?",
          options: [
            "The Burlington Five",
            "The Lakeshore Four",
            "The Oakville Trio",
            "The Coronation Band",
          ],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "Reading-Part1-04-Q7",
          question: "My husband and I would like to register as ___.",
          options: [
            "volunteers for the BBQ",
            "team leaders",
            "event coordinators",
            "safety monitors",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "Reading-Part1-04-Q8",
          question: "We managed to fill ___ in just under two hours.",
          options: [
            "12 garbage bags",
            "15 garbage bags",
            "18 garbage bags",
            "22 garbage bags",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-04-Q9",
          question: "I would love to donate ___ for the BBQ dessert table.",
          options: [
            "brownies and cupcakes",
            "butter tarts and oatmeal raisin cookies",
            "banana bread and scones",
            "lemon squares and sugar cookies",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "Reading-Part1-04-Q10",
          question: "Will there be a designated ___ at Coronation Park this year?",
          options: [
            "shaded rest area",
            "recycling station",
            "first aid station",
            "lost and found table",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "Reading-Part1-04-Q11",
          question: "Could the association consider adding a brief ___?",
          options: [
            "raffle with gift card prizes",
            "social media photo contest",
            "awards ceremony",
            "community survey",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "Reading-Part2-04",
    title: "04 | 8 Questions | Reading to Apply a Diagram",
    instruction:
      "Read the following guide and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `MISSISSAUGA PUBLIC LIBRARY — MEMBERSHIP AND SERVICES GUIDE

Membership:
A Mississauga Library card is free for all residents of the City of Mississauga. To sign up, visit any branch with one piece of government-issued photo ID and one proof of address (such as a utility bill or bank statement). Cards for children under 13 require a parent or guardian to be present and to provide their own ID. Non-residents may purchase an annual membership for $50.

Borrowing Limits and Loan Periods:
- Books (print): Borrow up to 30 items. Loan period: 21 days, renewable twice if no holds exist.
- DVDs and Blu-rays: Borrow up to 5 items. Loan period: 7 days, renewable once.
- Magazines: Borrow up to 10 items. Loan period: 14 days, not renewable.
- Digital resources (eBooks and audiobooks via the Libby app): Borrow up to 10 items. Loan period: 14 days. Items return automatically — no late fees.

Late Fees and Replacements:
Overdue print books incur a fee of $0.25 per day, up to a maximum of $10.00 per item. DVD and Blu-ray late fees are $1.00 per day, up to $25.00. Lost or damaged items must be paid for at replacement cost. Accounts with outstanding fees over $15.00 will be blocked from borrowing until the balance is reduced.

Programs and Services:
- Free Wi-Fi and public computer access at all 18 branches. Sessions are limited to 60 minutes but may be extended if no one is waiting.
- Study rooms can be booked online up to 7 days in advance. Each booking is for a maximum of 2 hours.
- Settlement services for newcomers to Canada, including help with resumes, language classes, and government form assistance, are offered at the Central Library, Meadowvale, and Malton branches.
- Children's storytime programs run weekly at every branch, Tuesdays and Thursdays at 10:30 AM.

The library is open Monday to Thursday 9:00 AM to 9:00 PM, Friday 9:00 AM to 6:00 PM, Saturday 9:00 AM to 5:00 PM, and Sunday 1:00 PM to 5:00 PM.

---

Hi Rosa,

I just got my Mississauga Library card and wanted to tell you about it! Since you live in Oakville, you'd need to pay ___ [1] for a non-resident annual membership, but honestly it's worth it.

I borrowed a few DVDs for the kids, but we need to return them quickly — the loan period is only ___ [2]. If we're late, the daily fee is ___ [3], which adds up fast!

I also found out they have storytime programs for the kids. They run on ___ [4], which works perfectly since we're usually free those mornings. And I booked a study room for Saturday — you can reserve them up to ___ [5] in advance.

Let me know if you want to come check it out this weekend. The library closes at 5:00 PM on Saturdays, so we should get there early.

Talk soon,
Fatima`,
    questions: [
      {
        id: "Reading-Part2-04-Q1",
        question: "You'd need to pay ___ for a non-resident annual membership.",
        options: ["$25", "$35", "$50", "$75"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-04-Q2",
        question: "The loan period is only ___.",
        options: ["3 days", "5 days", "7 days", "14 days"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-04-Q3",
        question: "The daily fee is ___.",
        options: ["$0.25", "$0.50", "$1.00", "$2.00"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-04-Q4",
        question: "They run on ___.",
        options: [
          "Mondays and Wednesdays at 10:00 AM",
          "Tuesdays and Thursdays at 10:30 AM",
          "Wednesdays and Fridays at 11:00 AM",
          "Saturdays and Sundays at 2:00 PM",
        ],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part2-04-Q5",
        question: "You can reserve them up to ___ in advance.",
        options: ["1 day", "3 days", "5 days", "7 days"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part2-04-Q6",
        question:
          "Above what outstanding fee amount does the system prevent cardholders from borrowing?",
        options: [
          "$5.00",
          "$10.00",
          "$15.00",
          "$25.00",
        ],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part2-04-Q7",
        question:
          "What is the maximum number of print books a cardholder may borrow at one time?",
        options: ["10", "15", "20", "30"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part2-04-Q8",
        question:
          "Fatima and Rosa are most likely ___.",
        options: [
          "library employees discussing a new policy",
          "friends, with Fatima living in Mississauga and Rosa in Oakville",
          "students working on a group project together",
          "newcomers attending a settlement services workshop",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "Reading-Part3-04",
    title: "04 | 9 Questions | Reading for Information",
    instruction:
      "Read the following article. For each statement below, identify which paragraph (A, B, C, or D) the information is found in. If the information is not found in any paragraph, choose E.",
    passage: `A. Canada's technology startup sector has seen remarkable growth over the past decade, with Toronto, Vancouver, and Montreal now recognized as top-tier global tech hubs. A new report from the Canadian Venture Capital and Private Equity Association (CVCA) reveals that Canadian startups raised a combined $9.7 billion in venture capital funding last year, a 22 percent increase from the year before. Toronto's tech corridor, sometimes called "Silicon Valley North," is home to more than 5,200 tech companies and employs approximately 350,000 workers in the Greater Toronto Area alone. The city's strengths lie in artificial intelligence and fintech, driven in part by the presence of the Vector Institute, a world-leading AI research centre co-founded by Geoffrey Hinton.

B. Vancouver has carved out a niche in video game development, visual effects, and clean technology. Major studios like Electronic Arts and Sony Pictures Imageworks maintain large operations in the city, and the clean-tech sector has attracted over $1.3 billion in investment since 2020. The province of British Columbia offers a 30 percent tax credit for eligible tech companies, making it one of the most attractive jurisdictions in North America.

C. Montreal, meanwhile, has become a powerhouse in AI research, largely due to the work of Yoshua Bengio and the Mila research institute. The city benefits from relatively low operating costs compared to Toronto and Vancouver, as well as a deep talent pool from four major universities. Quebec's generous R&D tax credits — up to 37.5 percent for small businesses — have attracted companies like Google, Microsoft, and Samsung to establish AI labs there.

D. Despite these successes, challenges remain. A survey of 400 Canadian startup founders found that 62 percent identified access to late-stage funding as their biggest obstacle, as many companies still turn to U.S. investors for Series B and C rounds. Additionally, 45 percent of respondents cited difficulty retaining senior talent, who are often recruited by larger American firms offering higher salaries. The federal government's Canada Digital Adoption Program has allocated $4 billion to help small and medium-sized businesses adopt new technologies, and the Strategic Innovation Fund continues to provide grants to high-potential startups.

E. Not in any of the paragraphs`,
    questions: [
      {
        id: "Reading-Part3-04-Q1",
        question: "Canadian startups raised $9.7 billion in venture capital funding last year.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-04-Q2",
        question: "British Columbia offers a 30 percent tax credit for eligible tech companies.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 1,
      },
      {
        id: "Reading-Part3-04-Q3",
        question: "The majority of startup founders surveyed said access to late-stage funding was their biggest challenge.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-04-Q4",
        question: "Montreal has become a leading centre for AI research thanks to the Mila research institute.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-04-Q5",
        question: "The federal government has allocated $4 billion to help businesses adopt new technologies.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-04-Q6",
        question: "Toronto's tech corridor is home to more than 5,200 tech companies.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 0,
      },
      {
        id: "Reading-Part3-04-Q7",
        question: "Quebec offers R&D tax credits of up to 37.5 percent for small businesses.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 2,
      },
      {
        id: "Reading-Part3-04-Q8",
        question: "Nearly half of startup founders reported difficulty retaining senior talent.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 3,
      },
      {
        id: "Reading-Part3-04-Q9",
        question: "The Canadian government plans to open a new national technology research centre in Ottawa.",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: 4,
      },
    ],
  },
];
