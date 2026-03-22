import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  navy:"#2c3e50",navyDeep:"#0f1923",navyMid:"#1e2f3d",slate:"#5b7a99",slateLight:"#8aadc4",slatePale:"#dce8f0",
  sage:"#6b8f71",sageDark:"#4a6b50",sagePale:"#d4e6d6",sageLight:"#a8c9ab",
  cream:"#f5f2ec",creamDeep:"#ece7dd",stone:"#c8bfb0",text:"#2a2a2a",textMid:"#5a5a5a",textLight:"#8a8a8a",white:"#ffffff",
  warn:"#c4763a",warnPale:"#f5e6d4",gold:"#c8b89a",goldLight:"#e2d9cc",
};
const FD="'Inter','Segoe UI',system-ui,-apple-system,sans-serif";
const FB="'Inter','Segoe UI',system-ui,-apple-system,sans-serif";

const RECIPES=[
  {id:1,name:"Flounder Primavera",category:"Fish & Seafood",cookTime:35,calories:210,fat:9,protein:28,carbs:7,serves:"2",planAhead:false,perishable:["flounder","celery","parsley"],ingredients:["flounder","onion","celery","garlic","canned tomatoes","parsley","white wine","parmesan","olive oil"],directions:["Sauté onion, celery, and garlic in olive oil until tender.","Add tomatoes, parsley, wine, salt and pepper. Simmer 5 minutes.","Lightly grease an 8-inch square pan. Arrange fillets in a single layer.","Broil 4 to 6 inches from heat for 7 to 8 minutes.","Pour vegetable mixture over fish; sprinkle with Parmesan.","Broil 2 to 3 minutes or until cheese lightly browns."],note:"Active ~20 min. Sauté + simmer + broil.",image:""},
  {id:2,name:"Maryland Crabcakes",category:"Fish & Seafood",cookTime:90,calories:230,fat:11,protein:18,carbs:14,serves:"2",planAhead:true,perishable:["lump crabmeat","parsley"],ingredients:["lump crabmeat","bread crumbs","milk","egg yolk","mayonnaise","parsley","onion","butter"],directions:["Place crabmeat in a bowl. Cover with crumbs. Moisten with milk.","Combine beaten egg yolk with mayonnaise. Add baking powder, parsley, onion, salt and pepper.","Pour over crab mixture. Toss lightly until well mixed.","Form into 2 to 3 crabcakes. Refrigerate at least one hour.","Dredge lightly in flour. Fry crabcakes in butter until golden.","Drain on paper towels and serve."],note:"1 hr chilling required before frying.",image:""},
  {id:3,name:"Flounder Fillets with Wine Sauce",category:"Fish & Seafood",cookTime:30,calories:295,fat:12,protein:34,carbs:12,serves:"2",planAhead:false,perishable:["flounder","mushrooms","tomato","parsley","scallions"],ingredients:["flounder","flour","butter","mushrooms","tomato","parsley","scallions","cream","white wine"],directions:["Combine flour, salt and pepper. Roll fillets in flour.","Pan-fry in butter at 350°F for 3 to 5 minutes per side until fillets flake easily.","Place fillets on a warm plate. Add mushrooms, tomato, parsley and scallions to pan.","Stir in flour and cook for a minute. Add cream, wine and garlic powder.","Cook 2 to 3 minutes until sauce is slightly thickened. Pour over fillets."],note:"~25 min active. Pan-fry + sauce.",image:""},
  {id:4,name:"Tuscany-Style Baked Fish",category:"Fish & Seafood",cookTime:25,calories:175,fat:5,protein:28,carbs:6,serves:"2",planAhead:false,perishable:["cod","parsley"],ingredients:["cod","onion","garlic","thyme","canned tomatoes","parsley","olive oil"],directions:["Spray a small ovenproof dish with cooking spray.","Arrange onion and garlic in a shallow layer. Sprinkle with thyme.","Arrange fish on top. Wipe lightly with olive oil and sprinkle with lemon juice.","Bake uncovered at 475°F for 6 to 8 minutes.","Drain and chop tomatoes. Add parsley, salt, pepper and red pepper flakes.","Spoon tomato mixture over fish. Bake until fish flakes easily."],note:"Very quick. ~10 min prep + ~15 min bake.",image:""},
  {id:5,name:"Baked Fish Fillets",category:"Fish & Seafood",cookTime:30,calories:290,fat:14,protein:34,carbs:8,serves:"2",planAhead:false,perishable:["fish fillets","mushrooms"],ingredients:["fish fillets","mushrooms","white wine","lemon juice","monterey jack cheese","bread crumbs","butter"],directions:["Grease a small baking dish with butter. Sprinkle mushrooms over the bottom.","Arrange fish fillets over the mushrooms.","Season fish, sprinkle wine and lemon juice over all.","Top with cheese and bread crumbs and pour melted butter over all.","Lay wet waxed paper directly on fish. Bake at 400°F for 7 minutes.","Remove waxed paper and bake 5 minutes longer."],note:"~10 min prep + 12 min bake.",image:""},
  {id:6,name:"Tuscan Shellfish Stew",category:"Fish & Seafood",cookTime:45,calories:220,fat:6,protein:28,carbs:12,serves:"2",planAhead:false,perishable:["shrimp","clams","mussels","celery","parsley","mushrooms"],ingredients:["shrimp","clams","mussels","onion","garlic","olive oil","vegetable juice","white wine","celery","carrot","mushrooms","parsley"],directions:["Combine onion, garlic and olive oil in a stockpot.","Cook over moderate heat until onion is soft.","Add water, juice, wine, celery, carrot and seasonings. Cover and simmer 15 minutes.","Add seafood and mushrooms. Reheat to a simmer.","Cover and cook 5 to 10 minutes until shrimp is opaque and clams have opened.","Sprinkle with parsley. Serve with lemon wedges."],note:"~15 min prep + 30 min simmer.",image:""},
  {id:7,name:"Tangy Baked Turbot",category:"Fish & Seafood",cookTime:25,calories:195,fat:3,protein:28,carbs:14,serves:"2",planAhead:false,perishable:["turbot"],ingredients:["turbot","plain yogurt","lemon juice","cornstarch","bread crumbs"],directions:["Place fillets on a greased small baking dish.","Mix yogurt, lemon juice, cornstarch, salt and pepper.","Spread yogurt mixture over fillets.","Sprinkle bread crumbs over yogurt.","Bake at 450°F, ten minutes per inch of thickness, until fish flakes easily."],note:"~10 min prep + 15 min bake.",image:""},
  {id:8,name:"Shrimp Bake",category:"Fish & Seafood",cookTime:55,calories:370,fat:10,protein:22,carbs:48,serves:"2",planAhead:false,perishable:["shrimp","green pepper"],ingredients:["shrimp","green pepper","onion","butter","cream of mushroom soup","lemon juice","rice","cheddar cheese"],directions:["Sauté green pepper and onion in butter until soft.","Add mushroom soup, lemon juice, dry mustard, Worcestershire sauce and pepper.","Add cooked rice and shrimp. Mix together.","Put in a small casserole dish. Sprinkle cheddar cheese over top.","Cover and bake 30 minutes. Uncover until cheese is melted."],note:"~15 min stovetop + ~40 min bake. Rice included.",image:""},
  {id:9,name:"Old Bay Seafood Pasta Salad",category:"Fish & Seafood",cookTime:45,calories:340,fat:10,protein:16,carbs:46,serves:"2",planAhead:true,perishable:["celery"],ingredients:["imitation crabmeat","macaroni","celery","red onion","old bay seasoning","mayonnaise","red wine vinegar"],directions:["Cook macaroni twists in salted boiling water until just tender.","Drain and rinse well in cold water.","Add crabmeat, celery, red onion and all seasonings.","Add vinegar and mayonnaise. Mix well.","Chill several hours before serving."],note:"~20 min cook + chill time. Best made ahead.",image:""},
  {id:10,name:"Chicken Breasts Stuffed with Spinach and Mushrooms",category:"Poultry",cookTime:60,calories:380,fat:18,protein:42,carbs:8,serves:"2",planAhead:false,perishable:["spinach","mushrooms","parsley"],ingredients:["chicken breast","spinach","mushrooms","onion","garlic","nutmeg","butter","truffle olive oil","tomato puree","parsley"],directions:["Preheat oven to 425°F. Pound chicken breasts flat between waxed paper.","Cook spinach until wilted. Drain, cool and chop coarsely.","Heat butter in a small skillet and add mushrooms. Cook until liquid evaporates.","Add spinach, half the onion, garlic, nutmeg, salt and pepper. Cook and let cool.","Spoon filling onto each breast. Fold edges over to enclose. Place seam side down in baking dish.","Brush with butter and truffle oil. Scatter remaining onion over breasts.","Cook on stove 1 minute, then bake 10 minutes. Baste.","Spoon tomato purée around breasts. Bake 10 minutes more. Sprinkle with parsley."],note:"~30 min prep + ~25 min bake. Use truffle oil for best flavor.",image:""},
  {id:11,name:"Kung Pao Chicken",category:"Poultry",cookTime:30,calories:490,fat:12,protein:38,carbs:56,serves:"2",planAhead:false,perishable:["green onion"],ingredients:["chicken breast","cornstarch","olive oil","green onion","garlic","red pepper","ginger","peanuts","soy sauce","wine vinegar","rice"],directions:["Mix together wine vinegar, soy sauce, and sugar; set aside.","Coat chicken with cornstarch.","Heat oil in a skillet or wok. Add chicken and stir-fry 5 to 7 minutes until cooked.","Remove chicken. Add onion, garlic, red pepper, and ginger. Stir-fry 15 seconds.","Add vinegar mixture and chicken, stirring to coat.","Mix in peanuts and serve over rice."],note:"~15 min prep + ~15 min cook. Rice included.",image:""},
  {id:12,name:"Chicken Artichoke Medley",category:"Poultry",cookTime:50,calories:310,fat:10,protein:36,carbs:14,serves:"2",planAhead:false,perishable:["mushrooms","carrot"],ingredients:["chicken breast","butter","artichoke hearts","mushrooms","carrot","chicken broth","white wine","lemon juice","cornstarch","tarragon"],directions:["Pound chicken breasts to 1/4-inch thickness.","Brown chicken in butter on both sides. Transfer to a small baking dish and top with artichoke hearts.","Add mushrooms and carrot to pan; cook 4 minutes.","Add broth and wine and heat to boiling.","Mix lemon juice and cornstarch; stir into vegetable mixture and cook until thick.","Add salt, tarragon and red pepper. Spoon sauce over chicken.","Bake at 350°F for 20 minutes."],note:"~15 min stovetop + 20 min bake.",image:""},
  {id:13,name:"Marinated Spanish Chicken",category:"Poultry",cookTime:90,calories:420,fat:22,protein:38,carbs:8,serves:"2",planAhead:true,perishable:["green pepper"],ingredients:["chicken thighs","tomato sauce","rose wine","olive oil","onion","green pepper","garlic","thyme","paprika"],directions:["Shake flour in an oven cooking bag; place in a baking dish.","Add tomato sauce, wine, oil, onion, green pepper, bouillon, thyme, garlic and peppers. Squeeze to blend.","Season chicken with salt, pepper and paprika. Place in bag and close.","Marinate in refrigerator 3 to 4 hours or overnight, turning several times.","Arrange chicken in single layer with meatiest parts toward edge.","Make a few slits in top of bag. Bake at 350°F for about 1 hour or until tender."],note:"3 to 4 hr marinate (not counted) + ~70 min bake.",image:""},
  {id:14,name:"Dijon-Marinated Grilled Chicken Breasts",category:"Poultry",cookTime:30,calories:260,fat:12,protein:34,carbs:2,serves:"2",planAhead:true,perishable:["green onions"],ingredients:["chicken breast","green onions","olive oil","white wine vinegar","dijon mustard","garlic"],directions:["Combine all marinade ingredients in a plastic resealable bag.","Add chicken and turn to coat. Seal bag.","Refrigerate 2 to 6 hours, turning occasionally.","Grill chicken until cooked through, about 6 to 8 minutes per side."],note:"2 to 6 hr marinate (not counted) + ~15 min grill.",image:""},
  {id:15,name:"Marinated Pork Chops with Peanut Sauce",category:"Meat",cookTime:55,calories:520,fat:32,protein:40,carbs:10,serves:"2",planAhead:true,perishable:[],ingredients:["pork chops","onion","olive oil","lemon juice","soy sauce","rum","ginger","garlic","peanut butter","heavy cream"],directions:["Combine onion, oil, lemon juice, soy sauce, rum, sugar, gingerroot, garlic, pepper flakes and salt.","Add pork chops, turning to coat. Marinate covered in fridge at least 6 hours or overnight.","Drain chops, reserving marinade.","Grill or broil chops, basting with some marinade, about 20 minutes per side until cooked through.","In a small saucepan, bring remaining marinade to a boil. Add peanut butter and whisk until smooth.","Stir in cream and heat until smooth. Serve sauce alongside chops."],note:"Overnight marinate (not counted) + ~45 min grill/broil.",image:""},
  {id:17,name:"Mongolian Lamb Chops",category:"Meat",cookTime:30,calories:610,fat:24,protein:38,carbs:52,serves:"2",planAhead:false,perishable:[],ingredients:["lamb chops","apricot preserves","white wine","lemon juice","teriyaki sauce"],directions:["Combine preserves, wine, lemon juice, teriyaki sauce and cayenne in a saucepan.","Reduce over moderate heat, stirring, to about 3/4 cup. Season with salt and pepper.","Season lamb chops with salt and pepper.","Broil chops 4 inches from heat for 3 minutes per side for medium rare.","Dip chops in sauce with tongs and transfer to a heated platter.","Serve remaining sauce in a small bowl."],note:"~15 min sauce + ~10 min broil. Sauce is very sweet and rich.",image:""},
  {id:18,name:"Hungarian Goulash",category:"Meat",cookTime:120,calories:490,fat:28,protein:36,carbs:18,serves:"2",planAhead:false,perishable:[],ingredients:["beef chuck","butter","onions","paprika","beef broth","sour cream"],directions:["Season the beef with salt and pepper and brown in butter.","Add onions and enough paprika to color the meat and onions well.","Cook, stirring, about five minutes.","Sprinkle with flour, stir to mix. Add enough broth to barely cover the meat.","Cover tightly and simmer until the meat is tender, about 1.5 to 2 hours.","Stir in sour cream before serving."],note:"~20 min active + 1.5 to 2 hr simmer.",image:""},
  {id:19,name:"Hungarian Style Pot Roast",category:"Meat",cookTime:180,calories:530,fat:24,protein:42,carbs:28,serves:"2-3",planAhead:false,perishable:["celery","parsley"],ingredients:["beef pot roast","flour","garlic","onion","celery","beef broth","tomato sauce","sour cream","parsley","egg noodles"],directions:["Dredge meat in flour mixed with salt and pepper. Brown on all sides in bacon drippings. Pour off fat.","Add garlic, onion, celery, broth and tomato sauce.","Cover tightly and simmer 2 to 3 hours or until meat is tender.","Remove roast to a plate. Thicken gravy with flour mixed with a little water.","Cook two minutes. Stir in sour cream and parsley; reheat but do not boil.","Serve with noodles and gravy."],note:"~20 min active + 2.5 to 3 hr braise. Includes noodles.",image:""},
  {id:20,name:"Chicken Piccata",category:"Poultry",cookTime:25,calories:370,fat:16,protein:44,carbs:12,serves:"2",planAhead:false,perishable:[],ingredients:["chicken breast","egg","flour","butter","olive oil","lemon","capers"],directions:["Pound chicken breasts thin between waxed paper with a mallet.","Dip chicken in egg then dredge in flour seasoned with salt and pepper.","Brown chicken on both sides in oil and half the butter over medium-high heat, about 3 min per side.","Remove chicken to a warm plate.","Add remaining butter, lemon juice, and capers to skillet. Stir to dissolve pan drippings.","Pour sauce over chicken. Garnish with lemon slices and parsley. Serve immediately."],note:"Very quick. ~20 min total.",image:""},
  {id:21,name:"Chicken Marsala",category:"Poultry",cookTime:20,calories:355,fat:14,protein:40,carbs:10,serves:"2",planAhead:false,perishable:[],ingredients:["chicken breast","flour","butter","olive oil","marsala wine","mushrooms"],directions:["Pound chicken breasts thin. Sprinkle with salt and pepper. Coat lightly in flour on both sides.","Heat butter and oil in a skillet until hot and almost smoking.","Add chicken and cook quickly until golden brown on one side. Turn and cook other side, about 3 min per side.","Transfer chicken to a heated plate.","Add mushrooms to skillet and sauté 2 min. Add Marsala and cook, stirring, to dissolve pan drippings.","Reduce wine slightly and pour over chicken."],note:"Very quick. ~15 min total.",image:""},
  {id:22,name:"Cocktail Meatballs",category:"Meat",cookTime:60,calories:310,fat:14,protein:16,carbs:30,serves:"many",planAhead:false,perishable:["parsley"],ingredients:["ground beef","bread crumbs","onion","milk","egg","parsley","butter","chili sauce","grape jelly"],directions:["Mix ground beef, bread crumbs, onion, milk, egg, Worcestershire, pepper, salt and parsley.","Shape into 1-inch balls.","Melt butter in a large skillet and brown meatballs. Remove from skillet. Pour off fat.","Heat chili sauce and jelly in skillet, stirring until jelly is melted.","Add meatballs and stir until thoroughly coated.","Simmer, uncovered, 30 minutes."],note:"Makes 5 dozen. Per 6-meatball serving.",image:""},
  {id:23,name:"Zucchini Cheese Casserole",category:"Vegetables & Sides",cookTime:45,calories:280,fat:20,protein:8,carbs:14,serves:"2",planAhead:false,perishable:["zucchini","chives"],ingredients:["zucchini","butter","cheddar cheese","sour cream","chives","bread crumbs","parmesan"],directions:["Boil zucchini until tender, about 12 minutes. Drain and slice in 1-inch pieces.","Place in a small casserole and season with salt and pepper.","Melt half the butter; mix with cheddar, sour cream and chives. Spoon over zucchini.","Melt remaining butter and saute bread crumbs in it. Cool slightly and add Parmesan.","Sprinkle over casserole. Bake at 400°F for 20 minutes."],note:"~15 min stovetop + 20 min bake.",image:""},
  {id:24,name:"Stuffed Zucchini Boats",category:"Vegetables & Sides",cookTime:60,calories:270,fat:13,protein:20,carbs:18,serves:"2",planAhead:false,perishable:["zucchini","parsley"],ingredients:["zucchini","ground beef","onion","garlic","parsley","parmesan","tomato sauce","mozzarella"],directions:["Heat oven to 375°F. Cut zucchini in half lengthwise, scoop out seeds and pulp leaving 1/4-inch shell.","Brown ground beef with onion, garlic and Italian seasoning; drain excess fat.","Add chopped zucchini pulp, Parmesan cheese, half the sauce, parsley and pepper.","Arrange zucchini shells in a small baking dish. Spoon meat mixture into shells.","Spoon remaining sauce over top. Bake at 375°F for 35 minutes.","Sprinkle Mozzarella over top and bake 5 minutes more."],note:"~15 min active + ~40 min bake.",image:""},
  {id:25,name:"Zucchini and Onion Gratin",category:"Vegetables & Sides",cookTime:75,calories:185,fat:12,protein:4,carbs:14,serves:"2",planAhead:false,perishable:["zucchini"],ingredients:["zucchini","onion","olive oil","thyme","bread crumbs","parmesan"],directions:["Toss zucchini with salt in a colander and let drain 1 hour. Pat dry.","Cook onion in oil over moderate heat, stirring, for 10 minutes until golden.","Oil a small gratin dish. Combine zucchini, onions, thyme and pepper.","Bake at 375°F, stirring several times, for 35 minutes until liquid is mostly evaporated.","Combine bread crumbs and Parmesan; sprinkle over top.","Bake 15 minutes more until golden."],note:"~10 min active + 50 min bake. Includes 1 hr drain time.",image:""},
  {id:27,name:"Zucchini Saute with Red Peppers",category:"Vegetables & Sides",cookTime:30,calories:70,fat:2,protein:3,carbs:10,serves:"2",planAhead:false,perishable:["zucchini","red pepper"],ingredients:["zucchini","onion","garlic","white wine","chicken broth","red pepper"],directions:["Scrub and trim the zucchini. Grate and toss with salt; let sit 20 minutes. Squeeze out moisture.","In a covered pan simmer the onions and garlic in wine and broth.","When tender, about 10 minutes, blend in the zucchini and red pepper.","Boil uncovered, tossing frequently, until zucchini is just tender.","Season to taste and fold in a little olive oil or soft butter if desired."],note:"Very light. ~20 min total.",image:""},
  {id:28,name:"Red Cabbage",category:"Vegetables & Sides",cookTime:30,calories:115,fat:6,protein:2,carbs:13,serves:"2",planAhead:false,perishable:["red cabbage"],ingredients:["red cabbage","red onion","butter","garlic","apple","chicken broth","red wine","caraway seeds"],directions:["Saute the onion slowly in butter, adding garlic when onion is tender.","Fold in cabbage, salt, caraway seeds, bay leaf, pepper, apple, chicken broth, red wine and sugar.","Cover and boil 10 to 15 minutes, tossing occasionally, until cabbage is just tender.","If liquid evaporates before cabbage is done, add a little more broth or water.","If cabbage is done and liquid remains, uncover and boil it off.","Toss with chopped parsley before serving."],note:"~20 min total.",image:""},
  {id:29,name:"Marinated Turnip or Kohlrabi Salad",category:"Vegetables & Sides",cookTime:20,calories:175,fat:16,protein:1,carbs:8,serves:"2",planAhead:true,perishable:[],ingredients:["turnips","olive oil","vinegar","onion","mustard","dill"],directions:["Peel turnips or kohlrabi. Cut into julienne strips or shred in a food processor.","Mix oil, vinegar, and seasonings.","Pour dressing over the vegetables and toss with onion rings.","Marinate several hours in refrigerator.","Drain liquid and serve."],note:"~10 min prep. Marinate several hours (not counted).",image:""},
  {id:30,name:"Broccoli Pie",category:"Vegetables & Sides",cookTime:55,calories:310,fat:16,protein:18,carbs:20,serves:"2",planAhead:false,perishable:["broccoli"],ingredients:["broccoli","garlic","onion","butter","milk","eggs","dijon mustard","flour","mozzarella"],directions:["Saute garlic and onion in butter 4 to 5 minutes.","Place with broccoli in an ungreased small baking dish (about 8x8 inches).","Combine milk, eggs, mustard, flour, salt and pepper in a bowl. Mix well.","Pour over broccoli mixture. Sprinkle cheese on top and stir in gently.","Bake uncovered in a 350°F oven for 35 to 45 minutes."],note:"~10 min active + 40 min bake.",image:""},
  {id:31,name:"Broccoli Quiche",category:"Vegetables & Sides",cookTime:60,calories:420,fat:26,protein:18,carbs:26,serves:"2-3",planAhead:false,perishable:["broccoli"],ingredients:["pie crust","eggs","half and half","onion","broccoli","cheddar cheese","monterey jack cheese","thyme"],directions:["Heat oven to 350°F. Line a small pie pan or tart pan with crust.","Combine eggs, half-and-half, onion, salt and thyme in a bowl.","Layer broccoli and cheeses in the crust.","Pour egg mixture over broccoli and cheese.","Bake at 350°F for 35 to 45 minutes until a knife inserted near center comes out clean.","Cool 5 minutes before cutting."],note:"~15 min active + 40 min bake. Includes pastry crust.",image:""},
  {id:32,name:"Potatoes Stuffed with Curried Cauliflower",category:"Vegetables & Sides",cookTime:90,calories:340,fat:10,protein:7,carbs:56,serves:"2",planAhead:false,perishable:["cauliflower","parsley"],ingredients:["idaho potatoes","butter","onion","cauliflower","olive oil","curry powder","parsley","yogurt"],directions:["Rub potatoes with butter and bake at 425°F, pricking several times after 30 minutes, for 1 hour.","Cook onion and cauliflower in oil over moderate heat, stirring, for 3 minutes.","Stir in curry powder and cook over low heat, stirring, for 3 minutes.","Add 3 tablespoons water; cook covered 8 minutes until cauliflower is tender.","Scoop out potato pulp into the skillet. Add parsley, yogurt, salt and pepper.","Mound filling in shells. Bake at 425°F for 10 minutes."],note:"~70 min bake + 10 min filling + 10 min re-bake.",image:""},
  {id:33,name:"Potatoes Stuffed with Ricotta and Parmesan",category:"Vegetables & Sides",cookTime:90,calories:430,fat:16,protein:18,carbs:52,serves:"2",planAhead:false,perishable:[],ingredients:["idaho potatoes","butter","ricotta","parmesan","egg"],directions:["Rub potatoes with butter and bake at 425°F, pricking several times after 30 minutes, for 1 hour.","Scoop out pulp leaving 1/2-inch shells. Mash into a bowl.","Add ricotta, 1/3 cup Parmesan, the egg, salt and pepper. Beat until fluffy.","Mound filling in shells and sprinkle with remaining Parmesan.","Bake at 425°F for 10 minutes."],note:"Same potato bake time. Very filling.",image:""},
  {id:35,name:"Simple Roasted Asparagus",category:"Vegetables & Sides",cookTime:30,calories:65,fat:4,protein:3,carbs:6,serves:"2",planAhead:false,perishable:["asparagus"],ingredients:["asparagus","olive oil","lemon juice","lemon zest"],directions:["Trim asparagus ends.","Toss asparagus with olive oil, salt, pepper, lemon juice and lemon zest.","Add garlic and shallots if desired.","Place on a sheet pan in a single layer.","Bake at 400°F for 15 to 25 minutes depending on thickness until tender and crisp.","Top with toasted nuts and Parmesan if desired."],note:"~10 min prep + 20 min roast.",image:""},
  {id:36,name:"Green Bean Casserole",category:"Vegetables & Sides",cookTime:45,calories:240,fat:10,protein:6,carbs:30,serves:"2",planAhead:false,perishable:[],ingredients:["green beans","cream of mushroom soup","milk","soy sauce","french fried onions"],directions:["Stir together soup, milk, soy sauce and pepper in a small casserole dish.","Mix in green beans and half the onion rings.","Bake 25 minutes at 350°F; stir.","Top with remaining onion rings.","Bake 5 minutes more."],note:"~5 min active + 30 min bake.",image:""},
  {id:37,name:"Parslied Lemon Rice",category:"Vegetables & Sides",cookTime:20,calories:140,fat:3,protein:2,carbs:26,serves:"2",planAhead:false,perishable:["parsley"],ingredients:["long grain rice","butter","lemon juice","parsley"],directions:["Melt butter in a small saucepan.","Add rice and stir over low heat until translucent.","Add 2/3 cup water. Bring to a boil, cover tightly.","Decrease heat and simmer about 10 minutes until all water is absorbed and rice is tender.","Add lemon juice, parsley and seasonings."],note:"~5 min active + 15 min simmer.",image:""},
  {id:38,name:"Moroccan Eggplant and Garbanzo Beans",category:"Vegetables & Sides",cookTime:40,calories:300,fat:4,protein:11,carbs:56,serves:"2",planAhead:false,perishable:["eggplant","green pepper"],ingredients:["eggplant","onion","garlic","green pepper","garbanzo beans","curry powder","honey","raisins","ketchup"],directions:["Peel and cut eggplant into 1-inch pieces. Steam over boiling water 12 minutes until soft.","Combine onion, garlic, green pepper and 1 tablespoon water. Cover and cook over low heat 10 minutes.","Add curry powder and cook briefly.","Add lemon juice, honey, ketchup and remaining water. Bring to boil.","Stir in garbanzos, eggplant and raisins. Simmer uncovered 5 minutes.","Garnish with tomato, orange wedges and yogurt."],note:"~30 min total. With raisins adds ~20 cal.",image:""},
  {id:39,name:"Potage Arlesienne",category:"Soups",cookTime:50,calories:175,fat:10,protein:4,carbs:18,serves:"2-3",planAhead:false,perishable:["eggplant"],ingredients:["eggplant","olive oil","butter","onions","garlic","thyme","canned tomatoes","rice","chicken broth"],directions:["Peel eggplant and cut into 1-inch cubes. Heat oil in a skillet and cook eggplant until lightly browned. Drain.","Heat butter in a pot; add onions and garlic. Cook until wilted.","Add eggplant cubes, salt, pepper, bay leaf and thyme. Cook, stirring, about 1 minute.","Add tomatoes, rice and broth. Bring to a boil and cook about 30 minutes. Remove bay leaf.","Puree in a food processor or blender in batches.","Return to pot, bring to a simmer and serve."],note:"~10 min active + 40 min cook. Per serving (of 2).",image:""},
  {id:40,name:"Southern Vegetable Soup",category:"Soups",cookTime:55,calories:95,fat:1,protein:4,carbs:18,serves:"2-3",planAhead:false,perishable:["tomato","zucchini","carrot","cabbage"],ingredients:["turnip","onion","carrot","cabbage","broccoli","cauliflower","tomato","zucchini"],directions:["Place turnip, onion and carrot in a soup pot with a small amount of water.","Cover and simmer until vegetables are partially tender.","Add all remaining ingredients except cheese.","Cover and simmer gently about 40 minutes.","Add Sap Sago cheese about 15 minutes before soup is done."],note:"Very low calorie. ~15 min active + 40 min simmer.",image:""},
  {id:41,name:"Eggs with Roquefort Cream",category:"Eggs & Cheese",cookTime:20,calories:195,fat:15,protein:12,carbs:4,serves:"2",planAhead:false,perishable:["scallion"],ingredients:["eggs","sour cream","cream cheese","roquefort","scallion","dijon mustard","walnuts"],directions:["Hard-boil eggs. Halve lengthwise and transfer yolks to a small bowl.","Arrange whites on a plate lined with shredded lettuce.","Mash yolks with sour cream, cream cheese and Roquefort until smooth.","Add scallion, mustard, cayenne, lemon juice, salt and pepper.","Spoon or pipe filling into whites.","Garnish with ground walnuts."],note:"~15 min total. Starter or light lunch.",image:""},
  {id:42,name:"Baked Caramel Custard",category:"Desserts & Baked Goods",cookTime:60,calories:230,fat:7,protein:9,carbs:34,serves:"2",planAhead:true,perishable:[],ingredients:["sugar","milk","eggs","vanilla"],directions:["Melt 3 tablespoons sugar in a small heavy skillet over low heat, stirring constantly, until caramel forms.","Pour into 2 buttered custard cups or ramekins.","Scald milk. Beat egg and yolk slightly. Add sugar, salt and vanilla.","Stir hot milk slowly into egg mixture.","Pour into custard cups; sprinkle with nutmeg.","Place cups in a baking pan with hot water halfway up. Bake at 325°F 35 to 40 minutes. Chill. Unmold to serve."],note:"~15 min active + 40 min bake + chill time.",image:""},
  {id:43,name:"Cheese Cake De Luxe",category:"Desserts & Baked Goods",cookTime:75,calories:430,fat:26,protein:7,carbs:40,serves:"10-12",planAhead:true,perishable:[],ingredients:["graham crackers","butter","cream cheese","sugar","eggs","lemon juice","sherry","sour cream"],directions:["Crush graham crackers until fine; add melted butter and mix well.","Line the bottom and sides of an 8-inch spring form pan with the crumb mixture.","Combine cream cheese, sugar, lemon juice, sherry and eggs; beat until smooth.","Pour into crust and bake at 300°F for 40 to 45 minutes until firm.","Remove from oven and cover with sour cream, powdered sugar and sherry, well mixed.","Return to oven and bake 10 minutes more. Refrigerate overnight before serving."],note:"Per slice (1/10). Refrigerate overnight for best flavor.",image:""},
  {id:44,name:"Baked Bananas",category:"Desserts & Baked Goods",cookTime:30,calories:265,fat:10,protein:2,carbs:44,serves:"2",planAhead:false,perishable:["bananas"],ingredients:["bananas","lemon juice","butter","vanilla","brown sugar","cinnamon","ginger","slivered almonds"],directions:["Preheat oven to 400°F.","Peel bananas and arrange in a small buttered baking dish.","Sprinkle with lemon juice.","Blend butter and vanilla and pour over bananas.","Sprinkle with brown sugar, cinnamon and ginger. Bake 10 minutes.","Sprinkle with almonds and bake 10 minutes more."],note:"~10 min active + 20 min bake.",image:""},
  {id:45,name:"Almond Butter Spritz Cookies",category:"Desserts & Baked Goods",cookTime:30,calories:120,fat:6,protein:2,carbs:16,serves:"many",planAhead:false,perishable:[],ingredients:["almond paste","confectioners sugar","eggs","butter","cake flour"],directions:["Preheat oven to 350°F. Line cookie sheets with parchment paper.","Combine almond paste with confectioners sugar.","Beat in butter gradually. Gradually add eggs until light.","Add flour all at once; mix until blended. Do not overmix.","Fill a pastry bag and pipe half-inch shapes onto prepared pans with a star tube.","Bake about 15 minutes until golden and firm. Cool on pans."],note:"Makes 5 dozen. Per 2-cookie serving.",image:""},
  {id:46,name:"Sangria",category:"Drinks",cookTime:15,calories:145,fat:0,protein:0,carbs:14,serves:"many",planAhead:false,perishable:["lemon","peach"],ingredients:["red wine","cognac","cointreau","orange juice","lemon","peach","club soda"],directions:["Place wine, sugar, cognac, Cointreau, orange juice and ice in a pitcher.","Mix with a wooden spoon.","Add lemon slices, peach slices and club soda.","Serve cold."],note:"Per 8 oz. ~10 min to assemble.",image:""},
  {id:47,name:"White Wine Fruit Punch",category:"Drinks",cookTime:10,calories:170,fat:0,protein:0,carbs:28,serves:"many",planAhead:false,perishable:[],ingredients:["white wine","lemon juice","orange juice","pineapple juice","sugar","club soda"],directions:["Mix wine, lemon juice, orange juice, pineapple juice and sugar. Chill.","Tip: Pour some into an ice cube tray and freeze to keep punch cold without diluting.","When ready to serve, mix club soda with wine-juice mixture."],note:"Per 8 oz. ~5 min to assemble.",image:""},
  {id:48,name:"Apple Cider Punch",category:"Drinks",cookTime:5,calories:90,fat:0,protein:0,carbs:22,serves:"many",planAhead:false,perishable:["orange","lemon"],ingredients:["apple cider","lemon juice","orange juice","orange","lemon"],directions:["Combine apple cider, lemon juice and orange juice in a pitcher or punch bowl.","Add thin slices of oranges and lemons.","Multiply recipe as needed."],note:"Per 8 oz. ~5 min to assemble.",image:""},
  {id:49,name:"West African Ginger Beer",category:"Drinks",cookTime:30,calories:85,fat:0,protein:0,carbs:22,serves:"many",planAhead:false,perishable:["fresh ginger root"],ingredients:["fresh ginger root","lemon juice","honey","water"],directions:["Combine 2 cups of the water with the ginger in a medium saucepan.","Simmer over medium heat for 20 minutes.","Stir in lemon juice and honey. Let cool completely.","Strain into a large pitcher and add remaining 1.5 quarts water.","Add ice cubes and chill before serving."],note:"Per 8 oz. ~20 min simmer + cool time.",image:""},
  {id:50,name:"Teriyaki Marinade",category:"Sauces & Marinades",cookTime:10,calories:45,fat:2,protein:2,carbs:5,serves:"many",planAhead:false,perishable:[],ingredients:["soy sauce","olive oil","sherry","brown sugar","garlic","ginger root","black pepper"],directions:["Combine all the ingredients and mix well.","Marinate chicken, fish or beef overnight.","Use as a basting sauce while grilling."],note:"Per 2 tbsp. ~5 min to mix.",image:""},
  {id:51,name:"Perfect Turkey Gravy",category:"Sauces & Marinades",cookTime:15,calories:55,fat:2,protein:2,carbs:7,serves:"many",planAhead:false,perishable:[],ingredients:["turkey stock","flour","turkey drippings","giblets"],directions:["Blend 1 cup cold stock with flour until smooth.","Heat remaining stock in a large saucepan.","Stir flour mixture into hot stock.","Cook and stir over moderate heat until mixture thickens.","Reduce heat, stir in remaining ingredients and cook 2 to 3 minutes more."],note:"Per 1/4 cup. ~15 min total.",image:""},
  {id:52,name:"Madhur Jaffrey's Sweet and Sour Okra",category:"Other Favorites",cookTime:30,calories:165,fat:14,protein:3,carbs:10,serves:"2",planAhead:false,perishable:["okra"],ingredients:["okra","garlic","red pepper flakes","olive oil","cumin","coriander","turmeric","lemon juice"],directions:["Trim okra stems. Cut each pod crosswise into 3/4-inch lengths.","Blend garlic, pepper flakes and 1.5 tablespoons water thoroughly.","Add ground cumin, coriander and turmeric. Blend well.","Heat oil in a skillet; add whole cumin seeds. Cook briefly until they sizzle.","Add spice paste and cook, stirring, about 1 minute.","Add okra, salt, sugar, lemon juice and remaining water. Stir. Cover and cook over very low heat about 10 minutes."],note:"~10 min active + 10 min cook.",image:""},
  {id:53,name:"Turkish Okra Casserole",category:"Other Favorites",cookTime:65,calories:175,fat:8,protein:5,carbs:22,serves:"2-3",planAhead:false,perishable:["okra","eggplant","zucchini","green pepper","tomatoes","parsley"],ingredients:["okra","eggplant","zucchini","green pepper","onion","tomatoes","olive oil","garlic","parsley","thyme"],directions:["Trim okra stems. Preheat oven to 375°F.","Cut eggplant, zucchini and green pepper into 1-inch pieces. Dice onion. Cube tomatoes.","Heat oil in an ovenproof casserole. Add onion and eggplant. Cook, stirring, until they begin to brown.","Add garlic, pepper flakes, parsley, bay leaf and thyme.","Add remaining vegetables.","Cover and bake about 45 minutes, stirring occasionally, until all vegetables are tender. Season with salt."],note:"~20 min stovetop + 45 min bake. Per serving (of 2).",image:""},
];

