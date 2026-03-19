import { ReadingPart } from "./celpip-data";

export const madEnglishTask2Parts: ReadingPart[] = [
  // ─── SET 1: Driving Lessons (Ian → Omar) ────────────────────────────────────
  {
    id: "ME-T2-S1",
    title: "Reading to Apply a Diagram – Set 1",
    instruction:
      "Read the following advertisement and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `*** BEST DRIVING LESSONS IN CALGARY ***
BUY 5 LESSONS — GET 1 FREE!

Morning Lessons
9:00 a.m. - 10:00 a.m.
Monday, Wednesday, Friday
Cost: $50

Afternoon Lessons
3:00 p.m. - 4:00 p.m.
Tuesday, Thursday, Saturday
Cost: $60

Evening Lessons
7:00 p.m. - 8:00 p.m.
Monday - Friday
Cost: $75

Special Parking Lesson
10:00 a.m. - 12:00 p.m.
Sunday Only
Cost: $100
(Free with purchase of 10 lessons!)

---

Hi Omar,

I remember you mentioning that Lena is interested in taking some driving lessons. I was getting my car fixed at the shop this morning and saw an ad for driving lessons in your area. You can take individual lessons or buy a bundle and ___ [1]. They offer morning, afternoon, and evening classes. I'm not sure if the ___ [2] classes would work because Lena picks up the kids from school every day, right? The morning classes might work because that's probably after the kids leave for school. Maybe you could ___ [3] on your way to work? Evening classes would probably work the best, but they ___ [4]. They also offer a parking class on Sunday morning which I think would be really helpful for her. It ___ [5]. Anyway, I'm sure it'll be great to have two drivers on your next family trip! Sarah and I were thinking of having you guys over for dinner next week sometime. What hours do you work at your new job?

All the best,
Ian`,
    questions: [
      {
        id: "ME-T2-S1-Q1",
        question: "You can take individual lessons or buy a bundle and ___.",
        options: [
          "get a discount.",
          "get a free lesson.",
          "get a free lunch.",
          "use the car to take your test.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S1-Q2",
        question:
          "I'm not sure if the ___ classes would work because Lena picks up the kids from school every day.",
        options: ["morning.", "afternoon.", "evening."],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S1-Q3",
        question: "Maybe you could ___ on your way to work?",
        options: [
          "drop her off.",
          "pick her up.",
          "pick up the kids.",
          "save time.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S1-Q4",
        question: "Evening classes would probably work the best, but they ___.",
        options: [
          "are the cheapest.",
          "don't have a discount.",
          "are sold out.",
          "are the most expensive.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S1-Q5",
        question:
          "They also offer a parking class on Sunday morning which I think would be really helpful for her. It ___.",
        options: [
          "costs $75.",
          "only lasts for an hour.",
          "is free if you buy 10 lessons.",
          "is on sale.",
        ],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S1-Q6",
        question: "Lena is Omar's ___.",
        options: ["baby sitter.", "cook.", "wife.", "sister."],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S1-Q7",
        question: "Ian and Omar are ___.",
        options: ["coworkers.", "friends.", "neighbours.", "acquaintances."],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S1-Q8",
        question: "Ian thinks Lena should ___.",
        options: [
          "pick up the kids.",
          "drop off the kids.",
          "take the parking class.",
          "take afternoon lessons.",
        ],
        correctAnswer: 2,
      },
    ],
  },

  // ─── SET 2: Birthday Cakes (Mom → Chloe) ────────────────────────────────────
  {
    id: "ME-T2-S2",
    title: "Reading to Apply a Diagram – Set 2",
    instruction:
      "Read the following recipe list and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `Birthday Cake Recipes

Raspberry Cheesecake
Servings: 10
Ingredients: cream cheese, raspberries, graham crackers, sugar, eggs

Black Forest Cake
Servings: 14
Ingredients: cocoa powder, sugar, eggs, cherries, oil, whipping cream, flour, chocolate flakes

Dairy Queen Ice Cream Cake
Servings: 12
Ingredients: chocolate ice cream, vanilla icing, smarties

Banana Nut Cupcakes
Servings: 24
Ingredients: bananas, walnuts, sugar, eggs, flour, icing

---

Dear Chloe,

I hope your first week in Germany has gone well! It's sad that you will be gone for Arlene's birthday party next weekend. Today I bought balloons and birthday candles for the party. Arlene has invited 12 of her friends, but two of them might not be able to make it. We were going to have the party outdoors, but the forecast is for snow, so I guess we'll just stay inside to keep warm. Anyway, since you've helped me make her birthday cake for the past 16 years, I thought I would write you an email asking for your input. I'm thinking of switching things up a bit this year instead of just making the same chocolate cake we always do. I'm looking at some different recipes here.

The first option I was considering is making a raspberry cheesecake. The raspberries in our garden are looking great! My only concern with the recipe is that ___ [1]. Another option I was thinking of is a Black Forest cake. It would definitely be big enough for everyone to get a piece, but ___ [2]. Arlene loves ice cream so I was thinking of ordering a custom-designed ice cream cake from Dairy Queen. My only concern with that option is that ___ [3]. The last option I was considering is making banana nut cupcakes. I know they're not ___ [4], but the recipe makes two dozen, so that would be enough for everyone to get seconds if they want. The only problem with this option is that ___ [5].

Do you know if her friends have any dietary restrictions? Anyway, I hope you're making some friends on campus there. I hope we can Skype soon.

Love,
Mom`,
    questions: [
      {
        id: "ME-T2-S2-Q1",
        question:
          "The raspberries in our garden are looking great! My only concern with the recipe is that ___.",
        options: [
          "Arlene's friend is allergic to dairy.",
          "there won't be enough raspberries for the cake.",
          "there might not be enough cake for everyone.",
          "Arlene doesn't like cheesecake.",
        ],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S2-Q2",
        question:
          "It would definitely be big enough for everyone to get a piece, but ___.",
        options: [
          "it would be too unhealthy.",
          "there wouldn't be enough for seconds.",
          "it would not go well with ice cream.",
          "it doesn't look like a birthday cake.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S2-Q3",
        question:
          "Arlene loves ice cream so I was thinking of ordering a custom-designed ice cream cake from Dairy Queen. My only concern with that option is that ___.",
        options: [
          "it would be too expensive.",
          "they might spell her name wrong on the cake.",
          "it might melt on the drive home.",
          "it might be too chilly that day to eat an ice-cold cake.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S2-Q4",
        question:
          "I know they're not ___, but the recipe makes two dozen, so that would be enough for everyone to get seconds if they want.",
        options: [
          "a traditional-looking birthday cake.",
          "healthy.",
          "easy to make.",
          "big enough to satisfy someone.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S2-Q5",
        question: "The only problem with this option is that ___.",
        options: [
          "cupcakes take too long to make.",
          "some people are allergic to nuts.",
          "they might burn in the oven.",
          "they are too boring for a party.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S2-Q6",
        question: "Chloe and Arlene are ___.",
        options: ["friends.", "classmates.", "sisters.", "cousins."],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S2-Q7",
        question: "Chloe is a ___.",
        options: ["party planner.", "student.", "chef.", "tourist."],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S2-Q8",
        question: "Chloe and her mom ___.",
        options: [
          "always make Arlene's cake together.",
          "always buy a cake from Dairy Queen.",
          "pick raspberries together.",
          "like traveling together.",
        ],
        correctAnswer: 0,
      },
    ],
  },

  // ─── SET 3: Bank Accounts (Sam → Jared) ─────────────────────────────────────
  {
    id: "ME-T2-S3",
    title: "Reading to Apply a Diagram – Set 3",
    instruction:
      "Read the following bank account information and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `Bank Account Options

Simple Checking Account
Monthly fee: $5.99
Earns interest: no
Monthly transactions: 15
Overdraft protection: $500

Student Checking Account
Monthly fee: free
Earns interest: no
ATM fees: $1.50/transaction
Minimum balance: $100

Convenience Checking
Monthly fee: $9.99
Earns interest: 1.5%
Monthly transactions: 25
Minimum balance: $3,000

Premier Checking
Monthly fee: $19.99
Earns interest: 1.5%
Unlimited transactions
No ATM fees when traveling
Free Travel Plus Credit Card

---

Hi Jared,

Thanks for your email! It's great to hear that you've arrived in Canada. I hope everything goes smoothly as you get set up here. To answer your question, I'm not actually sure which bank account would be best for you. It depends on what you're planning to do. You probably don't have a lot of money left after your move, so I would recommend getting an account with ___ [1].

You mentioned the possibility of going to school, right? If that is the case, a student account would be good because there is no monthly fee. The downside, though, is that ___ [2]. Do you go to the bank quite often? Another problem with the student account is that you have ___ [3]. The simple checking account, on the other hand, gives you 15 free transactions per month. Also, if you run into financial problems, you ___ [4].

If you're going to get a job, then paying a monthly fee won't be a problem for you. In that case, I would recommend the convenience checking account. The premier checking account wouldn't really give you any added benefits unless you want to ___ [5].

Anyway, let me know if you need any more help getting set up! Take care,
Sam`,
    questions: [
      {
        id: "ME-T2-S3-Q1",
        question:
          "You probably don't have a lot of money left after your move, so I would recommend getting an account with ___.",
        options: [
          "no earned interest.",
          "no monthly fee.",
          "no overdraft protection.",
          "no travel benefits.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S3-Q2",
        question:
          "A student account would be good because there is no monthly fee. The downside, though, is that ___.",
        options: [
          "you have to keep at least $100 in your account.",
          "the interest is low.",
          "you have overdraft protection.",
          "you won't be able to travel.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S3-Q3",
        question:
          "Another problem with the student account is that you have ___.",
        options: [
          "to pay a monthly fee.",
          "overdraft protection.",
          "limited transactions.",
          "to pay for every transaction.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S3-Q4",
        question:
          "The simple checking account gives you 15 free transactions per month. Also, if you run into financial problems, you ___.",
        options: [
          "will still earn interest on your balance.",
          "can have the monthly fee waived.",
          "have $500 of overdraft protection if you need it.",
          "can open a savings account.",
        ],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S3-Q5",
        question:
          "The premier checking account wouldn't really give you any added benefits unless you want to ___.",
        options: [
          "earn more interest.",
          "maintain a large balance.",
          "have overdraft protection.",
          "travel.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S3-Q6",
        question: "Jared initially wrote Sam ___.",
        options: [
          "asking for advice.",
          "explaining a problem.",
          "giving advice about bank accounts.",
          "asking for a job.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S3-Q7",
        question: "Sam ___.",
        options: [
          "thinks Jared will go to school.",
          "thinks Jared will find a job.",
          "is not eager to help Jared.",
          "is unsure what Jared will do.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S3-Q8",
        question: "Sam thinks ___.",
        options: [
          "Jared is rich.",
          "Jared doesn't have much money.",
          "Jared made a bad decision.",
          "Jared should get the premium checking account.",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // ─── SET 4: Markland Polytechnic (Julie → Anne) ──────────────────────────────
  {
    id: "ME-T2-S4",
    title: "Reading to Apply a Diagram – Set 4",
    instruction:
      "Read the following college program information and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `Find the right career at Markland Polytechnic!

Massage Therapy
Duration: 16 months
Tuition: $7,000
Average Salary: $45,000/year
Class size: 25

Hairdressing
Duration: 12 months
Tuition: $5,000
Average Salary: $35,000/year
Class size: 15

Photography
Duration: 6 months
Tuition: $3,000
Average Salary: $25,000/year
Class size: online study

---

Hi Anne!

I just saw this poster on a bulletin board and thought I should send it to you! Have you thought anymore about what your next step is going to be? Last time we spoke, you were considering hitting Europe for a few months. That would be awesome! I guess travelling has its pros and cons. Being broke at the end of the trip is probably ___ [1]. You might want to save up a bit before you travel. I think doing a short course like one of these would be a great way to get a job and save up!

You would make a great hairdresser! Remember when we were kids and I would come over to your house to play with dolls? You always wanted to give the dolls ___ [2]. I think you would be great at massage therapy too. The downside with that option is that the course is longer, it costs more money, and ___ [3]. I think class size makes a big difference. I remember one of my university classes had 100 people! It was hard to make friends, so I would definitely recommend small class sizes!

If you want to travel, photography might be a great thing to learn! The advantage it has over hairdressing is that the program is shorter and ___ [4]. The problem with the photography option is that it's just online, and you wouldn't get any hands-on experience with an instructor. Another issue is that ___ [5].

Anyway, let me know what your thoughts are!

Julie`,
    questions: [
      {
        id: "ME-T2-S4-Q1",
        question: "Being broke at the end of the trip is probably ___.",
        options: [
          "the biggest pro.",
          "the biggest con.",
          "not going to happen.",
          "not that bad.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S4-Q2",
        question:
          "Remember when we were kids and I would come over to your house to play with dolls? You always wanted to give the dolls ___.",
        options: [
          "fancy clothes.",
          "fancy hairstyles.",
          "a manicure.",
          "a pedicure.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S4-Q3",
        question:
          "The downside with that option is that the course is longer, it costs more money, and ___.",
        options: [
          "the salary is higher.",
          "the classes are smaller.",
          "the class size is bigger.",
          "there is no vacation time.",
        ],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S4-Q4",
        question:
          "The advantage photography has over hairdressing is that the program is shorter and ___.",
        options: [
          "the salary is higher.",
          "the salary is lower.",
          "the tuition is higher.",
          "the tuition is lower.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S4-Q5",
        question:
          "The problem with the photography option is that it's just online. Another issue is that ___.",
        options: [
          "the salary is much lower than the other options.",
          "the course takes less time.",
          "the tuition is lower than the other options.",
          "you don't really need to take photos while you travel.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S4-Q6",
        question: "Markland Polytechnic is a ___.",
        options: [
          "post-secondary institution.",
          "recruitment agency.",
          "company.",
          "online forum.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S4-Q7",
        question: "Julie and Anne are ___.",
        options: [
          "classmates.",
          "childhood friends.",
          "acquaintances.",
          "sisters.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S4-Q8",
        question: "Julie thinks ___.",
        options: [
          "money is important.",
          "the length of study is important.",
          "Anne should go traveling instead.",
          "class sizes are important.",
        ],
        correctAnswer: 3,
      },
    ],
  },

  // ─── SET 5: Vancouver University Sports (Raymond → Paula) ────────────────────
  {
    id: "ME-T2-S5",
    title: "Reading to Apply a Diagram – Set 5",
    instruction:
      "Read the following sports club information and email. Then fill in each blank with the best word or phrase, or answer the question.",
    passage: `VANCOUVER UNIVERSITY
Join the Club!

Hockey
Season: Oct. – Apr.
Cost: $400
Games: 20 games
Team size: 20

Skiing
Season: Sept. – Apr.
Cost: $600
Schedule: One weekend per month
Group size: 30

Curling
Season: Sept. – Mar.
Cost: $200
Games: 24 games
Team size: 4

---

Hi Paula!

It was great to meet you during the ice-breaker activities last weekend! I hope your classes are off to a good start. You mentioned wanting to get involved in some extra-curricular activities. I think that would be a great way to make the most of your exchange semester! I just saw this poster in the gym and thought I would send it to you. It provides some options for sports this winter.

I think it would be a great experience for you to get involved in some cold-weather activities while you're here in Canada. You probably don't have winter sports back in Brazil, right? Don't worry if you don't know anything about these sports! They're just for recreation which means they're not too ___ [1].

Hockey is pretty much the most Canadian thing you could do, but ___ [2]. Skiing would be really awesome because you would go with a big group once a month. The only downside is that ___ [3]. That being said, ___ [4]. Do you know what curling is? It looks like a pretty boring sport, but it's actually a lot of fun! It is definitely ___ [5].

Anyway, let me know if you want to join one of these activities, and I could probably sign up with you!

All the best,
Raymond`,
    questions: [
      {
        id: "ME-T2-S5-Q1",
        question:
          "They're just for recreation which means they're not too ___.",
        options: [
          "expensive.",
          "competitive.",
          "difficult to learn.",
          "much fun.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S5-Q2",
        question:
          "Hockey is pretty much the most Canadian thing you could do, but ___.",
        options: [
          "you would need to learn how to skate.",
          "it is the most expensive.",
          "the rules are hard to learn.",
          "it's not much fun.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S5-Q3",
        question:
          "Skiing would be really awesome because you would go with a big group once a month. The only downside is that ___.",
        options: [
          "you might be too busy to do that.",
          "you might not like it.",
          "there might be too much snow.",
          "it's the most expensive option.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S5-Q4",
        question: "That being said, ___.",
        options: [
          "you can definitely afford it.",
          "you get a free lunch when you go skiing.",
          "it has a longer season than the other options.",
          "skiing is too dangerous.",
        ],
        correctAnswer: 2,
      },
      {
        id: "ME-T2-S5-Q5",
        question:
          "It looks like a pretty boring sport, but it's actually a lot of fun! It is definitely ___.",
        options: [
          "the most expensive option.",
          "the cheapest option.",
          "not worth it.",
          "too hard to learn.",
        ],
        correctAnswer: 1,
      },
      {
        id: "ME-T2-S5-Q6",
        question: "Raymond is trying to ___.",
        options: [
          "flirt with Paula.",
          "discourage her from winter activities.",
          "find a study partner.",
          "help her get involved in extra-curricular activities.",
        ],
        correctAnswer: 3,
      },
      {
        id: "ME-T2-S5-Q7",
        question: "Raymond thinks Paula ___.",
        options: [
          "is not used to cold weather.",
          "wants to be his girlfriend.",
          "will not have enough time for activities.",
          "is poor.",
        ],
        correctAnswer: 0,
      },
      {
        id: "ME-T2-S5-Q8",
        question: "Raymond is offering to ___.",
        options: [
          "pay for the cost.",
          "teach her how to skate.",
          "join her in the activity.",
          "be her study partner.",
        ],
        correctAnswer: 2,
      },
    ],
  },
];
