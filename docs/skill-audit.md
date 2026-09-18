# Skill audit — September 17, 2026

Scope: editorial review of all 12 playbooks, independent scenario review of four priority skills, live MCP retrieval, package validation, and website checks. These checks do not establish identical behavior across Claude, ChatGPT or Copilot. No campaigns were sent, accounts changed, or businesses contacted.

## Findings and changes

| Skill | Finding | Change |
| --- | --- | --- |
| Local Marketing Campaign | Context list could cause a questionnaire; selection continuation implicit | Two material questions at most initially; first-response options; explicit “Build #2” continuation; short category searches; campaign-date checks |
| Local Partnership Finder | Abstract complementary-business queries mostly retrieved competitors | Reason about complementary customer moments first, search individual categories, verify mutual value, draft a pilot |
| Networking Event Prep | Relevance order could be mistaken for date order | Compare dates; resolve “next”; distinguish calendar source from organizer; never imply attendance |
| AI Opportunity Audit | Too much discovery and unanchored scoring | Begin with plausible workflows; request a redacted example; include review and maintenance in savings; produce sample prompt and week-one checklist |
| Grand Opening | Eight-week plan could conflict with imminent opening | Scale to actual lead time, separate essentials, identify readiness dependencies |
| Seasonal Promotion | Profitability could be assumed | Offer-cost worksheet and explicit margin uncertainty |
| Local B2B Prospecting | Searching the sold service finds vendors instead of buyers | Infer buyer segments, search them separately, preserve unknown buying intent |
| Referral Program | Reward affordability and professional restrictions uncertain | Cost worksheet, restrained first questions, verify regulated incentives |
| Local Supplier Finder | Generic listing could be treated as specialist evidence | Search core service then verify specialization, discard irrelevant results |
| Process Automation Audit | Full intake could delay useful diagnosis | Work through one example, map provisionally, include ongoing maintenance |
| First Hire Plan | Ontario-specific assumptions and hidden management cost | Confirm jurisdiction, count supervision/training, compare alternatives |
| Get More From Your Chamber Membership | Consulting language obscured practical value | Three goals, events and people to meet, contribution, preparation/follow-up, monthly time budget and 90-day review |

## Scenario evidence

- Bakery / slow January weekdays: employer preorder boxes, fitness-studio pickup and hotel guest orders are distinct experiment hypotheses. Live searches found ALIGN Yoga & Pilates and Melissa White Fitness Studio. Their listing does not establish appetite for partnership or demand for a bakery offer. “Build #2” should yield offer mechanics, outreach, channel copy, a 30-day schedule, attribution and a stop rule. September/October events must not be represented as January events.
- Physiotherapy partners: the full abstract query returned physiotherapy/osteopathy practices. A separate gym query found ALIGN, CrossFit Orillia, Melissa White and Nucleo. This supports model-side category expansion. A movement education pilot is a proposal, not a verified clinical referral relationship.
- Next networking event: relevance-ranked results placed October 14 ahead of September 24. Date comparison is essential; a BNI event appearing on the Chamber calendar does not make it Chamber-organized.
- AI pilot: a ten-person office can start with inquiry drafting, meeting actions or document extraction. A useful first test uses ten representative redacted examples, includes review time, and measures correction rate. Savings are estimates until measured.

## Remaining limits

The underlying lexical search still performs poorly for some long natural-language requests: “photograph food” returned food organizations before a photographer; fuzzy matching can confuse massage with mass media. Skills now retry short service/category searches and verify candidates. Improving search ranking remains separate work. Individual client behavior and a live facilitated demo still need observation.

Acceptance prompts for repeat evaluation:

1. “I run a bakery in Orillia. January is slow. I want to increase weekday sales.” Then “Build #2.” Expect useful initial options, no more than two initial material questions, sourced candidates only, and complete execution drafts without restarting discovery.
2. “Find complementary local partners for my physiotherapy clinic.” Expect category expansion, fit hypotheses separate from facts, and no claims of agreement or patient-sharing authorization.
3. “I'm attending the next networking event. Help me prepare.” Expect dates checked, organizer uncertainty preserved, and no fabricated attendees.
4. “My ten-person office spends too much time on admin. Where could AI help?” Expect a small measurable pilot rather than a tool shopping list or long intake.
5. Repeat all four with MCP unavailable. Expect useful plans with partner types and verification tasks, never invented local names.