const CATS=[...new Set(RECIPES.map(r=>r.category))];
const API="/api";
const aGet=async p=>{try{const r=await fetch(API+p);return r.ok?r.json():null}catch{return null}};
const aPost=async(p,b)=>{try{const r=await fetch(API+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});return r.ok?r.json():null}catch{return null}};
const aDel=async p=>{try{const r=await fetch(API+p,{method:"DELETE"});return r.ok}catch{return false}};

const SHELF={
  "flounder":"1–2 days","cod":"1–2 days","turbot":"1–2 days","fish fillets":"1–2 days",
  "lump crabmeat":"1–2 days","shrimp":"1–2 days","clams":"2–3 days","mussels":"1–2 days",
  "imitation crabmeat":"3–5 days","chicken breast":"1–2 days","chicken thighs":"1–2 days",
  "ground beef":"1–2 days","beef chuck":"3–5 days","beef pot roast":"3–5 days",
  "pork chops":"3–5 days","lamb chops":"3–5 days","veal":"1–2 days",
  "spinach":"3–5 days","parsley":"3–5 days","chives":"5–7 days","green onion":"5–7 days",
  "green onions":"5–7 days","scallion":"5–7 days","scallions":"5–7 days",
  "mushrooms":"5–7 days","asparagus":"3–4 days","broccoli":"3–5 days",
  "zucchini":"4–5 days","eggplant":"5–7 days","tomato":"5–7 days",
  "celery":"1–2 weeks","green pepper":"1–2 weeks","red pepper":"1–2 weeks",
  "red cabbage":"1–2 weeks","cauliflower":"1–2 weeks","cabbage":"1–2 weeks",
  "carrot":"3–4 weeks","heavy cream":"7–10 days","cream":"7–10 days",
};
const shelfLife=ing=>{
  const key=Object.keys(SHELF).find(k=>ing.toLowerCase().includes(k.toLowerCase()));
  return key?SHELF[key]:null;
};

