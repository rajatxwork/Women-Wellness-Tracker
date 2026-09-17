// Extracted from the companion e-book's "Nutrition, Made Simple" chapter.
export type NutritionFood = {
  food: string;
  why: string;
};

export type NutritionGoalCategory = {
  slug: string;
  name: string;
  tagline: string;
  foods: NutritionFood[];
  quickTip?: string;
};

export const NUTRITION_GOAL_CATEGORIES: NutritionGoalCategory[] = [
  {
    slug: "focus-brain",
    name: "Focus & Brain",
    tagline:
      "Your ability to concentrate is not just about willpower — it depends on specific nutrients your brain needs to make its own focus chemicals.",
    foods: [
      {
        food: "Eggs, especially the yolk",
        why: "They contain choline, which your brain directly turns into the chemical responsible for memory and staying on task.",
      },
      {
        food: "Salmon and other fatty fish",
        why: "These give your brain omega-3 fats, basically brain building material, plus they support blood flow to the parts of your brain involved in memory.",
      },
      {
        food: "Chickpeas and salmon",
        why: "Both are great sources of vitamin B6, which helps your brain produce dopamine, your natural motivation and drive chemical.",
      },
      {
        food: "Red meat and lentils",
        why: "These are rich in iron, and low iron is one of the most common, sneaky reasons for brain fog in women specifically, since periods cause regular iron loss.",
      },
      {
        food: "Pumpkin seeds and dark chocolate",
        why: "These bring magnesium, which helps calm an overstimulated, scattered brain so you can actually focus instead of feeling wired and jumpy.",
      },
      {
        food: "Blueberries and dark chocolate",
        why: "These contain natural plant compounds that improve blood flow to memory-centered parts of your brain.",
      },
      {
        food: "Citrus fruits and bell peppers",
        why: "Vitamin C helps your body properly use the iron from plant foods and helps convert your focus chemicals into their active form.",
      },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    tagline:
      "Feeling tired all the time is usually not about needing more coffee — it's usually about your body missing the raw materials it needs to make energy at a cellular level.",
    foods: [
      {
        food: "Red meat, lentils, and spinach",
        why: "Iron carries oxygen through your blood to fuel every cell in your body. If you're constantly tired despite sleeping enough, low iron is worth checking.",
      },
      {
        food: "Whole grains, pork, and legumes",
        why: "These contain B1, one of the very first steps your body takes to turn food into usable energy.",
      },
      {
        food: "Eggs, dairy, and mushrooms",
        why: "Rich in B2 and B5, both directly involved in your body's energy production process.",
      },
      {
        food: "Poultry, tuna, and peanuts",
        why: "These provide niacin, which fuels a molecule your cells use constantly to generate energy.",
      },
      {
        food: "Pumpkin seeds, dark chocolate, and almonds",
        why: "Magnesium is required to actually activate the energy your body produces.",
      },
      {
        food: "Oats, sweet potato, and quinoa",
        why: "These are slow releasing carbohydrates, meaning steady energy for hours instead of a quick spike and crash.",
      },
    ],
    quickTip:
      "If you crash hard in the afternoon, look at what you had earlier — a meal of only fast-digesting carbs with nothing else tends to be the culprit.",
  },
  {
    slug: "bone-joint",
    name: "Bone & Joint Health",
    tagline:
      "This one matters more than most people realize, and starting now genuinely protects you decades down the line.",
    foods: [
      {
        food: "Dairy, fortified plant milk, and leafy greens",
        why: "Calcium is the actual building block of your bones.",
      },
      {
        food: "Fatty fish, egg yolks, and safe sun exposure",
        why: "Vitamin D is what allows your body to actually absorb that calcium — without it, calcium mostly goes to waste.",
      },
      {
        food: "Fermented foods like natto, and leafy greens",
        why: "Vitamin K helps direct calcium into your bones specifically, rather than leaving it to build up elsewhere.",
      },
      {
        food: "Pumpkin seeds and almonds",
        why: "Magnesium supports the cells responsible for actually building new bone tissue.",
      },
      {
        food: "Bone broth and gelatin",
        why: "These provide collagen building blocks that support flexible, healthy joints and cartilage.",
      },
      {
        food: "Salmon, sardines, and chia seeds",
        why: "Omega-3 fats calm down the kind of inflammation that wears joints out over time.",
      },
      {
        food: "Citrus fruits and strawberries",
        why: "Vitamin C is essential for your body to actually build collagen in your tendons and ligaments.",
      },
    ],
  },
  {
    slug: "muscle-recovery",
    name: "Muscle & Recovery",
    tagline:
      "Muscle isn't just about how you look — it protects your metabolism, your joints, and your independence as you get older.",
    foods: [
      {
        food: "Chicken breast, Greek yogurt, eggs, and lentils",
        why: "These are rich in leucine, a specific amino acid that directly tells your body to build muscle.",
      },
      {
        food: "Beef, salmon, and herring",
        why: "These provide natural creatine, which helps regenerate quick energy during strength training.",
      },
      {
        food: "Salmon and walnuts",
        why: "Omega-3 fats help your muscles actually absorb and use the protein you eat, and reduce post-workout soreness.",
      },
      {
        food: "Fortified dairy and egg yolks",
        why: "Vitamin D and calcium work together to help your muscles contract properly and recover well.",
      },
    ],
  },
  {
    slug: "skin-hair-nails",
    name: "Skin, Hair & Nails",
    tagline:
      "Your skin, hair, and nails are made from the same nutrients as everything else in your body — they just show a deficiency faster and more visibly.",
    foods: [
      {
        food: "Bone broth and collagen-rich foods",
        why: "These directly supply the building blocks for skin elasticity.",
      },
      {
        food: "Citrus fruits, bell peppers, and strawberries",
        why: "Vitamin C is required for your body to actually produce collagen, and protects your skin from sun-related damage.",
      },
      {
        food: "Eggs, almonds, and sweet potatoes",
        why: "Biotin supports keratin production, and low biotin is a common, correctable cause of brittle nails.",
      },
      {
        food: "Oysters, beef, and pumpkin seeds",
        why: "Zinc also supports keratin and helps your skin heal faster.",
      },
      {
        food: "Almonds, sunflower seeds, and avocado",
        why: "Vitamin E protects your skin cells and supports healthy, even skin turnover.",
      },
    ],
  },
  {
    slug: "sleep",
    name: "Sleep",
    tagline:
      "Good sleep isn't only about your bedtime routine — it's genuinely influenced by what you eat.",
    foods: [
      {
        food: "Turkey, eggs, and seeds",
        why: "These contain tryptophan, which your body converts into serotonin and then into melatonin, your sleep hormone.",
      },
      {
        food: "Pumpkin seeds, dark chocolate, and spinach",
        why: "Magnesium calms your nervous system and helps reduce waking up in the middle of the night.",
      },
      {
        food: "Bone broth and gelatin",
        why: "These provide glycine, which helps lower your body temperature slightly to help you fall asleep faster.",
      },
      {
        food: "Red meat and lentils",
        why: "Iron plays a role in preventing restless, twitchy legs that can keep you from settling down at night.",
      },
    ],
  },
  {
    slug: "hormones-cycle",
    name: "Hormones & Cycle Support",
    tagline:
      "Your nutritional needs genuinely shift across your cycle, and working with that instead of against it makes a real difference.",
    foods: [
      {
        food: "Healthy carbs, first half of your cycle",
        why: "Your body handles carbohydrates especially efficiently here, so this is a great time to fuel workouts and active days.",
      },
      {
        food: "A bit more food, second half of your cycle",
        why: "Your metabolism actually rises slightly and cravings increase — this is biology, not a lack of willpower. Support it with magnesium and B vitamins.",
      },
      {
        food: "Onions, cooked and cooled potatoes, and apples",
        why: "These feed the healthy gut bacteria that help regulate your circulating hormone levels.",
      },
      {
        food: "Salmon, walnuts, and flaxseed",
        why: "Omega-3s support healthy hormone production overall.",
      },
      {
        food: "Avocado, olive oil, and nuts",
        why: "Your hormones are literally made from fat — don't go too low on healthy fats if you want a stable, regular cycle.",
      },
    ],
  },
  {
    slug: "immune",
    name: "Immune System",
    tagline:
      "Your immune system isn't something you only think about when you're already sick — you can genuinely support it every single day through food.",
    foods: [
      {
        food: "Oysters, beef, and pumpkin seeds",
        why: "Zinc is one of the most important minerals for immune defense and wound healing.",
      },
      {
        food: "Citrus fruits, bell peppers, and strawberries",
        why: "Vitamin C supports your immune cells directly.",
      },
      {
        food: "Fatty fish, egg yolks, and safe sun exposure",
        why: "Vitamin D plays a real role in regulating your immune response, and a lot of people run low, especially in winter.",
      },
      {
        food: "Brazil nuts and tuna",
        why: "Selenium supports your body's natural antioxidant defenses while your immune system is working hard.",
      },
      {
        food: "Garlic, onions, and cruciferous vegetables",
        why: "These contain sulfur compounds that support your body's natural detoxification and immune processes.",
      },
    ],
  },
  {
    slug: "mood",
    name: "Mood",
    tagline:
      "Mood isn't purely psychological — a good portion of it is genuinely chemical, and that chemistry runs on food.",
    foods: [
      {
        food: "Turkey, eggs, and seeds",
        why: "Tryptophan is the direct building block for serotonin, your body's natural mood-stabilizing chemical.",
      },
      {
        food: "Chickpeas, salmon, and poultry",
        why: "Vitamin B6 is a key part of actually producing both serotonin and dopamine.",
      },
      {
        food: "Salmon, walnuts, and flaxseed",
        why: "Omega-3 fats are linked to more stable mood and lower inflammation, which itself is connected to mood.",
      },
      {
        food: "Pumpkin seeds, dark chocolate, and spinach",
        why: "Magnesium has a genuine calming effect on your nervous system and helps buffer your response to stress.",
      },
      {
        food: "Dark leafy greens, lentils, and beans",
        why: "Folate plays a role in producing mood-related brain chemicals; low folate has been linked to low mood in some research.",
      },
    ],
  },
  {
    slug: "digestion-gut",
    name: "Digestion & Gut Health",
    tagline:
      "A happy gut affects way more than just digestion — it actually influences your hormones, your mood, and your immune system too.",
    foods: [
      {
        food: "Onions, cooked and cooled potatoes, and apples",
        why: "These feed your beneficial gut bacteria with fermentable fiber, helping them thrive.",
      },
      {
        food: "Fermented foods like natto and other fermented vegetables",
        why: "These introduce beneficial bacteria directly into your gut.",
      },
      {
        food: "Oats and legumes",
        why: "Rich in soluble fiber, which forms a gentle, gel-like substance that supports regular, comfortable digestion.",
      },
      {
        food: "Bone broth",
        why: "Gentle on digestion and provides amino acids that support the lining of your gut.",
      },
      {
        food: "Water, consistently through the day",
        why: "Fiber needs water to actually work properly — upping your fiber without upping your water can make things worse, not better.",
      },
    ],
  },
  {
    slug: "heart",
    name: "Heart Health",
    tagline:
      "Heart health isn't just a concern for later in life — the habits that protect it are worth building now.",
    foods: [
      {
        food: "Olive oil, avocado, and almonds",
        why: "Unsaturated fats support healthy blood flow and are consistently linked to better heart health outcomes.",
      },
      {
        food: "Salmon, sardines, and mackerel",
        why: "Omega-3 fats specifically support a healthy heart rhythm and help lower inflammation in your blood vessels.",
      },
      {
        food: "Bananas, potatoes, and spinach",
        why: "Potassium helps regulate healthy blood pressure.",
      },
      {
        food: "Oats and legumes",
        why: "The soluble fiber in these foods is linked to healthier cholesterol levels over time.",
      },
      {
        food: "Berries, dark chocolate, and green tea",
        why: "These contain plant compounds that support healthy blood vessels and lower oxidative stress.",
      },
    ],
  },
  {
    slug: "metabolism",
    name: "Metabolism",
    tagline:
      "Your metabolism isn't simply fast or slow forever — it's genuinely influenced by what and how you eat.",
    foods: [
      {
        food: "Iodized salt, seaweed, and dairy",
        why: "Iodine is required to produce your thyroid hormones, and your thyroid largely sets your metabolic rate.",
      },
      {
        food: "Brazil nuts and tuna",
        why: "Selenium helps your body properly convert thyroid hormone into its active, usable form.",
      },
      {
        food: "Chicken breast, eggs, and lentils",
        why: "Adequate protein supports your metabolism because your body burns more energy digesting protein than carbs or fat.",
      },
      {
        food: "Broccoli and whole grains",
        why: "The chromium in these foods supports how effectively your body uses insulin and processes carbohydrates.",
      },
      {
        food: "Regular meals rather than long gaps or skipping",
        why: "Consistently under-eating can actually slow your metabolism down over time.",
      },
    ],
  },
  {
    slug: "period-cramps",
    name: "Period & Cramps",
    tagline:
      "Period pain is common, but that doesn't mean it has to be your normal — nutrition genuinely plays a role here.",
    foods: [
      {
        food: "Pumpkin seeds, dark chocolate, and spinach",
        why: "Magnesium helps relax the uterine muscle itself, directly reducing cramp intensity for a lot of women.",
      },
      {
        food: "Salmon, walnuts, and flaxseed",
        why: "Omega-3 fats help lower the inflammatory compounds partly responsible for period pain.",
      },
      {
        food: "Red meat and lentils",
        why: "Since you lose iron during your period, replenishing it afterward helps prevent extra fatigue.",
      },
      {
        food: "Bananas and potatoes",
        why: "Potassium can help ease bloating by supporting your body's natural fluid balance.",
      },
      {
        food: "Ginger tea",
        why: "Long used to help ease nausea and cramping, with some research supporting its use for period pain specifically.",
      },
    ],
  },
  {
    slug: "long-term-brain",
    name: "Long Term Brain Health",
    tagline:
      "This is less about how you feel today and more about investing in how you think and remember decades from now.",
    foods: [
      {
        food: "Blueberries, blackberries, dark chocolate, and green tea",
        why: "These contain plant compounds that reduce inflammation in the brain over the long run.",
      },
      {
        food: "Eggs, wild-caught fish, lentils, and leafy greens",
        why: "Together these provide B6, folate, and B12, all of which lower a compound linked to long-term cognitive decline.",
      },
      {
        food: "Egg yolks, beef liver, and chicken",
        why: "Choline continues to support memory circuits well beyond your twenties and thirties.",
      },
      {
        food: "Kale, spinach, and egg yolks",
        why: "These contain compounds that build up in your eyes over time and protect your vision as you age.",
      },
      {
        food: "Olive oil, turmeric, and berries",
        why: "These contain plant compounds linked to healthy cellular aging throughout your whole body, brain included.",
      },
    ],
  },
];

export const NUTRITION_SIMPLE_TIPS = [
  "Try to get a protein source into every meal, not just dinner — your body uses protein better when it's spread out across the day.",
  "Pair your carbs with something else. A little protein, fat, or fiber alongside your carbs prevents the energy crash of eating carbs alone.",
  "Do not fear fat — a completely fat-free meal actually blocks your body from absorbing several important vitamins.",
  "Pair iron-rich foods with vitamin C. A squeeze of lemon on spinach meaningfully increases how much iron your body absorbs.",
  "Watch your coffee timing — coffee and tea can block iron and zinc absorption if had during or right after a meal.",
  "Macronutrients matter just as much as micronutrients — getting enough protein, carbs, and fat overall matters as much as vitamins and minerals.",
  "Do not skip meals to save calories — long gaps often lead to overeating later.",
  "Color on your plate is a decent shortcut — different colored fruits and vegetables generally bring different nutrients.",
  "Frozen counts — frozen fruit and vegetables are usually just as nutritious as fresh.",
  "Consistency beats perfection — eating well most of the time matters more than eating perfectly some of the time.",
];
