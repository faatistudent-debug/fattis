# Security Specification: RBAC & Tenant Data Isolation for Rendí+

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created by an authenticated user where `request.auth.uid == userId`. Once created, the `role` field cannot be modified by the user directly to prevent privilege escalation.
2. **Strict Athlete Isolation**: An athlete's daily logs at `/athletes/{athleteId}/dailyLogs/{date}` (including meals, meal photos, hydration, sleep) can ONLY be written by the athlete whose `request.auth.uid == athleteId`. No athlete can ever read or write another athlete's logs or meal uploads.
3. **Role Authorization Gate**:
   - `Deportista`: Can only read and write their own `/athletes/{athleteId}/**` data where `athleteId == request.auth.uid`. Can read `/recipes`.
   - `Nutricionista`: Can read all authorized athlete daily logs to evaluate nutrition and hydration adherence, can write to `/athletes/{athleteId}/nutritionPlans/{planId}`, and can create/update/delete `/recipes/{recipeId}`. Cannot modify athlete private habit logs or tamper with their photos.
   - `Entrenador`: Can read athlete daily logs and injuries to monitor training and recovery, can create/update `/athletes/{athleteId}/injuries/{injuryId}`. Cannot forge athlete meal logs.
4. **Recipe Ownership & Integrity**: Only verified nutritionists can create, edit, or delete recipes in `/recipes/{recipeId}`.
5. **Path & Payload Bounding**: Every document ID must satisfy `isValidId(id)` and all string fields must be constrained by `.size() <= MAX` to prevent injection and Denial of Wallet attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads
These payloads represent adversarial attack vectors attempting to breach data isolation or escalate privileges.

1. **Payload 1 (Privilege Escalation on User Profile)**:
   - *Target*: `users/athlete123`
   - *Attack*: Athlete submits `{ userId: "athlete123", role: "Nutricionista" }` during update to grant themselves nutritionist powers.
   - *Expected Result*: PERMISSION_DENIED.

2. **Payload 2 (Cross-Tenant Daily Log Injection)**:
   - *Target*: `athletes/athlete_victor/dailyLogs/2026-10-26`
   - *Attack*: User `athlete_lucas` attempts to write breakfast data or photos into Victor's log.
   - *Expected Result*: PERMISSION_DENIED.

3. **Payload 3 (Cross-Tenant Read of Meals and Photos)**:
   - *Target*: `athletes/athlete_victor/dailyLogs/2026-10-26`
   - *Attack*: Athlete `athlete_lucas` queries or fetches Victor's meal photos and habit records.
   - *Expected Result*: PERMISSION_DENIED.

4. **Payload 4 (Unauthenticated Blanket Read)**:
   - *Target*: `athletes/athlete_victor`
   - *Attack*: Anonymous visitor tries to read athlete health and training information.
   - *Expected Result*: PERMISSION_DENIED.

5. **Payload 5 (Athlete Forging Nutrition Plan)**:
   - *Target*: `athletes/athlete_victor/nutritionPlans/plan_1`
   - *Attack*: Athlete attempts to approve or create their own clinical nutrition plan.
   - *Expected Result*: PERMISSION_DENIED.

6. **Payload 6 (Athlete Tampering with Recipes)**:
   - *Target*: `recipes/recipe_123`
   - *Attack*: Athlete attempts to publish or delete a public nutritionist recipe.
   - *Expected Result*: PERMISSION_DENIED.

7. **Payload 7 (Denial of Wallet Huge String Attack)**:
   - *Target*: `athletes/{authUid}/dailyLogs/2026-10-26`
   - *Attack*: Athlete sends a 5MB junk character string in `moodNote`.
   - *Expected Result*: PERMISSION_DENIED.

8. **Payload 8 (Document ID Injection Attack)**:
   - *Target*: `athletes/{authUid}/dailyLogs/../../system_config`
   - *Attack*: Attacker provides an ID with directory traversal or invalid characters.
   - *Expected Result*: PERMISSION_DENIED.

9. **Payload 9 (Shadow Field Injection on User Creation)**:
   - *Target*: `users/{authUid}`
   - *Attack*: Payload contains unregistered keys `{ isAdmin: true, bypassRules: true }`.
   - *Expected Result*: PERMISSION_DENIED.

10. **Payload 10 (Coach Overwriting Nutritional Prescriptions)**:
    - *Target*: `athletes/athlete_victor/nutritionPlans/plan_1`
    - *Attack*: Coach role attempts to alter nutritionist diet prescriptions.
    - *Expected Result*: PERMISSION_DENIED.

11. **Payload 11 (Nutritionist Forging Athlete Training Logs)**:
    - *Target*: `athletes/athlete_victor/dailyLogs/2026-10-26`
    - *Attack*: Nutritionist attempts to edit athlete workout completion status.
    - *Expected Result*: PERMISSION_DENIED (only athlete can write daily habit log).

12. **Payload 12 (Impersonation via Forged Author UID)**:
    - *Target*: `recipes/recipe_456`
    - *Attack*: Nutritionist `user_A` writes `{ authorId: "user_B" }` to impersonate colleague.
    - *Expected Result*: PERMISSION_DENIED (authorId must match request.auth.uid).