const S={
  page:{minHeight:"100vh",background:C.cream,fontFamily:FB,color:C.text},
  hdr:{background:C.navyDeep,padding:"32px 32px 28px",borderBottom:`1px solid rgba(200,184,154,.12)`},
  nav:{background:C.navyDeep,position:"sticky",top:0,zIndex:50,borderBottom:`1px solid rgba(255,255,255,.06)`},
  wrap:{maxWidth:760,margin:"0 auto",padding:"28px 16px 80px"},
  card:{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(44,62,80,.08)",cursor:"pointer",transition:"transform .18s,box-shadow .18s"},
  btn:(v="primary")=>({padding:"10px 20px",borderRadius:8,fontSize:14,fontFamily:FB,cursor:"pointer",border:"none",transition:"all .15s",fontWeight:500,...(v==="primary"?{background:C.slate,color:C.white}:v==="sage"?{background:C.sage,color:C.white}:v==="ghost"?{background:"transparent",border:`1px solid ${C.slateLight}`,color:C.slate}:v==="danger"?{background:"#e05a4a",color:C.white}:{})}),
  inp:{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.slatePale}`,fontSize:15,fontFamily:FB,color:C.text,background:C.white,outline:"none",width:"100%",boxSizing:"border-box"},
  lbl:{fontSize:12,textTransform:"uppercase",letterSpacing:1.5,color:C.slateLight,display:"block",marginBottom:6},
  tag:(c="slate")=>({display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:12,background:c==="sage"?C.sagePale:c==="warn"?C.warnPale:C.slatePale,color:c==="sage"?C.sageDark:c==="warn"?C.warn:C.slate}),
};

function RecipeCard({recipe,onClick}){
  const tc=recipe.cookTime<=30?C.sageDark:recipe.cookTime<=60?C.warn:C.slate;
  return(
    <div onClick={()=>onClick(recipe)} style={S.card}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.15)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}>
      {recipe.image&&<div style={{height:160,overflow:"hidden",background:C.slatePale}}><img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.style.display="none"}/></div>}
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:2,color:C.slateLight,marginBottom:5}}>{recipe.category}</div>
        <div style={{fontFamily:FD,fontSize:19,fontWeight:600,color:C.navyDeep,lineHeight:1.25,marginBottom:10}}>{recipe.name}</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:13,color:tc,fontWeight:600}}>⏰ {recipe.cookTime} min</span>
          <span style={{fontSize:13,color:C.textMid}}>🔥 {recipe.calories} cal</span>
          <span style={{fontSize:13,color:C.textMid}}>💪 {recipe.protein}g protein</span>
          {recipe.planAhead&&<span style={{...S.tag("warn"),fontSize:11}}>Plan ahead</span>}
          {recipe.isCustom&&<span style={{...S.tag("sage"),fontSize:11}}>Custom</span>}
        </div>
      </div>
    </div>
  );
}

function RecipeDetail({recipe,onBack,onDelete}){
  const tc=recipe.cookTime<=30?C.sageDark:recipe.cookTime<=60?C.warn:C.slate;
  return(
    <div>
      <button onClick={onBack} style={{...S.btn("ghost"),marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back</button>
      <div style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:"0 4px 24px rgba(44,62,80,.10)",border:`1px solid ${C.slatePale}`}}>
        {recipe.image&&<div style={{height:280,overflow:"hidden",background:C.slatePale}}><img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.parentElement.style.display="none"}/></div>}
        <div style={{padding:"28px 28px 32px"}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:2,color:C.slateLight,marginBottom:8}}>{recipe.category}</div>
            <div style={{fontFamily:FD,fontSize:32,fontWeight:600,color:C.navyDeep,lineHeight:1.15,marginBottom:12}}>{recipe.name}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {recipe.serves&&<span style={S.tag("slate")}>Serves {recipe.serves}</span>}
              {recipe.planAhead&&<span style={S.tag("warn")}>📌 Plan ahead</span>}
              {recipe.isCustom&&<span style={S.tag("sage")}>Custom recipe</span>}
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,borderRadius:12,padding:"18px 20px",marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:12}}>
            {[["⏰",recipe.cookTime+" min","Cook time"],["🔥",recipe.calories,"Calories"],["💪",recipe.protein+"g","Protein"],["🐄",recipe.fat+"g","Fat"],["🌾",recipe.carbs+"g","Carbs"]].map(([icon,val,lbl])=>(
              <div key={lbl} style={{textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:2}}>{icon}</div>
                <div style={{fontSize:20,fontWeight:700,color:C.slateLight,fontFamily:FD}}>{val}</div>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:"rgba(255,255,255,.45)",marginTop:2}}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
            <div>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,marginBottom:14,borderBottom:`2px solid ${C.slatePale}`,paddingBottom:8}}>Ingredients</div>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8}}>
                {(recipe.ingredients||[]).map((ing,i)=>(
                  <li key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:15}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:(recipe.perishable||[]).includes(ing)?C.warn:C.sageLight,flexShrink:0,marginTop:7}}/>
                    <span>{ing}</span>
                    {(recipe.perishable||[]).includes(ing)&&<span style={{fontSize:10,color:C.warn,alignSelf:"center"}}>{shelfLife(ing)?`use within ${shelfLife(ing)}`:"use soon"}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,marginBottom:14,borderBottom:`2px solid ${C.slatePale}`,paddingBottom:8}}>Directions</div>
              <ol style={{padding:0,margin:0,listStyle:"none",display:"flex",flexDirection:"column",gap:12}}>
                {(recipe.directions||[]).map((step,i)=>(
                  <li key={i} style={{display:"flex",gap:12,fontSize:14,lineHeight:1.6}}>
                    <span style={{width:26,height:26,borderRadius:"50%",background:C.navy,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</span>
                    <span style={{color:C.textMid}}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {recipe.note&&<div style={{marginTop:24,background:C.slatePale,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.slate}`}}><div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,color:C.slate,marginBottom:4}}>Notes</div><div style={{fontSize:14,color:C.textMid,lineHeight:1.6}}>{recipe.note}</div></div>}
          {recipe.isCustom&&<div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${C.slatePale}`,display:"flex",justifyContent:"flex-end"}}><button onClick={()=>onDelete(recipe.id)} style={S.btn("danger")}>Delete Recipe</button></div>}
        </div>
      </div>
    </div>
  );
}

function ImportRecipeModal({onSave,onCancel}){
  const[mode,setMode]=useState("choice");
  const[url,setUrl]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[preview,setPreview]=useState(null);
  const fileRef=useRef(null);

  const importUrl=async()=>{
    if(!url.trim())return;
    setErr("");setLoading(true);
    try{
      const r=await fetch("/api/import/url",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:url.trim()})});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Import failed");
      setPreview(data);setMode("preview");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const importPhoto=async(file)=>{
    setErr("");setLoading(true);
    try{
      const b64=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(file);});
      const r=await fetch("/api/import/photo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64})});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Import failed");
      setPreview(data);setMode("preview");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const save=async()=>{
    setLoading(true);
    const r=await fetch("/api/recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(preview)});
    const saved=await r.json();
    setLoading(false);
    if(r.ok)onSave(saved);
    else setErr(saved.error||"Save failed");
  };

  const overlay={position:"fixed",inset:0,background:"rgba(26,38,52,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20};
  const modal={background:C.cream,borderRadius:16,padding:"28px 32px",maxWidth:540,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.3)"};

  return(
    <div style={overlay} onClick={e=>{if(e.target===e.currentTarget)onCancel();}}>
      <div style={modal}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:FD,fontSize:22,fontWeight:700,color:C.navyDeep}}>Import a Recipe</div>
          <button onClick={onCancel} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.textMid,lineHeight:1}}>✕</button>
        </div>

        {mode==="choice"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:14,color:C.textMid,marginBottom:4}}>Paste a link to any recipe website, or upload a photo of a printed recipe.</div>
            <div>
              <label style={S.lbl}>Recipe URL</label>
              <div style={{display:"flex",gap:8}}>
                <input style={{...S.inp,flex:1}} value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&importUrl()} placeholder="https://www.allrecipes.com/recipe/..."/>
                <button onClick={importUrl} disabled={loading||!url.trim()} style={{...S.btn("sage"),whiteSpace:"nowrap",opacity:loading||!url.trim()?.5:1}}>{loading?"Reading…":"Import"}</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,height:1,background:C.slatePale}}/>
              <span style={{fontSize:13,color:C.textLight}}>or</span>
              <div style={{flex:1,height:1,background:C.slatePale}}/>
            </div>
            <div>
              <label style={S.lbl}>Upload a photo of a recipe</label>
              <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${C.slatePale}`,borderRadius:12,padding:"24px 16px",textAlign:"center",cursor:"pointer",background:C.white,transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.slate} onMouseLeave={e=>e.currentTarget.style.borderColor=C.slatePale}>
                {loading?<div style={{color:C.textMid,fontSize:14}}>Analyzing photo…</div>:<><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:14,color:C.textMid}}>Click to upload a photo</div><div style={{fontSize:12,color:C.textLight,marginTop:4}}>JPG, PNG, HEIC — any recipe photo or scan</div></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&importPhoto(e.target.files[0])}/>
            </div>
            {err&&<div style={{color:"#c0392b",fontSize:13,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
          </div>
        )}

        {mode==="preview"&&preview&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:C.slatePale,borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontWeight:700,fontSize:18,color:C.navyDeep,marginBottom:4}}>{preview.name}</div>
              <div style={{fontSize:13,color:C.textMid,marginBottom:10}}>{preview.category} · {preview.serves} servings · {preview.cookTime} min</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {[["🔥","cal",preview.calories],["💪","pro",preview.protein+"g"],["🐄","fat",preview.fat+"g"],["🌾","carbs",preview.carbs+"g"]].map(([ic,lb,vl])=>(
                  <div key={lb} style={{textAlign:"center",background:C.white,borderRadius:8,padding:"8px 4px"}}>
                    <div style={{fontSize:16}}>{ic}</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.navyDeep}}>{vl}</div>
                    <div style={{fontSize:11,color:C.textLight}}>{lb}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:13,color:C.textMid,marginBottom:4}}><strong>Ingredients:</strong> {(preview.ingredients||[]).slice(0,5).join(", ")}{(preview.ingredients||[]).length>5?`, +${preview.ingredients.length-5} more`:""}</div>
              <div style={{fontSize:13,color:C.textMid}}><strong>Steps:</strong> {preview.directions?.length||0} steps</div>
            </div>
            {err&&<div style={{color:"#c0392b",fontSize:13,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>{setMode("choice");setPreview(null);setErr("");}} style={S.btn("ghost")}>← Try again</button>
              <button onClick={save} disabled={loading} style={{...S.btn("sage"),opacity:loading?.6:1}}>{loading?"Saving…":"Save to Kitchen"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddRecipeForm({onSave,onCancel}){
  const[form,setForm]=useState({name:"",category:"",cookTime:"",calories:"",fat:"",protein:"",carbs:"",serves:"2",planAhead:false,ingredients:"",directions:"",note:"",image:""});
  const[saving,setSaving]=useState(false);
  const[err,setErr]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.name.trim()){setErr("Recipe name is required.");return;}
    setSaving(true);
    const r={...form,cookTime:parseInt(form.cookTime)||30,calories:parseInt(form.calories)||0,fat:parseInt(form.fat)||0,protein:parseInt(form.protein)||0,carbs:parseInt(form.carbs)||0,ingredients:form.ingredients.split("\n").map(s=>s.trim()).filter(Boolean),directions:form.directions.split("\n").map(s=>s.trim()).filter(Boolean),perishable:[]};
    const saved=await aPost("/recipes",r);
    setSaving(false);
    if(saved)onSave(saved);
    else setErr("Could not save — is the server running?");
  };
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep}}>Add New Recipe</div>
        <button onClick={onCancel} style={S.btn("ghost")}>Cancel</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><label style={S.lbl}>Recipe Name *</label><input style={S.inp} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Lemon Herb Salmon"/></div>
          <div><label style={S.lbl}>Category</label><select style={S.inp} value={form.category} onChange={e=>set("category",e.target.value)}><option value="">Select…</option>{CATS.map(c=><option key={c} value={c}>{c}</option>)}<option value="Other">Other</option></select></div>
          <div><label style={S.lbl}>Serves</label><input style={S.inp} value={form.serves} onChange={e=>set("serves",e.target.value)} placeholder="2"/></div>
        </div>
        <div><label style={S.lbl}>Photo URL (optional)</label><input style={S.inp} value={form.image} onChange={e=>set("image",e.target.value)} placeholder="Paste an image URL from Google Photos, Imgur, etc."/>{form.image&&<img src={form.image} alt="preview" style={{marginTop:8,height:120,borderRadius:8,objectFit:"cover",border:`1px solid ${C.slatePale}`}} onError={e=>e.currentTarget.style.display="none"}/>}</div>
        <div><label style={S.lbl}>Cook Time &amp; Nutrition</label><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>{[["cookTime","⏰ Min"],["calories","🔥 Cal"],["protein","💪 Pro"],["fat","🐄 Fat"],["carbs","🌾 Carb"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:C.textLight,marginBottom:4}}>{l}</div><input style={{...S.inp,textAlign:"center"}} type="number" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder="0"/></div>)}</div></div>
        <div><label style={S.lbl}>Ingredients (one per line)</label><textarea style={{...S.inp,minHeight:120,resize:"vertical"}} value={form.ingredients} onChange={e=>set("ingredients",e.target.value)} placeholder={"1 lb salmon fillets\n2 tbsp olive oil\n1 lemon, sliced"}/></div>
        <div><label style={S.lbl}>Directions (one step per line)</label><textarea style={{...S.inp,minHeight:150,resize:"vertical"}} value={form.directions} onChange={e=>set("directions",e.target.value)} placeholder={"Preheat oven to 400°F.\nPlace salmon in baking dish.\nDrizzle with olive oil and season."}/></div>
        <div><label style={S.lbl}>Notes / Tips (optional)</label><input style={S.inp} value={form.note} onChange={e=>set("note",e.target.value)} placeholder="e.g. Can be made ahead, pairs well with asparagus."/></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="pa" checked={form.planAhead} onChange={e=>set("planAhead",e.target.checked)} style={{accentColor:C.slate}}/><label htmlFor="pa" style={{fontSize:14,color:C.textMid,cursor:"pointer"}}>Requires planning ahead (marinating, chilling, etc.)</label></div>
        {err&&<div style={{color:"#c0392b",fontSize:14,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
        <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}><button onClick={onCancel} style={S.btn("ghost")}>Cancel</button><button onClick={save} disabled={saving} style={{...S.btn("sage"),opacity:saving?.6:1}}>{saving?"Saving…":"Save Recipe"}</button></div>
      </div>
    </div>
  );
}

