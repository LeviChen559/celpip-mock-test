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

First, while I understand that the Thunder Bay office will remain open as a regional hub, I am wondering whether the scope of our work here will change. Currently, our team of 14 developers handles all back-end infrastructure for Northern Digital's client projects. Will the Thunder Bay team continue to manage these projects independently, or will responsibilities be redistributed to the Winnipeg office after the merger?

Second, regarding the new benefits package, several colleagues and I are currently enrolled in Northern Digital's extended health plan, which includes coverage for physiotherapy and mental health counselling up to $3,000 per year. We would like to know whether these specific benefits will be preserved or reduced under the new combined package.

Third, I noticed that the Culture Integration Committee will be made up of volunteers. I would like to put my name forward for this committee. Could you let me know when and how the selection process will take place? I believe representation from the Thunder Bay office is essential to ensure our team's perspective is included.

Finally, I want to raise a practical concern about communication. Since the merger announcement, there has been a great deal of uncertainty among staff here. Many of my colleagues feel that most of the planning discussions have been centred in Winnipeg, and they worry that decisions affecting our office may be made without sufficient input from Thunder Bay employees. Would it be possible to schedule a dedicated town hall meeting — either in person or via video conference — specifically for Thunder Bay staff before March 25th?

I appreciate your openness to questions and look forward to hearing back from the transition team.

