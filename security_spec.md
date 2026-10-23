# Security Specification for Design System Studio

## 1. Data Invariants
- **User Profile Isolation**: A user can only read, create, and update their own document at `/users/{userId}` where `{userId}` strictly matches `request.auth.uid`.
- **Project Ownership**: A design project in `/projects/{projectId}` must have `userId == request.auth.uid`. No user can read, list, update, or delete another user's projects.
- **Strict Query Enforcement**: Listing `/projects` enforces `resource.data.userId == request.auth.uid`.
- **Key & Type Integrity**: Project documents require `id`, `userId`, `name`. IDs must conform to `^[a-zA-Z0-9_\-]+$` and not exceed length limits.
- **Default Deny**: All unmapped paths are closed by default `match /{document=**} { allow read, write: if false; }`.

## 2. The Dirty Dozen Payloads (Targeting Vulnerabilities)
1. **Unauthenticated Read User**: Unauthenticated request reading `/users/user_123` -> PERMISSION_DENIED.
2. **Impersonate User Profile**: Authenticated as `user_A` writing `/users/user_B` -> PERMISSION_DENIED.
3. **Ghost Fields Injection**: Injecting arbitrary extra root keys outside schema -> PERMISSION_DENIED.
4. **ID Poisoning Attack**: Passing 2KB string or malicious characters in path ID -> PERMISSION_DENIED.
5. **Project Steal Query**: Authenticated as `user_A` querying `/projects` where `userId == 'user_B'` -> PERMISSION_DENIED.
6. **Unauthenticated Create Project**: Attempting to create project document without auth token -> PERMISSION_DENIED.
7. **Cross-User Project Mutation**: Authenticated as `user_A` trying to update `/projects/proj_B` owned by `user_B` -> PERMISSION_DENIED.
8. **Owner Reassignment Attack**: Authenticated owner attempting to change `userId` on existing project to another user -> PERMISSION_DENIED.
9. **Cross-User Project Deletion**: Authenticated as `user_A` deleting `/projects/proj_B` owned by `user_B` -> PERMISSION_DENIED.
10. **Admin Escalation in Profile**: User attempting to inject `isAdmin: true` into their user document -> PERMISSION_DENIED.
11. **Blanket Query Scraping**: Running list query on `/users` collection without user ID scope -> PERMISSION_DENIED.
12. **Malformed Types / Overflow**: Passing number for project name or string length > 120 chars -> PERMISSION_DENIED.