function StarDishView({recipes,starId,onChangeStar,onView}){
  const star=recipes.find(r=>String(r.id)===String(starId))||recipes[0];
  if(!star)return null;
  const overlaps=recipes.filter(r=>String(r.id)!==String(star.id)).map(r=>{const shared=(r.ingredients||[]).filter(i=>(star.ingredients||[]).includes(i));const perishableShared=shared.filter(i=>(star.perishable||[]).includes(i));return{...r,shared,perishableShared};}).filter(r=>r.shared.length>0).sort((a,b)=>b.perishableShared.length-a.perishableShared.length||b.shared.length-a.shared.length).slice(0,4);
  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12}}>
        <div><div style={{fontFamily:FD,fontSize:28,fontWeight:600,color:C.navyDeep,marginBottom:4}}>Star Dish of the Week</div><div style={{fontSize:14,color:C.textMid}}>Set your star dish and see what else you can make with the same ingredients.</div></div>
        <button onClick={onChangeStar} style={{...S.btn("ghost"),whiteSpace:"nowrap",flexShrink:0}}>Change dish</button>
      </div>
      <div onClick={()=>onView(star)} style={{background:`linear-gradient(135deg,${C.navyDeep} 0%,${C.navy} 100%)`,borderRadius:18,padding:"24px 28px",marginBottom:28,cursor:"pointer",boxShadow:"0 8px 32px rgba(26,38,52,.25)",transition:"transform .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
        {star.image&&<div style={{height:180,borderRadius:12,overflow:"hidden",marginBottom:18,background:C.navyMid}}><img src={star.image} alt={star.name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.85}} onError={e=>e.currentTarget.parentElement.style.display="none"}/></div>}
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.slateLight,marginBottom:6}}>{star.category}</div>
        <div style={{fontFamily:FD,fontSize:28,fontWeight:600,color:C.white,lineHeight:1.15,marginBottom:16}}>{star.name}</div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:18}}>
          {[["⏰",star.cookTime+" min"],["🔥",star.calories+" cal"],["💪",star.protein+"g protein"],["🐄",star.fat+"g fat"]].map(([icon,val])=><div key={val} style={{textAlign:"center"}}><div style={{fontSize:18}}>{icon}</div><div style={{fontWeight:600,color:C.white,fontSize:15}}>{val}</div></div>)}
        </div>
        <div><div style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:C.slateLight,marginBottom:8}}>Key ingredients</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(star.ingredients||[]).slice(0,8).map(i=><span key={i} style={{background:(star.perishable||[]).includes(i)?"rgba(196,118,58,.25)":"rgba(107,143,113,.25)",color:(star.perishable||[]).includes(i)?"#f0b87a":C.sageLight,border:`1px solid ${(star.perishable||[]).includes(i)?"rgba(196,118,58,.4)":"rgba(107,143,113,.4)"}`,borderRadius:20,padding:"3px 12px",fontSize:13}}>{i}{(star.perishable||[]).includes(i)?" 🕐":""}</span>)}</div>{(star.perishable||[]).length>0&&<div style={{fontSize:12,color:C.slateLight,marginTop:8,fontStyle:"italic"}}>🕐 {(star.perishable||[]).map(p=>shelfLife(p)?`${p} (${shelfLife(p)})`:p).join(" · ")}</div>}</div>
      </div>
      {overlaps.length>0&&<div><div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:C.navyDeep,marginBottom:6}}>Reduce Waste This Week</div><div style={{fontSize:14,color:C.textMid,marginBottom:16}}>These share ingredients with your star dish — perishables prioritized first.</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>{overlaps.map(r=><div key={r.id} onClick={()=>onView(r)} style={S.card} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.15)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}><div style={{padding:"14px 16px"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:C.slateLight,marginBottom:4}}>{r.category}</div><div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep,marginBottom:8}}>{r.name}</div><div style={{display:"flex",gap:10,fontSize:13,color:C.textMid,marginBottom:8}}><span style={{color:r.cookTime<=30?C.sageDark:C.textMid,fontWeight:600}}>⏰ {r.cookTime} min</span><span>🔥 {r.calories} cal</span></div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{r.shared.slice(0,4).map(i=><span key={i} style={{...S.tag(r.perishableShared.includes(i)?"warn":"sage"),fontSize:11}}>{i}</span>)}{r.shared.length>4&&<span style={{...S.tag(),fontSize:11}}>+{r.shared.length-4} more</span>}</div></div></div>)}</div></div>}
    </div>
  );
}