Best regards,
James Whitfield
Senior Developer, Thunder Bay Office
Northern Digital Solutions`;

    return {
      id: "R5",
      title: "Part 5: Reading Correspondence",
      instruction:
        "Read the following email exchange and answer the questions. Questions 1–6 are based on the first email from the CEO. Questions 7–11 are based on the employee's response.",
      passage: passageA,
      questions: [
        {
          id: "R5Q1",
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
          id: "R5Q2",
          question:
            "How many months of job protection are promised to staff after the corporate change?",
          options: ["6", "12", "18", "24"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R5Q3",
          question: "Which city will serve as the main headquarters for the new entity?",
          options: ["Thunder Bay", "Toronto", "Winnipeg", "Ottawa"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R5Q4",
          question:
            "How much will employees receive yearly for health and wellness expenses under the updated plan?",
          options: ["$800", "$1,000", "$1,200", "$1,500"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R5Q5",
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
          id: "R5Q6",
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
          id: "R5Q7",
          question: "How many developers currently work in the Thunder Bay office?",
          options: [
            "7",
            "10",
            "14",
            "18",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R5Q8",
          question: "What specific type of work does the Thunder Bay development team currently handle?",
          options: [
            "Front-end design for marketing websites",
            "Back-end infrastructure for client projects",
            "Quality assurance testing for mobile apps",
            "Customer support and technical documentation",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R5Q9",
          question: "How much annual coverage does Northern Digital's current extended health plan provide for physiotherapy and mental health counselling?",
          options: [
            "$1,200",
            "$1,500",
            "$2,000",
            "$3,000",
          ],
          correctAnswer: 3,
          passage: passageB,
        },
        {
          id: "R5Q10",
          question: "What does James request be arranged specifically for Thunder Bay employees before March 25th?",
          options: [
            "A salary review meeting",
            "A dedicated town hall meeting",
            "A visit from the CEO to the Thunder Bay office",
            "A written summary of all planned changes",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R5Q11",
          question: "What is the main concern James raises about communication during the merger process?",
          options: [
            "That emails are not being delivered to Thunder Bay staff",
            "That the transition team has not responded to previous inquiries",
            "That planning discussions have been centred in Winnipeg without sufficient input from Thunder Bay",
            "That the merger announcement was sent too late for staff to prepare",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "R6",
    title: "Part 6: Reading to Apply a Diagram",
    instruction:
      "Read the following transit information and answer the questions.",
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
All stations are fully accessible, with elevators, tactile guide paths, and priority seating on every train. Service animals are welcome at all times.`,
    questions: [
      {
        id: "R6Q1",
        question:
          "How many minutes does a complete trip across the entire light rail route take?",
        options: [
          "42",
          "47",
          "52",
          "60",
        ],
        correctAnswer: 2,
      },
      {
        id: "R6Q2",
        question:
          "Where should passengers get off to connect to the north-south rail line?",
        options: [
          "Bonnie Doon",
          "Churchill",
          "Government Centre",
          "Mill Woods",
        ],
        correctAnswer: 1,
      },
      {
        id: "R6Q3",
        question: "What is the price of a 30-day transit pass for a teenager?",
        options: ["$50.00", "$75.00", "$100.00", "$10.25"],
        correctAnswer: 1,
      },
      {
        id: "R6Q4",
        question:
          "What is the maximum number of young riders who travel at no cost when accompanied by a paying grown-up?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
      },
      {
        id: "R6Q5",
        question:
          "How often (in minutes) does service run on weekends' second day?",
        options: [
          "5",
          "10",
          "15",
          "20",
        ],
        correctAnswer: 2,
      },
      {
        id: "R6Q6",
        question:
          "How many vehicle spots does the drive-and-ride facility at the southeast terminal offer?",
        options: ["200", "350", "450", "500"],
        correctAnswer: 2,
      },
      {
        id: "R6Q7",
        question:
          "What is the connection between the train stop and the large shopping centre?",
        options: [
          "By taking a shuttle bus",
          "Through an underground pedway from the platform",
          "By walking across a sky bridge",
          "Through the mall's main entrance on street level",
        ],
        correctAnswer: 1,
      },
      {
        id: "R6Q8",
        question:
          "How many minutes can a passenger use one individual ticket to make connections?",
        options: [
          "60",
          "90",
          "120",
          "No limit — the entire day",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "R7",
    title: "Part 7: Reading for Information",
    instruction:
      "Read the following article and answer the questions.",
    passage: `CANADA INTRODUCES EXPRESS ENTRY CATEGORY-BASED SELECTION ROUNDS

Ottawa — Immigration, Refugees and Citizenship Canada (IRCC) has announced significant changes to the Express Entry system, introducing category-based selection rounds designed to address specific labour market shortages across the country.

Under the previous system, candidates were ranked solely by their Comprehensive Ranking System (CRS) score, which considers factors such as age, education, language proficiency, and work experience. While this approach was effective at selecting highly skilled immigrants, critics argued that it did not sufficiently target sectors facing acute shortages.

Beginning this year, IRCC will conduct targeted draws for candidates with experience in healthcare, STEM fields (science, technology, engineering, and mathematics), skilled trades, agriculture, and transport. Candidates in these categories may be selected even if their CRS score falls below the general cutoff, provided they meet a minimum threshold of 380 points.

Dr. Amara Okafor, a policy analyst at the Conference Board of Canada, explained that the changes reflect a broader shift in immigration strategy. "Canada's aging population means we need workers in very specific fields. A software engineer and a nurse are both valuable, but the nurse addresses a more urgent gap in many communities," she said.

The government has also increased the total number of permanent residence invitations for the year to 485,000, up from 465,000 the previous year. Of these, approximately 110,000 will be issued through Express Entry, with at least 40 percent allocated to category-based draws.

Provincial Nominee Programs (PNPs) will continue to operate alongside Express Entry. Several provinces, including British Columbia and Ontario, have already aligned their PNP streams with the new federal categories to avoid duplication and improve processing times.

Applicants are encouraged to update their Express Entry profiles to accurately reflect their work experience, as the system will now cross-reference occupation codes with the targeted categories during each draw.`,
    questions: [
      {
        id: "R7Q1",
        question:
          "What is the lowest ranking score (in points) a candidate can have and still be eligible for a targeted draw?",
        options: [
          "350",
          "380",
          "400",
          "420",
        ],
        correctAnswer: 1,
      },
      {
        id: "R7Q2",
        question:
          "Which sector is NOT among the occupational fields prioritized in the new selection rounds?",
        options: ["Healthcare", "Skilled trades", "Finance", "Agriculture"],
        correctAnswer: 2,
      },
      {
        id: "R7Q3",
        question:
          "What is the total number of landed status offers the government intends to issue this year?",
        options: ["410,000", "465,000", "485,000", "500,000"],
        correctAnswer: 2,
      },
      {
        id: "R7Q4",
        question:
          "At minimum, what percentage of the federal skilled worker invitations will be reserved for occupation-specific rounds?",
        options: [
          "25%",
          "30%",
          "40%",
          "50%",
        ],
        correctAnswer: 2,
      },
      {
        id: "R7Q5",
        question:
          "What reason does the policy expert give for Canada's shift toward sector-focused newcomer selection?",
        options: [
          "To increase the total population quickly",
          "To attract more investors from abroad",
          "To address labour shortages caused by an aging population",
          "To reduce the number of Express Entry applications",
        ],
        correctAnswer: 2,
      },
      {
        id: "R7Q6",
        question:
          "Approximately how many permanent residency offers will come through the federal skilled immigration stream?",
        options: [
          "85,000",
          "110,000",
          "200,000",
          "465,000",
        ],
        correctAnswer: 1,
      },
      {
        id: "R7Q7",
        question:
          "Which factors does the points-based ranking system use to evaluate applicants?",
        options: [
          "Age, education, language proficiency, and work experience",
          "Income, property ownership, and family size",
          "Criminal record, health status, and travel history",
          "Country of origin, religion, and marital status",
        ],
        correctAnswer: 0,
      },
      {
        id: "R7Q8",
        question:
          "Which two provinces have already coordinated their nominee programs with the updated national priorities?",
        options: [
          "Alberta and Saskatchewan",
          "British Columbia and Ontario",
          "Manitoba and Quebec",
          "Nova Scotia and New Brunswick",
        ],
        correctAnswer: 1,
      },
      {
        id: "R7Q9",
        question:
          "What action is recommended for candidates who already have an immigration profile in the system?",
        options: [
          "Submit new profiles from scratch",
          "Update them to accurately reflect their work experience",
          "Remove any previous work experience data",
          "Wait until the next draw to make changes",
        ],
        correctAnswer: 1,
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
      id: "R8",
      title: "Part 8: Reading for Viewpoints",
      instruction:
        "Read the two viewpoints and answer the questions. Each question shows the relevant viewpoint.",
      passage: vpA,
      questions: [
        { id: "R8Q1", question: "What productivity gain did Marcus's organization experience after staff began working from home?", options: ["8%", "10%", "12%", "15%"], correctAnswer: 2, passage: vpA },
        { id: "R8Q2", question: "What challenge does Linda highlight for recently hired staff in a fully remote setting?", options: ["They lack technical skills for remote tools", "They struggle to build relationships and learn company culture", "They are less productive than experienced workers", "They demand higher salaries for remote positions"], correctAnswer: 1, passage: vpB },
        { id: "R8Q3", question: "What yearly cost reduction did Marcus's firm achieve by reducing its physical workspace?", options: ["$100,000", "$150,000", "$200,000", "$250,000"], correctAnswer: 2, passage: vpA },
        { id: "R8Q4", question: "What type of work arrangement does Linda propose as the ideal compromise?", options: ["Full-time remote work", "Full-time office work", "A hybrid model with three office days and two home days", "Alternating weeks between office and home"], correctAnswer: 2, passage: vpB },
        { id: "R8Q5", question: "What equity problem does Linda identify with allowing some staff to always work from home?", options: ["Senior employees get preferential treatment", "Not every role can be done remotely, creating resentment", "Remote workers receive lower pay than office workers", "Managers cannot evaluate remote employees accurately"], correctAnswer: 1, passage: vpB },
        { id: "R8Q6", question: "How does Marcus say that working from home helps with recruitment?", options: ["It allows companies to pay lower salaries", "It opens the door to hiring talented people from smaller communities", "It eliminates the need for HR departments", "It reduces the number of job applications"], correctAnswer: 1, passage: vpA },
        { id: "R8Q7", question: "What psychological well-being issue does Linda link to employees never coming into the workplace?", options: ["Increased anxiety about job security", "Difficulty learning new software tools", "Feelings of isolation and difficulty separating work from personal life", "Pressure to work longer hours due to manager surveillance"], correctAnswer: 2, passage: vpB },
        { id: "R8Q8", question: "What does Marcus think should be the standard policy for where employees do their jobs?", options: ["A hybrid model with equal office and home days", "Full-time office work with remote Fridays", "Permanent remote work with occasional in-person meetings", "Rotating shifts between office and home weekly"], correctAnswer: 2, passage: vpA },
        { id: "R8Q9", question: "In which city does Marcus work?", options: ["Toronto", "Vancouver", "Calgary", "Halifax"], correctAnswer: 2, passage: vpA },
        { id: "R8Q10", question: "In Linda's view, what is the key ingredient that helps organizations flourish?", options: ["Competitive salaries and bonuses", "Flexible scheduling software", "Human connections", "Strict performance management"], correctAnswer: 2, passage: vpB },
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

Regarding Phase 1, I work from home three days a week and rely on reliable building access. The side entrance on Maple Avenue is quite far from the underground parking garage, which means I will need to walk around the entire building every time I return from errands. Is there any possibility of keeping the garage-level entrance operational during this phase? Also, I was unable to visit the concierge desk during regular hours last week. Could the new key fobs be mailed to residents who cannot pick them up in person?

My biggest concern relates to Phase 2. I live on the 12th floor and I have a knee condition that makes it very difficult to use the stairs. I noticed the email mentions priority elevator access for residents with mobility concerns, but it does not explain how this would work in practice. Will there be a sign-up system or scheduled time slots? I would appreciate more specific details, as two months with only one working elevator serving a 15-storey building with over 200 units could create serious delays during morning rush hours.

As for Phase 3, I have floor-to-ceiling windows in my living room and bedroom, and I own several large bookcases positioned directly against the window walls. Moving these heavy items one metre away on my own is not feasible. Will management provide any assistance with moving furniture, or can you recommend a moving service that other residents have used? Additionally, I have two cats, and I am worried about them escaping through open windows or doors during the installation. Could the work crew ensure that all entry points remain sealed while working in occupied units?

Finally, I would like to suggest that management hold an in-person information session for residents before May 5th. Many of my neighbours on the 12th floor have similar questions, and a group meeting would be far more efficient than individual emails. The party room on the ground floor would be an ideal venue and could easily accommodate 40 to 50 people.

I appreciate your time and look forward to your response.

Sincerely,
Anita Sharma
Unit 1204, 245 Lakeshore Drive`;

    return {
      id: "R9",
      title: "Part 9: Reading Correspondence",
      instruction:
        "Read the following email exchange and answer the questions. Questions 1–6 are based on the first email from management. Questions 7–11 are based on the resident's response.",
      passage: passageA,
      questions: [
        {
          id: "R9Q1",
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
          id: "R9Q2",
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
          id: "R9Q3",
          question:
            "How many hours ahead of time will tenants be informed before glass installation begins in their apartment?",
          options: ["24", "48", "72", "168"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R9Q4",
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
          id: "R9Q5",
          question: "On what date does the lift upgrade stage of the project start?",
          options: ["May 5th", "June 30th", "July 1st", "September 1st"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R9Q6",
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
          id: "R9Q7",
          question: "How long has Anita Sharma been a resident at 245 Lakeshore Drive?",
          options: [
            "About five years",
            "About seven years",
            "Nearly nine years",
            "Over twelve years",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R9Q8",
          question: "Why is Anita concerned about using the side entrance during Phase 1?",
          options: [
            "It is not accessible to wheelchair users",
            "It is far from the underground parking garage",
            "It does not have a working key fob reader",
            "It is only open during business hours",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R9Q9",
          question: "What health issue makes it difficult for Anita to take the stairs during Phase 2?",
          options: [
            "A back injury",
            "A heart condition",
            "A knee condition",
            "A respiratory illness",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R9Q10",
          question: "What does Anita suggest management organize before renovations begin?",
          options: [
            "A written FAQ document for all residents",
            "A one-on-one meeting with each tenant",
            "An in-person information session in the party room",
            "A video conference call for each floor",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R9Q11",
          question: "What concern does Anita raise about the window replacement work in her unit?",
          options: [
            "She is worried about noise levels during the installation",
            "She cannot move heavy furniture by herself and fears her cats may escape",
            "She is concerned the new windows will not match her interior decor",
            "She does not want workers entering her unit without supervision",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "R10",
    title: "Part 10: Reading to Apply a Diagram",
    instruction:
      "Read the following guide and answer the questions.",
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
- Final exams: December 9th to 20th`,
    questions: [
      {
        id: "R10Q1",
        question:
          "What is the earliest date that incoming freshmen can sign up for classes?",
        options: ["June 1st", "June 15th", "July 1st", "July 15th"],
        correctAnswer: 3,
      },
      {
        id: "R10Q2",
        question:
          "What is the upper limit on how many classes a full-time learner may enrol in during one term?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
      },
      {
        id: "R10Q3",
        question: "What is the amount of the required upfront payment that cannot be returned?",
        options: ["$250", "$350", "$500", "$750"],
        correctAnswer: 2,
      },
      {
        id: "R10Q4",
        question:
          "In which room and building can students drop in to receive guidance on their course selections?",
        options: [
          "Room 100 of the Library",
          "Room 214 of the Student Central building",
          "The Registrar's Office",
          "Room 310 of the Arts building",
        ],
        correctAnswer: 1,
      },
      {
        id: "R10Q5",
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
        id: "R10Q6",
        question:
          "How many hours in advance of their enrolment period do students need to set up their online portal?",
        options: [
          "12",
          "24",
          "48",
          "72",
        ],
        correctAnswer: 2,
      },
      {
        id: "R10Q7",
        question:
          "What is the fewest number of classes a full-time learner is required to take each term?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
      },
      {
        id: "R10Q8",
        question:
          "How many days after signing up for classes is the payment deadline for the enrolment confirmation fee?",
        options: [
          "3",
          "5",
          "7",
          "14",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "R11",
    title: "Part 11: Reading for Information",
    instruction:
      "Read the following article and answer the questions.",
    passage: `THE ARCTIC IS WARMING FOUR TIMES FASTER THAN THE REST OF THE PLANET

A comprehensive study led by researchers at the University of Manitoba and Environment and Climate Change Canada has confirmed that the Arctic is warming nearly four times faster than the global average, with far-reaching consequences for northern communities, wildlife, and global weather patterns.

The study, published in the journal Nature Climate Change, analyzed temperature data from 1979 to the present across the entire Arctic region. It found that average temperatures in the Arctic have risen by 3.1 degrees Celsius over this period, compared to 0.8 degrees globally. The most dramatic warming has occurred in the Barents Sea region north of Scandinavia, where temperatures have risen by as much as 5.2 degrees.

One of the most visible effects of Arctic warming is the decline of sea ice. September sea ice extent — the month when ice reaches its annual minimum — has decreased by approximately 13 percent per decade since satellite measurements began in 1979. Scientists project that the Arctic could experience ice-free summers by the 2040s.

For Canada's northern communities, the effects are already being felt. Permafrost thaw is destabilizing buildings and roads in towns like Tuktoyaktuk in the Northwest Territories, where several homes have had to be relocated. Changing ice conditions have also disrupted traditional hunting routes used by Inuit communities for generations, threatening food security and cultural practices.

Dr. Siku Naqitarvik, a climate scientist and member of the Inuit community in Iqaluit, emphasized the human dimension. "Climate models are important, but we must also listen to Indigenous knowledge holders who have observed these changes firsthand over decades," she said.

The study recommends that Canada invest $2.4 billion over the next ten years in Arctic infrastructure adaptation, including elevated building foundations, improved drainage systems, and expanded climate monitoring stations to track permafrost conditions.`,
    questions: [
      {
        id: "R11Q1",
        question:
          "How many times faster is the far north heating up compared to the worldwide temperature trend?",
        options: [
          "Two",
          "Three",
          "Nearly four",
          "Five",
        ],
        correctAnswer: 2,
      },
      {
        id: "R11Q2",
        question:
          "What is the total temperature increase (in degrees Celsius) recorded in the polar region over the study period?",
        options: [
          "0.8",
          "2.1",
          "3.1",
          "5.2",
        ],
        correctAnswer: 2,
      },
      {
        id: "R11Q3",
        question:
          "By which decade do researchers expect the northern polar waters to be completely open in warm months?",
        options: [
          "2030s",
          "2040s",
          "2050s",
          "2060s",
        ],
        correctAnswer: 1,
      },
      {
        id: "R11Q4",
        question:
          "Which northern town has already seen homes relocated due to thawing frozen ground?",
        options: [
          "Iqaluit",
          "Yellowknife",
          "Tuktoyaktuk",
          "Churchill",
        ],
        correctAnswer: 2,
      },
      {
        id: "R11Q5",
        question:
          "What level of spending do the researchers propose for upgrading buildings and systems in the far north?",
        options: [
          "$1.2 billion / five years",
          "$2.4 billion / ten years",
          "$3.6 billion / ten years",
          "$5 billion / twenty years",
        ],
        correctAnswer: 1,
      },
      {
        id: "R11Q6",
        question:
          "Which specific area has experienced the greatest temperature rise in the polar region?",
        options: [
          "The Canadian Arctic Archipelago",
          "The Bering Strait region",
          "The Barents Sea region north of Scandinavia",
          "The Greenland ice sheet",
        ],
        correctAnswer: 2,
      },
      {
        id: "R11Q7",
        question:
          "Approximately what percentage has the annual minimum frozen ocean coverage been shrinking every ten years?",
        options: [
          "7%",
          "10%",
          "13%",
          "18%",
        ],
        correctAnswer: 2,
      },
      {
        id: "R11Q8",
        question:
          "What key point did the Inuit climate scientist stress in her remarks?",
        options: [
          "The need for more satellite technology",
          "The importance of listening to Indigenous knowledge holders",
          "The urgency of relocating all northern communities",
          "The need to stop all industrial activity in the Arctic",
        ],
        correctAnswer: 1,
      },
      {
        id: "R11Q9",
        question:
          "What practical measures do the researchers suggest for protecting northern buildings and services?",
        options: [
          "Building underground cities",
          "Relocating all northern communities southward",
          "Elevated building foundations and improved drainage systems",
          "Banning new construction in permafrost zones",
        ],
        correctAnswer: 2,
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
      id: "R12",
      title: "Part 12: Reading for Viewpoints",
      instruction:
        "Read the two viewpoints and answer the questions. Each question shows the relevant viewpoint.",
      passage: vpA,
      questions: [
        { id: "R12Q1", question: "What dollar amount per month does Priya propose as a guaranteed income for every adult?", options: ["$1,000", "$1,200", "$1,500", "$2,000"], correctAnswer: 2, passage: vpA },
        { id: "R12Q2", question: "What flaw does Trevor point out regarding the trial program that ran in Ontario?", options: ["It was conducted in the wrong province", "It was too small and too short to draw meaningful conclusions", "It showed that participants stopped working entirely", "It was more expensive than projected"], correctAnswer: 1, passage: vpB },
        { id: "R12Q3", question: "What beneficial results does Priya cite from the provincial trial program?", options: ["Higher employment rates and increased tax revenue", "Improved mental health, better nutrition, and pursuit of education", "Reduced crime rates and lower healthcare costs", "More home ownership and decreased personal debt"], correctAnswer: 1, passage: vpA },
        { id: "R12Q4", question: "What alternative approaches does Trevor favour over a universal guaranteed income?", options: ["A smaller UBI payment of $500 per month", "Higher minimum wages across all provinces", "Expanded employment insurance, affordable childcare, and skills retraining", "Tax credits for low-income families"], correctAnswer: 2, passage: vpB },
        { id: "R12Q5", question: "How many billions of dollars would the guaranteed income program cost the country each year, according to the writers?", options: ["$50", "$65", "$85", "$100"], correctAnswer: 2, passage: vpA },
        { id: "R12Q6", question: "Which places around the world does Priya mention as examples where guaranteed income programs have been tested?", options: ["Germany, Japan, and Australia", "Finland, Kenya, and several U.S. cities", "Sweden, India, and the United Kingdom", "Norway, Brazil, and South Korea"], correctAnswer: 1, passage: vpA },
        { id: "R12Q7", question: "According to Trevor, what would be the consequence of significantly raising taxes to fund this program?", options: ["They would primarily affect middle-class families", "They would have no measurable impact", "They could drive businesses and investment out of the country", "They would be offset by increased consumer spending"], correctAnswer: 2, passage: vpB },
        { id: "R12Q8", question: "What is one funding source that Priya suggests could help pay for a guaranteed income?", options: ["Reducing military spending", "Eliminating redundant social assistance programs", "Introducing a national sales tax", "Borrowing from international organizations"], correctAnswer: 1, passage: vpA },
        { id: "R12Q9", question: "During which years was the provincial guaranteed income trial conducted?", options: ["2014 to 2016", "2015 to 2017", "2017 to 2019", "2019 to 2021"], correctAnswer: 2, passage: vpA },
        { id: "R12Q10", question: "What negative behavioural effect does Trevor worry would result from providing unconditional payments?", options: ["Increased inflation in housing markets", "Reducing the incentive to work", "Higher rates of substance abuse", "Declining birth rates"], correctAnswer: 1, passage: vpB },
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
My husband Arjun and I would like to register as team leaders for one of the clean-up zones, if possible. We are both familiar with the Sixteen Mile Creek trail area and would be happy to lead a group there. We led a team along that same stretch in 2024 and managed to fill 18 garbage bags in just under two hours. Our two children, ages 10 and 12, will also be joining us.

I would also like to volunteer to help coordinate the plant swap table during the BBQ. I have been running a small community garden on Lakeshore Road for the past four years and could bring approximately 15 potted herb seedlings — basil, mint, rosemary, and cilantro — to contribute.

Food Donation Offer:
Additionally, I run a small home baking business and would love to donate three dozen butter tarts and two dozen oatmeal raisin cookies for the BBQ dessert table. Would there be space for donated baked goods, and are there any food safety requirements I should be aware of? I carry a valid food handler's certificate from Halton Region, if that helps.

Questions and Suggestions:
1. Will there be a designated first aid station at Coronation Park this year? Last year, one of the volunteers on our team got a minor cut from broken glass, and the nearest first aid kit was back at the pavilion, which was quite a walk from our zone.

2. I noticed the event runs from 9:00 AM to 3:00 PM. Would it be possible to set up a shaded rest area with water and sunscreen near the main registration point? April weather can be unpredictable, and I recall it was quite warm last year.

3. My neighbour, Mrs. Dawson, uses a wheelchair and would love to attend the BBQ portion. Is the pavilion area fully accessible, including the washrooms?

4. Finally, could the association consider adding a brief awards ceremony this year to recognize top volunteer teams or individuals? I think a small gesture like that would encourage even more participation next year.

We are very excited about the event and look forward to another successful clean-up. Please let me know if you need anything else from me in advance.

Warm regards,
Meera Kapoor
128 Trafalgar Road, Oakville`;

    return {
      id: "R13",
      title: "Part 13: Reading Correspondence",
      instruction:
        "Read the following two emails. Questions 1 to 6 are based on the first email (the community association notice). Questions 7 to 11 are based on the second email (the community member's response).",
      passage: passageA,
      questions: [
        {
          id: "R13Q1",
          question: "At what hour should helpers arrive for sign-in and a morning snack?",
          options: ["8:00 AM", "8:30 AM", "9:00 AM", "10:00 AM"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R13Q2",
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
          id: "R13Q3",
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
          id: "R13Q4",
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
          id: "R13Q5",
          question:
            "How old must young people be to take part in the event on their own, without adult supervision?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 2,
          passage: passageA,
        },
        {
          id: "R13Q6",
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
          id: "R13Q7",
          question: "Which trail area does Meera's family want to be assigned to for the clean-up?",
          options: [
            "Coronation Park loop",
            "Lakeshore Road pathway",
            "Sixteen Mile Creek trail",
            "Bronte Creek trail",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R13Q8",
          question: "How many garbage bags did Meera's team fill during the previous year's clean-up?",
          options: [
            "12",
            "15",
            "18",
            "22",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R13Q9",
          question: "What does Meera offer to donate for the BBQ dessert table?",
          options: [
            "Brownies and cupcakes",
            "Butter tarts and oatmeal raisin cookies",
            "Banana bread and scones",
            "Lemon squares and sugar cookies",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R13Q10",
          question: "Why does Meera suggest setting up a first aid station at the park this year?",
          options: [
            "A child fell and injured their knee during the BBQ",
            "A volunteer got a minor cut from broken glass and the nearest kit was far away",
            "Several volunteers experienced heat exhaustion",
            "The association received complaints from the local health authority",
          ],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R13Q11",
          question: "What new addition does Meera suggest to encourage greater volunteer participation in future years?",
          options: [
            "A raffle with gift card prizes",
            "A social media photo contest",
            "A brief awards ceremony to recognize top volunteers",
            "Free memberships to the community association",
          ],
          correctAnswer: 2,
          passage: passageB,
        },
      ],
    };
  })(),
  {
    id: "R14",
    title: "Part 14: Reading to Apply a Diagram",
    instruction:
      "Read the following guide and answer the questions.",
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

The library is open Monday to Thursday 9:00 AM to 9:00 PM, Friday 9:00 AM to 6:00 PM, Saturday 9:00 AM to 5:00 PM, and Sunday 1:00 PM to 5:00 PM.`,
    questions: [
      {
        id: "R14Q1",
        question:
          "What is the yearly fee for people who live outside the city to obtain a borrowing card?",
        options: ["$25", "$35", "$50", "$75"],
        correctAnswer: 2,
      },
      {
        id: "R14Q2",
        question: "What is the maximum number of physical books a cardholder may have checked out simultaneously?",
        options: ["10", "15", "20", "30"],
        correctAnswer: 3,
      },
      {
        id: "R14Q3",
        question: "How much is the daily charge for returning video discs after the due date?",
        options: ["$0.25", "$0.50", "$1.00", "$2.00"],
        correctAnswer: 2,
      },
      {
        id: "R14Q4",
        question:
          "Above what outstanding fee amount does the system prevent cardholders from taking out more items?",
        options: [
          "$5.00",
          "$10.00",
          "$15.00",
          "$25.00",
        ],
        correctAnswer: 2,
      },
      {
        id: "R14Q5",
        question:
          "How many days ahead of time can patrons reserve a private workspace?",
        options: ["1", "3", "5", "7"],
        correctAnswer: 3,
      },
      {
        id: "R14Q6",
        question:
          "How many days may periodicals be kept before they must be returned?",
        options: ["7", "14", "21", "30"],
        correctAnswer: 1,
      },
      {
        id: "R14Q7",
        question:
          "How many locations does this city's library system operate across?",
        options: ["12", "15", "18", "22"],
        correctAnswer: 2,
      },
      {
        id: "R14Q8",
        question:
          "On which days and at what time do the read-aloud sessions for kids take place?",
        options: [
          "Mondays and Wednesdays at 10:00 AM",
          "Tuesdays and Thursdays at 10:30 AM",
          "Wednesdays and Fridays at 11:00 AM",
          "Saturdays and Sundays at 2:00 PM",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "R15",
    title: "Part 15: Reading for Information",
    instruction:
      "Read the following article and answer the questions.",
    passage: `CANADA'S TECH STARTUP ECOSYSTEM RANKS AMONG THE WORLD'S BEST

Canada's technology startup sector has seen remarkable growth over the past decade, with Toronto, Vancouver, and Montreal now recognized as top-tier global tech hubs. A new report from the Canadian Venture Capital and Private Equity Association (CVCA) reveals that Canadian startups raised a combined $9.7 billion in venture capital funding last year, a 22 percent increase from the year before.

Toronto's tech corridor, sometimes called "Silicon Valley North," is home to more than 5,200 tech companies and employs approximately 350,000 workers in the Greater Toronto Area alone. The city's strengths lie in artificial intelligence and fintech, driven in part by the presence of the Vector Institute, a world-leading AI research centre co-founded by Geoffrey Hinton.

Vancouver has carved out a niche in video game development, visual effects, and clean technology. Major studios like Electronic Arts and Sony Pictures Imageworks maintain large operations in the city, and the clean-tech sector has attracted over $1.3 billion in investment since 2020. The province of British Columbia offers a 30 percent tax credit for eligible tech companies, making it one of the most attractive jurisdictions in North America.

Montreal, meanwhile, has become a powerhouse in AI research, largely due to the work of Yoshua Bengio and the Mila research institute. The city benefits from relatively low operating costs compared to Toronto and Vancouver, as well as a deep talent pool from four major universities. Quebec's generous R&D tax credits — up to 37.5 percent for small businesses — have attracted companies like Google, Microsoft, and Samsung to establish AI labs there.

Despite these successes, challenges remain. A survey of 400 Canadian startup founders found that 62 percent identified access to late-stage funding as their biggest obstacle, as many companies still turn to U.S. investors for Series B and C rounds. Additionally, 45 percent of respondents cited difficulty retaining senior talent, who are often recruited by larger American firms offering higher salaries.

The federal government's Canada Digital Adoption Program has allocated $4 billion to help small and medium-sized businesses adopt new technologies, and the Strategic Innovation Fund continues to provide grants to high-potential startups.`,
    questions: [
      {
        id: "R15Q1",
        question:
          "How many billions of dollars in investment funding did new Canadian tech companies secure in the most recent year?",
        options: [
          "$6.3",
          "$7.9",
          "$9.7",
          "$11.2",
        ],
        correctAnswer: 2,
      },
      {
        id: "R15Q2",
        question:
          "What percentage of costs can qualifying technology firms in the westernmost province claim back through a provincial incentive?",
        options: ["20%", "25%", "30%", "37.5%"],
        correctAnswer: 2,
      },
      {
        id: "R15Q3",
        question:
          "What challenge did the majority of new business leaders in the survey name as their greatest hurdle?",
        options: [
          "Finding office space",
          "Government regulations",
          "Access to late-stage funding",
          "Hiring entry-level developers",
        ],
        correctAnswer: 2,
      },
      {
        id: "R15Q4",
        question:
          "Which Canadian city has emerged as a leading centre for artificial intelligence, thanks to a prominent research lab?",
        options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correctAnswer: 2,
      },
      {
        id: "R15Q5",
        question:
          "How many billions of dollars has the federal government set aside in its program to help businesses embrace new technology?",
        options: [
          "$1",
          "$2.5",
          "$4",
          "$5",
        ],
        correctAnswer: 2,
      },
      {
        id: "R15Q6",
        question:
          "Roughly how many technology firms operate in the Toronto area?",
        options: [
          "2,500",
          "3,800",
          "5,200",
          "7,000",
        ],
        correctAnswer: 2,
      },
      {
        id: "R15Q7",
        question:
          "What proportion of new company leaders reported trouble keeping experienced employees from leaving?",
        options: [
          "35%",
          "45%",
          "55%",
          "62%",
        ],
        correctAnswer: 1,
      },
      {
        id: "R15Q8",
        question:
          "What is the maximum research and development incentive rate that Quebec provides to smaller enterprises?",
        options: [
          "22%",
          "30%",
          "37.5%",
          "45%",
        ],
        correctAnswer: 2,
      },
      {
        id: "R15Q9",
        question:
          "Approximately how much funding has flowed into the environmentally focused technology industry in Vancouver over recent years?",
        options: [
          "$800 million",
          "$1.3 billion",
          "$2.1 billion",
          "$4 billion",
        ],
        correctAnswer: 1,
      },
    ],
  },
  (() => {
    const passageA = `R16-A — Ryan to Charlie:

Hi Charlie,

Thanks for your message! I'm happy to hear that you made it safe and sound to Albania. I really enjoyed the pictures you sent. Tirana looks like an awesome city! To be honest, when you first told me you were considering Albania, I thought you were joking. I didn't even know where Albania was. I had to ask my trusty friend Google for help. :) After doing some research, I realized that you made the perfect decision! You've always loved being close to mountains and the beach. I guess now you're a short drive from both! I saw some pictures of the mountains there, and it looks like there are lots of small cement bunkers all over the place. Do you know why that is? I guess I should learn more about Albanian history!

Have you made any local friends to show you around yet? I'm sure staying in the dorm will give you a good opportunity to make lots of friends! I lived in the dorm during my first two years of college, and I have so many great memories of those days. Do you eat at the canteen every day, or are there kitchens in the dorm? I read online that there is a fast food called "suflaqe" which is similar to a doner or a souvlaki. Apparently, they only cost about a dollar! If I were you, I'd be eating those 24/7.

Speaking of food, I've recently taken a job as a pizza delivery guy. I gave my notice at the bank two weeks ago and delivered my first pizzas last night. Talk about a drastic change in lifestyle! I've been wearing a tie to work for the past three years, and now I'll be wearing a Domino Pizza shirt. I don't think it'll take me very long to make the transition though because this lifestyle is what I've been wanting for a long time. I'll have a lot more time to myself from now on. Even though the pay is a lot lower, I'll be much happier because I won't have to deal with stressful situations in the bank, and I'll be able to take up some new hobbies. I'm thinking of getting into snowboarding this winter. Skiing would be good too, but I did a lot of skateboarding when I was a kid, so I think snowboarding might be easier for me.

Anyway, I should sign off here. Hope you have a great time getting set up there!

Take care,
Ryan`;

    const passageB = `R16-B — Charlie's Response:

Hey Ryan,

I'm really happy to hear about the recent changes you made in your life! I always knew a white-collar job didn't suit you. You're too creative and independent. Remember in junior high when you started selling M&Ms in math class? I can't believe you made $50 in three days! Mr. Philips was so mad when he realized that everyone in the class was eating M&Ms in class, haha. You've had an entrepreneurial spirit ever since you were a kid, and I'm sure it'll make you rich someday soon!

You're right, Tirana is a perfect spot for me! The weather is so amazing. It's nice waking up every morning with a view of the mountains, yet smelling the warm air from the valley. I've heard about the bunkers in the mountains, but I haven't seen them yet. To be honest, I don't really know much about Albania's history either. I'm sure I'll know more soon though. I'll let you know when I find out.

Yes, I've made several friends here, and they've shown me around the city. The school is in a really nice community with lots of nice shops and restaurants nearby. I've eaten at least one suflaqe every day since being here! You're right, they're super cheap! Even though the cafeteria isn't very expensive, I think it will be even cheaper to cook my own food every day.

My next class starts in five minutes here, so I better run! Talk to you again soon.

Charlie`;

    return {
      id: "R16",
      title: "Part 16: Reading Correspondence",
      instruction:
        "Read the email exchange between two friends and answer the questions. Questions 1–6 are based on the first email (R16-A). Questions 7–11 are based on the response (R16-B).",
      passage: passageA,
      questions: [
        {
          id: "R16Q1",
          question: "Charlie is in Albania to ____.",
          options: ["work", "study", "travel", "start a business"],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "R16Q2",
          question: "Charlie lives ____.",
          options: ["on campus", "off campus", "with a family", "with colleagues"],
          correctAnswer: 0,
          passage: passageA,
        },
        {
          id: "R16Q3",
          question: "When did Ryan stop working at the bank?",
          options: ["Two weeks ago", "Yesterday", "He did not stop working at the bank", "Unknown"],
          correctAnswer: 0,
          passage: passageA,
        },
        {
          id: "R16Q4",
          question: "Ryan wanted more ____.",
          options: ["flexibility", "money", "opportunity", "free time"],
          correctAnswer: 3,
          passage: passageA,
        },
        {
          id: "R16Q5",
          question: "Ryan thinks the job transition will be ____.",
          options: ["difficult", "easy", "stressful", "awkward"],
          correctAnswer: 1,
          passage: passageA,
        },
        {
          id: "R16Q6",
          question: "Ryan's new hobby will be ____.",
          options: ["snowboarding", "skiing", "skateboarding", "sledding"],
          correctAnswer: 0,
          passage: passageA,
        },
        {
          id: "R16Q7",
          question: "Charlie always knew a ____ job didn't suit Ryan.",
          options: ["white-collar", "blue-collar", "trades", "management"],
          correctAnswer: 0,
          passage: passageB,
        },
        {
          id: "R16Q8",
          question: "Ryan has had a/an ____ spirit ever since he was a kid.",
          options: ["wild", "kind-hearted", "entrepreneurial", "greedy"],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R16Q9",
          question: "Charlie enjoys smelling the warm air from the ____.",
          options: ["plateau", "valley", "south", "coast"],
          correctAnswer: 1,
          passage: passageB,
        },
        {
          id: "R16Q10",
          question: "Charlie will let Ryan know about Albanian history when he ____.",
          options: ["uncovers it", "discovers it", "finds out", "gets knowledge"],
          correctAnswer: 2,
          passage: passageB,
        },
        {
          id: "R16Q11",
          question: "Charlie thinks it will be cheaper to ____ every day.",
          options: ["eat out", "dine in", "cook his own food", "order in"],
          correctAnswer: 2,
          passage: passageB,
        },
      ],
    };
  })(),
];
