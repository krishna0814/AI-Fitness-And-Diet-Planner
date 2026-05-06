# AI Diet Personalization Fix

**Status:** Approved & In Progress

**Steps:**
- [x] Create TODO-DIET.md ✅
- [x] Step 1: Update ai-service/app.py with BMR/TDEE/goal logic + personalized meals/macros ✅
- [x] Step 2: Restart AI service (Flask debug reloaded automatically) ✅
- [x] Step 3: Update frontend/src/pages/Diet.jsx to call real AI endpoint with user profile ✅
- [ ] Step 4: Test personalized diet (different users → different calories/plans)
- [ ] Step 5: Update TODO + attempt_completion

**Details:**
- BMR: Mifflin-St Jeor formula
- TDEE multipliers: sedentary 1.2, light 1.375, etc.
- Goals: loss(-500kcal), gain(+300), maintain(0)