function ChatView({recipes,onView}){
  const GREET="Hey! Tell me what sounds good tonight — how much time you have, what you're in the mood for, ingredients on hand, anything. I'll find the right recipe.";
  const[msgs,setMsgs]=useState([{role:"chef",text:GREET,results:null}]);
  const[input,setInput]=useState("");
  const[thinking,setThinking]=useState(false);
  const[ctx,setCtx]=useState({});
  const endRef=useRef(null);
  const inputRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,thinking]);

  const parse=(text,prevCtx)=>{
    const lo=text.toLowerCase();
    const next={...prevCtx};

    if(/\b(reset|start over|forget it|never mind|clear|again)\b/.test(lo)) return {reset:true};

    if(/\bunder 30|real(ly)? quick|super fast|asap|30 min|half hour|no time|\b15 min/.test(lo)) next.maxTime=30;
    else if(/\ban? hour|60 min|hour(ish)?|moderate time/.test(lo)) next.maxTime=60;
    else if(/couple (of )?hours?|1[–-]?2 hours?|slow cook|all (the )?time/.test(lo)) next.maxTime=120;
    else if(/\bquick(er|ly)?\b/.test(lo)&&!next.maxTime) next.maxTime=45;

    if(/\bfish\b|seafood|shrimp|crab|flounder|cod|salmon|turbot|shellfish|tuna/.test(lo)) next.cats=["Fish & Seafood"];
    else if(/\bchicken\b|poultry|turkey/.test(lo)) next.cats=["Poultry"];
    else if(/\bbeef\b|\bpork\b|\blamb\b|\bveal\b|\bmeat\b|goulash|meatball|roast/.test(lo)) next.cats=["Meat"];
    else if(/\bveg(gie|etable)?s?\b|broccoli|zucchini|potato|asparagus|casserole|side dish/.test(lo)) next.cats=["Vegetables & Sides"];
    else if(/\bsoup\b|broth|stew/.test(lo)) next.cats=["Soups"];
    else if(/\begg\b|\bcheese\b|quiche/.test(lo)) next.cats=["Eggs & Cheese"];

    if(/\blight\b|low.?cal|under 250|healthy|diet|slim|not (too )?heavy/.test(lo)) next.maxCal=250;
    else if(/\bmoderate\b|medium cal|250.?400|not too (much|indulgent)/.test(lo)) next.maxCal=400;
    else if(/hungry|indulg|comfort|rich|hearty|no limit/.test(lo)) { delete next.maxCal; }

    if(/\bprotein\b|high protein|gains|gym/.test(lo)) next.minProt=25;

    if(/\blight\b|fresh|low cal/.test(lo)) next.sort="cal_asc";
    else if(/comfort|warm|hearty|filling|hungry/.test(lo)) next.sort="cal_desc";
    else if(/protein/.test(lo)) next.sort="prot_desc";
    else if(/quick(er)?|fast(er)?/.test(lo)) next.sort="time_asc";

    const ingWords=lo.split(/\s+/).filter(w=>w.length>3);
    const ingHits=recipes.filter(r=>(r.ingredients||[]).some(ing=>ingWords.some(w=>ing.toLowerCase().includes(w)))||(r.name.toLowerCase().split(" ").some(nw=>nw.length>3&&ingWords.includes(nw))));
    if(ingHits.length>0&&ingHits.length<recipes.length*0.7) next.ingBoost=ingHits.map(r=>r.id);

    return {next,reset:false};
  };

  const filter=(ctx)=>{
    let f=[...recipes];
    if(ctx.maxTime) f=f.filter(r=>r.cookTime<=ctx.maxTime);
    if(ctx.cats) f=f.filter(r=>ctx.cats.includes(r.category));
    if(ctx.maxCal) f=f.filter(r=>r.calories<=ctx.maxCal);
    if(ctx.minProt) f=f.filter(r=>r.protein>=ctx.minProt);
    if(ctx.sort==="cal_asc") f.sort((a,b)=>a.calories-b.calories);
    else if(ctx.sort==="cal_desc") f.sort((a,b)=>b.calories-a.calories);
    else if(ctx.sort==="prot_desc") f.sort((a,b)=>b.protein-a.protein);
    else if(ctx.sort==="time_asc") f.sort((a,b)=>a.cookTime-b.cookTime);
    if(ctx.ingBoost){const s=new Set(ctx.ingBoost);f.sort((a,b)=>(s.has(b.id)?1:0)-(s.has(a.id)?1:0));}
    return f.slice(0,6);
  };

  const reply=(newCtx,results,userText)=>{
    const lo=userText.toLowerCase();
    if(results.length===0) return "Nothing matched that exactly — want to loosen something? Try removing a filter or widening the time.";
    const parts=[];
    if(newCtx.maxTime&&newCtx.maxTime<999) parts.push(`under ${newCtx.maxTime} min`);
    if(newCtx.cats) parts.push(newCtx.cats.join(" or ").toLowerCase());
    if(newCtx.maxCal) parts.push(`under ${newCtx.maxCal} cal`);
    const desc=parts.length?` (${parts.join(", ")})`:"";
    if(results.length<=2) return `Just ${results.length}${desc} — pretty specific! Here${results.length===1?" it is":":"}`;
    const openers=["Here's what I've got","These look good to me","Nice choices tonight","You've got options"];
    return `${openers[Math.floor(Math.random()*openers.length)]}${desc}:`;
  };

  const send=()=>{
    const text=input.trim();
    if(!text||thinking) return;
    setInput("");
    setMsgs(prev=>[...prev,{role:"user",text,results:null}]);
    setThinking(true);
    setTimeout(()=>{
      const {next,reset}=parse(text,ctx);
      if(reset){
        setCtx({});
        setMsgs(prev=>[...prev,{role:"chef",text:"Starting fresh! "+GREET,results:null}]);
        setThinking(false);
        return;
      }
      const results=filter(next);
      const responseText=reply(next,results,text);
      setCtx(next);
      setMsgs(prev=>[...prev,{role:"chef",text:responseText,results:results.length>0?results:null}]);
      setThinking(false);
    },650);
  };

  const handleKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  const avatarStyle={width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.slate},${C.navyMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0};
  const bubbleChef={background:`linear-gradient(135deg,${C.white},${C.slatePale})`,border:`1px solid ${C.slatePale}`,borderRadius:"4px 14px 14px 14px",padding:"12px 16px",maxWidth:"82%",boxShadow:"0 2px 8px rgba(44,62,80,.07)"};
  const bubbleUser={background:`linear-gradient(135deg,${C.slate},${C.navyMid})`,borderRadius:"14px 4px 14px 14px",padding:"10px 16px",maxWidth:"72%",color:C.white,fontSize:14};
  const CHIPS=["Something quick","Fish tonight","Comfort food","High protein","Under 300 cal","Surprise me"];

  return(
    <div style={{maxWidth:600,margin:"0 auto",display:"flex",flexDirection:"column",height:"calc(100vh - 210px)",minHeight:440}}>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:C.navyDeep,marginBottom:2}}>Chat</div>
      <div style={{fontSize:13,color:C.textMid,marginBottom:14}}>Describe what you're after and I'll find the right recipe — you can keep refining.</div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:14,paddingBottom:8}}>
        {msgs.map((msg,i)=>(
          <div key={i}>
            {msg.role==="chef"?(
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={avatarStyle}>🍳</div>
                <div style={bubbleChef}><div style={{fontSize:15,color:C.navyDeep,lineHeight:1.5}}>{msg.text}</div></div>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={bubbleUser}>{msg.text}</div>
              </div>
            )}
            {msg.results&&(
              <div style={{marginTop:10,paddingLeft:44,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                {msg.results.map(r=><RecipeCard key={r.id} recipe={r} onClick={onView}/>)}
              </div>
            )}
          </div>
        ))}
        {thinking&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={avatarStyle}>🍳</div>
            <div style={{...bubbleChef,padding:"14px 18px"}}><span style={{color:C.slateLight,letterSpacing:4,fontSize:18}}>· · ·</span></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingBottom:10}}>
          {CHIPS.map(c=><button key={c} onClick={()=>{setInput(c);setTimeout(()=>inputRef.current?.focus(),0);}} style={{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:20,padding:"7px 14px",fontSize:13,color:C.navy,cursor:"pointer",fontFamily:FB}}>{c}</button>)}
        </div>
      )}
      <div style={{display:"flex",gap:10,paddingTop:10,borderTop:`1px solid ${C.slatePale}`}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="e.g. quick fish dish, under 300 calories…" style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.slatePale}`,fontSize:14,fontFamily:FB,color:C.text,outline:"none",background:C.white}}/>
        <button onClick={send} disabled={thinking||!input.trim()} style={{...S.btn("sage"),padding:"12px 20px",borderRadius:12,flexShrink:0,opacity:thinking||!input.trim()?0.5:1}}>Send ↑</button>
      </div>
    </div>
  );
}

function SearchView({recipes,onView}){
  const[q,setQ]=useState("");const[mt,setMt]=useState(999);const[mc,setMc]=useState(999);const[cat,setCat]=useState("All");
  const f=recipes.filter(r=>{const lq=q.toLowerCase();const mq=!lq||r.name.toLowerCase().includes(lq)||(r.ingredients||[]).some(i=>i.toLowerCase().includes(lq))||r.category.toLowerCase().includes(lq);return mq&&r.cookTime<=mt&&r.calories<=mc&&(cat==="All"||r.category===cat);});
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:20}}>Search Recipes</div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24,background:C.white,borderRadius:14,padding:20,border:`1px solid ${C.slatePale}`,boxShadow:"0 2px 12px rgba(44,62,80,.06)"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, ingredient, or category…" style={S.inp}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["All",...CATS].map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:cat===c?C.navy:C.white,color:cat===c?C.white:C.slate,border:`1px solid ${cat===c?C.navy:C.slatePale}`}}>{c}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={S.lbl}>Max cook time: {mt===999?"Any":mt+" min"}</label><input type="range" min={15} max={195} step={15} value={mt===999?195:mt} onChange={e=>setMt(+e.target.value>=195?999:+e.target.value)} style={{width:"100%",accentColor:C.slate}}/></div>
          <div><label style={S.lbl}>Max calories: {mc===999?"Any":mc}</label><input type="range" min={50} max={650} step={25} value={mc===999?650:mc} onChange={e=>setMc(+e.target.value>=650?999:+e.target.value)} style={{width:"100%",accentColor:C.slate}}/></div>
        </div>
      </div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:14}}>{f.length} recipe{f.length!==1?"s":""} found</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{f.map(r=><RecipeCard key={r.id} recipe={r} onClick={onView}/>)}</div>
    </div>
  );
}

function FridgeView({recipes,onView}){
  const all=[...new Set(recipes.flatMap(r=>r.ingredients||[]))].sort();
  const[sel,setSel]=useState(new Set());
  const[srch,setSrch]=useState("");
  const tog=i=>setSel(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n});
  const matches=recipes.map(r=>{const have=(r.ingredients||[]).filter(i=>sel.has(i));const missing=(r.ingredients||[]).filter(i=>!sel.has(i));const pct=r.ingredients?.length?have.length/r.ingredients.length:0;return{...r,have,missing,pct};}).filter(r=>r.pct>0).sort((a,b)=>b.pct-a.pct);
  const vis=all.filter(i=>!srch||i.toLowerCase().includes(srch.toLowerCase()));
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:6}}>What's in Your Fridge?</div>
      <div style={{fontSize:14,color:C.textMid,marginBottom:20}}>Check off what you have. We'll show you what you can make.</div>
      <div style={{background:C.white,borderRadius:14,padding:20,border:`1px solid ${C.slatePale}`,marginBottom:24,boxShadow:"0 2px 12px rgba(44,62,80,.06)"}}>
        <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Filter ingredients…" style={{...S.inp,marginBottom:14}}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,maxHeight:220,overflowY:"auto",paddingBottom:4}}>{vis.map(ing=><button key={ing} onClick={()=>tog(ing)} style={{padding:"5px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:sel.has(ing)?C.sage:C.white,color:sel.has(ing)?C.white:C.slate,border:`1px solid ${sel.has(ing)?C.sage:C.slatePale}`}}>{sel.has(ing)?"✓ ":""}{ing}</button>)}</div>
        {sel.size>0&&<button onClick={()=>setSel(new Set())} style={{marginTop:12,fontSize:13,color:C.slateLight,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:FB}}>Clear all ({sel.size} selected)</button>}
      </div>
      {matches.length>0&&<div><div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:C.navyDeep,marginBottom:14}}>You Can Make These</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{matches.map(r=><div key={r.id} onClick={()=>onView(r)} style={{...S.card,display:"flex",alignItems:"stretch"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.14)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}><div style={{width:6,background:r.pct>.7?C.sage:r.pct>.4?C.warn:C.slateLight,flexShrink:0,borderRadius:"14px 0 0 14px"}}/><div style={{padding:"14px 18px",flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep}}>{r.name}</div><div style={{fontSize:13,fontWeight:700,color:r.pct>.7?C.sageDark:r.pct>.4?C.warn:C.slate,marginLeft:10,flexShrink:0}}>{Math.round(r.pct*100)}% match</div></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>{r.have.map(i=><span key={i} style={S.tag("sage")}>✓ {i}</span>)}</div>{r.missing.length>0&&<div style={{fontSize:13,color:C.textLight,fontStyle:"italic"}}>Still need: {r.missing.slice(0,4).join(", ")}{r.missing.length>4?` +${r.missing.length-4} more`:""}</div>}</div></div>)}</div></div>}
      {sel.size>0&&matches.length===0&&<div style={{textAlign:"center",color:C.textLight,fontStyle:"italic",padding:48}}>No matches yet — try adding a few more ingredients.</div>}
    </div>
  );
}

function PairingsView({recipes,onView}){
  const mains=recipes.filter(r=>["Fish & Seafood","Poultry","Meat","Eggs & Cheese"].includes(r.category));
  const sides=recipes.filter(r=>r.category==="Vegetables & Sides");
  const[mid,setMid]=useState(mains[0]?.id);
  const main=mains.find(r=>String(r.id)===String(mid))||mains[0];
  const ranked=sides.map(s=>{const shared=(s.ingredients||[]).filter(i=>(main?.ingredients||[]).includes(i));const nc=!(main?.cookTime<45&&s.cookTime<30);return{...s,shared,nc};}).sort((a,b)=>{if(a.nc!==b.nc)return a.nc?-1:1;return b.shared.length-a.shared.length});
  const best=ranked[0];
  const totalCal=(main?.calories||0)+(best?.calories||0);
  const totalTime=Math.max(main?.cookTime||0,best?.cookTime||0);
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:6}}>Dinner Pairings</div>
      <div style={{fontSize:14,color:C.textMid,marginBottom:24}}>Pick your main — we'll suggest sides that won't compete for stovetop space at the same time.</div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Choose your main dish</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{mains.map(m=><button key={m.id} onClick={()=>setMid(m.id)} style={{padding:"6px 16px",borderRadius:20,fontSize:14,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:String(mid)===String(m.id)?C.navy:C.white,color:String(mid)===String(m.id)?C.white:C.slate,border:`1px solid ${String(mid)===String(m.id)?C.navy:C.slatePale}`}}>{m.name}</button>)}</div></div>
      {main&&best&&<div style={{background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,borderRadius:16,padding:"22px 24px",marginBottom:24,boxShadow:"0 6px 24px rgba(26,38,52,.2)"}}>
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.slateLight,marginBottom:12}}>Best pairing</div>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",marginBottom:16}}>
          <div><div style={{fontSize:11,color:C.slateLight,marginBottom:2}}>Main</div><div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.white}}>{main.name}</div></div>
          <div style={{fontSize:24,color:C.slateLight}}>+</div>
          <div><div style={{fontSize:11,color:C.slateLight,marginBottom:2}}>Side</div><div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.white}}>{best.name}</div></div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <span style={{fontSize:14,color:C.sageLight,fontWeight:600}}>⏰ ~{totalTime} min total</span>
          <span style={{fontSize:14,color:C.slateLight}}>🔥 ~{totalCal} cal combined</span>
          {best.shared.length>0&&<span style={{fontSize:14,color:C.slateLight}}>Shares: {best.shared.slice(0,3).join(", ")}</span>}
        </div>
      </div>}
      <div style={S.lbl}>Other good sides</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>{ranked.slice(1,6).map(s=><div key={s.id} onClick={()=>onView(s)} style={S.card} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.15)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}><div style={{padding:"14px 16px"}}><div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep,marginBottom:6}}>{s.name}</div><div style={{fontSize:13,color:C.textMid,marginBottom:6}}>⏰ {s.cookTime} min · {s.calories} cal</div>{s.shared.length>0&&<div style={{fontSize:12,color:C.textLight,marginBottom:6,fontStyle:"italic"}}>Shares: {s.shared.slice(0,2).join(", ")}</div>}{!s.nc&&<div style={{fontSize:12,color:C.warn}}>⚠ Both need stovetop at same time</div>}</div></div>)}</div>
    </div>
  );
}

function StarPicker({recipes,onPick,onClose}){
  const[q,setQ]=useState("");
  const f=recipes.filter(r=>!q||r.name.toLowerCase().includes(q.toLowerCase())||r.category.toLowerCase().includes(q.toLowerCase()));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,38,52,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
      <div style={{background:C.cream,borderRadius:20,padding:24,maxWidth:480,width:"100%",maxHeight:"82vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 64px rgba(26,38,52,.35)"}}>
        <div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:C.navyDeep,marginBottom:16}}>Choose Your Star Dish</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" style={{...S.inp,marginBottom:12}}/>
        <div style={{overflowY:"auto",display:"flex",flexDirection:"column",gap:8,flex:1}}>{f.map(r=><button key={r.id} onClick={()=>{onPick(r.id);onClose();}} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${C.slatePale}`,background:C.white,textAlign:"left",cursor:"pointer",fontSize:14,color:C.navyDeep,fontFamily:FB,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.slatePale;e.currentTarget.style.borderColor=C.slateLight}} onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.borderColor=C.slatePale}}><span style={{fontWeight:600}}>{r.name}</span><span style={{fontSize:12,color:C.textLight,marginLeft:8}}>{r.category}</span></button>)}</div>
        <button onClick={onClose} style={{...S.btn("ghost"),marginTop:14}}>Cancel</button>
      </div>
    </div>
  );
}

