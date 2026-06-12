const defaultRecipes = [
  {
    id: "fire-street-tacos",
    title: "Fire Street Tacos 🌮",
    category: "Mexican",
    spiceLevel: 3,
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    source: "Imported via TikTok 🎥",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    ingredients: [
      "1.5 lbs Flank steak or Skirt steak",
      "2 tbsp Soy sauce",
      "1 lime (juiced)",
      "2 cloves Garlic (minced)",
      "1 tsp Chili powder",
      "1 tsp Cumin",
      "12 small Corn tortillas",
      "1 small White onion (diced)",
      "1/2 cup Fresh cilantro (chopped)",
      "2 Jalapeño peppers (sliced)",
      "Lime wedges & hot salsa for serving"
    ],
    instructions: [
      "In a bowl, mix soy sauce, lime juice, minced garlic, chili powder, and cumin. Marinate the steak for at least 30 minutes.",
      "Heat a large skillet or grill pan over high heat. Sear the steak for 4-5 minutes per side until charred on the outside and medium-rare inside.",
      "Let the steak rest for 5 minutes, then slice thinly against the grain and chop into small bite-sized pieces.",
      "Warm the corn tortillas on a dry skillet until soft and slightly charred.",
      "Assemble tacos with double tortillas, a generous scoop of steak, diced onions, chopped cilantro, and fresh jalapeño slices.",
      "Serve hot with lime wedges and a drizzle of spicy salsa!"
    ]
  },
  {
    id: "chocolate-lava-cake",
    title: "Perfect Lava Cake 🍰",
    category: "Sweet Treats",
    spiceLevel: 0,
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    source: "Grandma's Secret Notes 📝",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    ingredients: [
      "4 oz High-quality semi-sweet chocolate",
      "1/2 cup Unsalted butter",
      "2 whole Eggs + 2 Egg yolks",
      "1/4 cup Granulated sugar",
      "1/8 tsp Salt",
      "2 tbsp All-purpose flour",
      "Powdered sugar & fresh raspberries for garnish",
      "Vanilla ice cream (optional but highly recommended!)"
    ],
    instructions: [
      "Preheat your oven to 425°F (218°C). Grease two 6-ounce ramekins with butter and dust lightly with cocoa powder or flour.",
      "Melt the chocolate and butter together in a microwave-safe bowl in 20-second increments, stirring until completely smooth.",
      "In a separate bowl, whisk the whole eggs, egg yolks, granulated sugar, and salt together until pale and slightly thickened.",
      "Gently fold the melted chocolate mixture and the flour into the whisked eggs until just combined. Do not overmix.",
      "Divide the batter evenly between the two prepared ramekins.",
      "Bake for 12-14 minutes. The edges should be firm and set, but the center should still jiggle slightly.",
      "Let cool for 1 minute, invert onto dessert plates, dust with powdered sugar, and serve immediately with vanilla ice cream."
    ]
  },
  {
    id: "garlic-butter-salmon",
    title: "Zesty Butter Salmon 🥗",
    category: "Healthy",
    spiceLevel: 1,
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    source: "Gordon Ramsay YouTube Video 📺",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    ingredients: [
      "2 Salmon fillets (skin-on)",
      "2 tbsp Butter",
      "3 cloves Garlic (minced)",
      "1 tbsp Honey",
      "1 Lemon (sliced + juice of half)",
      "1/2 tsp Paprika",
      "Salt & freshly cracked black pepper",
      "Fresh parsley (chopped for garnish)"
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels. Season both sides with salt, black pepper, and paprika.",
      "Melt butter in a skillet over medium-high heat. Add the salmon fillets skin-side down.",
      "Sear for 5-6 minutes until the skin is crispy, then flip and cook for another 3-4 minutes.",
      "Reduce heat to medium. Toss in the minced garlic, honey, lemon juice, and lemon slices.",
      "Spoon the garlic butter pan juices over the salmon fillets continuously for 2 minutes to baste.",
      "Garnish with chopped fresh parsley and serve hot alongside roasted asparagus or salad."
    ]
  },
  {
    id: "grandmas-lasagna",
    title: "Secret Lasagna 🍝",
    category: "Italian",
    spiceLevel: 0,
    prepTime: 30,
    cookTime: 60,
    servings: 8,
    source: "Family Recipe Box 🗃️",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80",
    ingredients: [
      "1 lb Sweet Italian sausage",
      "3/4 lb Lean ground beef",
      "1/2 cup Minced onion",
      "2 cloves Garlic (crushed)",
      "1 can (28 oz) Crushed tomatoes",
      "2 cans (6 oz) Tomato paste",
      "2 cans (6.5 oz) Canned tomato sauce",
      "1/2 cup Water",
      "2 tbsp White sugar",
      "1.5 tsp Dried basil leaves",
      "1.5 tsp Salt",
      "12 Lasagna noodles",
      "16 oz Ricotta cheese",
      "1 egg",
      "3/4 lb Mozzarella cheese (sliced or shredded)",
      "3/4 cup Grated Parmesan cheese"
    ],
    instructions: [
      "In a large Dutch oven, cook sausage, ground beef, onion, and garlic over medium heat until well browned. Stir in crushed tomatoes, tomato paste, tomato sauce, and water.",
      "Season the meat sauce with sugar, basil, and salt. Simmer covered for about 1.5 hours, stirring occasionally.",
      "Boil lasagna noodles in salted water for 8-10 minutes, drain, and rinse with cold water.",
      "In a medium bowl, combine ricotta cheese with the egg and a pinch of salt.",
      "To assemble, spread 1.5 cups of meat sauce in the bottom of a 9x13 inch baking dish. Arrange 6 noodles lengthwise over meat sauce. Spread half of the ricotta cheese mixture over noodles. Top with a third of mozzarella cheese slices.",
      "Spoon 1.5 cups meat sauce over mozzarella, and sprinkle with 1/4 cup Parmesan cheese. Repeat layers (noodles, ricotta, mozzarella, sauce, Parmesan). Top with remaining mozzarella and Parmesan.",
      "Cover with foil (spray foil with cooking spray to avoid sticking) and bake at 375°F (190°C) for 25 minutes. Remove foil and bake an additional 25 minutes until bubbly and golden."
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = defaultRecipes;
}