export default function App(){
  const[recipes,setRecipes]=useState(RECIPES);
  const[tab,setTab]=useState("star");
  const[starId,setStarId]=useState(RECIPES[9].id);
  const[picker,setPicker]=useState(false);
  const[view,setView]=useState(null);
  const[loading,setLoading]=useState(true);
  const[importing,setImporting]=useState(false);

  useEffect(()=>{
    (async()=>{
      const remote=await aGet("/recipes");
      if(remote&&remote.length>0)setRecipes(remote);
      else if(remote!==null)await aPost("/seed",{recipes:RECIPES});
      setLoading(false);
    })();
  },[]);

  const onView=useCallback(r=>setView({type:"detail",recipe:r}),[]);
  const onSave=useCallback(s=>{setRecipes(p=>[...p,s]);setView(null);},[]);
  const onDel=useCallback(async id=>{
    if(!window.confirm("Delete this recipe?"))return;
    const ok=await aDel(`/recipes/${id}`);
    if(ok){setRecipes(p=>p.filter(r=>String(r.id)!==String(id)));setView(null);}
    else alert("Could not delete — is the server running?");
  },[]);

  const TABS=[{id:"star",label:"⭐  Star Dish"},{id:"quiz",label:"💬  Chat"},{id:"search",label:"🔍  Search"},{id:"fridge",label:"🧊  Fridge"},{id:"pairs",label:"🍽  Pairings"}];

  return(
    <div style={S.page}>
      <div style={S.hdr}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12}}>
            <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:C.white,letterSpacing:.5,lineHeight:1}}>Karmiol Kitchen</div>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,marginBottom:2,flexShrink:0}}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setImporting(true)} style={{padding:"9px 18px",borderRadius:6,fontSize:13,fontFamily:FB,cursor:"pointer",fontWeight:500,background:"transparent",border:`1px solid rgba(200,184,154,.35)`,color:C.goldLight,transition:"all .2s",letterSpacing:.3}}>+ Import Recipe</button>
            <button onClick={()=>setView({type:"add"})} style={{padding:"9px 18px",borderRadius:6,fontSize:13,fontFamily:FB,cursor:"pointer",fontWeight:500,background:C.gold,border:"none",color:C.navyDeep,transition:"all .2s",letterSpacing:.3}}>+ Add Recipe</button>
          </div>
        </div>
      </div>
      <div style={S.nav}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setView(null);}} style={{padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",fontSize:13,fontFamily:FB,fontWeight:500,letterSpacing:.3,color:tab===t.id?C.white:"rgba(255,255,255,.4)",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",transition:"all .2s",whiteSpace:"nowrap"}}>{t.label}</button>)}
        </div>
      </div>
      {importing&&<ImportRecipeModal onSave={s=>{setRecipes(p=>[...p,s]);setImporting(false);}} onCancel={()=>setImporting(false)}/>}
      <div style={S.wrap}>
        {loading?<div style={{textAlign:"center",padding:60,color:C.textLight,fontStyle:"italic",fontSize:15}}>Loading recipes…</div>:
         view?.type==="detail"?<RecipeDetail recipe={view.recipe} onBack={()=>setView(null)} onDelete={onDel}/>:
         view?.type==="add"?<AddRecipeForm onSave={onSave} onCancel={()=>setView(null)}/>:
         <>
           {tab==="star"&&<StarDishView recipes={recipes} starId={starId} onChangeStar={()=>setPicker(true)} onView={onView}/>}
           {tab==="quiz"&&<ChatView recipes={recipes} onView={onView}/>}
           {tab==="search"&&<SearchView recipes={recipes} onView={onView}/>}
           {tab==="fridge"&&<FridgeView recipes={recipes} onView={onView}/>}
           {tab==="pairs"&&<PairingsView recipes={recipes} onView={onView}/>}
         </>}
      </div>
      {picker&&<StarPicker recipes={recipes} onPick={id=>{setStarId(id);setTab("star");}} onClose={()=>setPicker(false)}/>}
    </div>
  );
}
