# Prosper Plus Chauffeur — Customer Portal Requirements

> **Document type:** Product / Functional Requirements (Customer Web)  
> **Version:** 0.1 — Demonstration baseline  
> **Status:** Draft for review  
> **Business model:** Own Fleet · **Platform:** Responsive Web · **Market:** B2C + B2B  
> **Design direction:** Luxury Premium (Midnight Navy / Champagne / Ivory)

## 1. Purpose

This document defines the customer-facing website requirements for Prosper Plus Chauffeur, a premium car-with-driver service. Customers can discover services and vehicle categories, submit a booking request, review a quotation, make payment, and track a booking. The company owns and operates the fleet; customers select a vehicle category while operations staff assign the actual vehicle and driver.

This is a requirements baseline and prototype specification, not a production-ready booking or payment system.

## 2. Scope

### 2.1 In scope

- Public marketing website and service catalogue
- Fleet catalogue and vehicle-category details
- Booking request wizard
- Customer information and guest checkout
- Booking review and quotation presentation
- Payment handoff and payment status display
- Booking confirmation and tracking
- Customer account, profile and booking history
- Corporate service inquiry
- Contact, FAQ, Terms and Privacy pages
- Responsive desktop, tablet and mobile layouts

### 2.2 Out of scope for this customer-portal MVP

- Admin dispatch and fleet operations UI
- Driver mobile portal
- Live GPS tracking
- Actual payment gateway integration
- Real-time fleet availability engine
- Corporate credit billing and contract execution
- Native iOS / Android applications

## 3. Actors

| Actor | Description |
|---|---|
| Guest Customer | Browses and submits a booking without an account |
| Registered Customer | Manages profile and views own bookings |
| Corporate Enquirer | Submits a corporate service inquiry |
| Customer Support | Assists customers; operational actions occur in Admin Portal |
| System | Validates data, calculates quotation, stores booking and communicates status |

## 4. Service Catalogue

| Code | Service | Pricing model | Key inputs |
|---|---|---|---|
| SVC-001 | Airport Transfer | Fixed route / zone | Airport, pickup/drop-off, date/time, flight details where applicable |
| SVC-002 | Point-to-Point | Route / distance / zone | Pickup, destination, date/time |
| SVC-003 | Hourly Chauffeur | Per hour | Pickup, date/time, duration |
| SVC-004 | Daily Chauffeur | Per day | Start/end date, pickup location |
| SVC-005 | Intercity Trip | Route / distance / package | Origin, destination, date/time, return details if applicable |

All listed services are chauffeur-driven. Self-drive rental is not included.

## 5. Customer Sitemap

| Screen ID | Screen | Purpose | Priority |
|---|---|---|---|
| CUS-001 | Homepage | Brand, service discovery, quick booking | Must |
| CUS-002 | Service Listing | Browse service types | Must |
| CUS-003 | Fleet Listing | Filter vehicle categories | Must |
| CUS-004 | Vehicle Detail | Review vehicle category and features | Must |
| CUS-005 | Booking — Service Details | Capture journey requirements | Must |
| CUS-006 | Booking — Vehicle Selection | Select suitable vehicle category | Must |
| CUS-007 | Booking — Customer Information | Capture booker/passenger details | Must |
| CUS-008 | Booking — Review & Confirmation | Review booking and price snapshot | Must |
| CUS-009 | Payment | Pay deposit or full amount | Must |
| CUS-010 | Booking Success | Show reference and next steps | Must |
| CUS-011 | Booking Tracking | Secure booking status lookup | Must |
| CUS-012 | Login / Register | Customer authentication | Should |
| CUS-013 | Customer Dashboard | Customer account overview | Should |
| CUS-014 | Booking History | List customer bookings | Should |
| CUS-015 | Booking Detail | Full booking information and actions | Should |
| CUS-016 | Customer Profile | Maintain customer information | Should |
| CUS-017 | Corporate Inquiry | Capture B2B leads | Should |
| CUS-018 | Contact / FAQ | Self-service support | Should |
| CUS-019 | Terms & Conditions | Publish service terms and versions | Must |
| CUS-020 | Privacy Policy | Privacy notice and consent information | Must |

## 6. Primary User Flow

1. Customer visits Homepage.
2. Customer chooses a service and enters pickup, destination, date, time, passengers and luggage.
3. System validates the request and checks service-area eligibility.
4. System retrieves vehicle categories that meet passenger, luggage and service constraints.
5. Customer selects a vehicle category.
6. System calculates a quotation using server-side pricing rules.
7. Customer enters contact and passenger information (guest checkout is allowed).
8. Customer reviews the journey, selected category, conditions and price snapshot.
9. Customer confirms the booking request.
10. System creates a booking reference and payment intent according to configured payment policy.
11. Customer pays a deposit or full amount using an enabled payment method.
12. System confirms payment from a trusted gateway response/webhook.
13. Customer receives confirmation and can track the booking.

### 6.1 Booking status and payment status are separate

Booking status examples: Draft, Pending Payment, Confirmed, Pending Assignment, Assigned, In Progress, Completed, Cancelled, No Show.

Payment status examples: Unpaid, Pending, Partially Paid, Paid, Failed, Partially Refunded, Refunded.

The UI must never infer `Paid` from a browser redirect alone. Payment status must be confirmed by the backend using a verified gateway response.

## 7. Screen Functional Requirements

### CUS-001 — Homepage

**Purpose:** Introduce the brand and start a booking.

**Components**
- Global header: logo, Services, Our Fleet, Corporate, Login, Book Now
- Hero message and primary CTA
- Quick booking form
- Service cards
- Featured fleet categories
- Trust / service-quality section
- Corporate CTA
- Footer with support and legal links

**Fields**
| Field | Type | Required | Rules |
|---|---|---:|---|
| Service Type | Select | Yes | Active service only |
| Vehicle Category | Select | No | Active category only |
| Pickup Location | Location autocomplete / text in prototype | Yes | Must resolve to supported service area |
| Destination | Location autocomplete / text in prototype | Yes | Must resolve to supported service area |
| Pickup Date | Date | Yes | Must satisfy minimum lead time |
| Pickup Time | Time | Yes | Must be within configured service hours |
| Passengers | Integer / select | Yes | Positive integer |
| Luggage | Integer / select | No | Non-negative integer |

**Interactions**
- Book Now scrolls to quick booking.
- Service cards preselect service type.
- Search validates required fields and creates a booking search context.
- Search navigates to vehicle results in the production application.

### CUS-002 — Service Listing

**Components:** service cards, description, pricing model summary, service-area notes, Book Service CTA.

**Rules:** show active services only; service selection carries the service ID into the booking flow.

### CUS-003 — Fleet Listing

**Components:** category filters, passenger and luggage filters, feature filters, sort, vehicle cards.

**Rules:** only active vehicle categories are public; capacity filters must use configured category/vehicle specifications; actual availability is date- and journey-dependent and must be checked server-side.

### CUS-004 — Vehicle Detail

**Components:** image gallery, category name, description, passenger/luggage capacity, amenities, service eligibility, booking CTA.

**Rules:** capacities shown must reflect configured fleet data. Do not publish illustrative values as guaranteed capacity.

### CUS-005 — Booking: Service Details

**Fields**
| Field | Type | Required | Validation |
|---|---|---:|---|
| Service Type | Select | Yes | Active service |
| Pickup Location | Places autocomplete | Yes | Supported service area |
| Pickup Coordinates | System | Yes | Derived from selected place |
| Destination | Places autocomplete | Conditional | Required for route-based service |
| Destination Coordinates | System | Conditional | Derived from selected place |
| Pickup Date | Date | Yes | Minimum lead time |
| Pickup Time | Time | Yes | Service operating hours |
| Passenger Count | Integer | Yes | Greater than zero |
| Luggage Count | Integer | No | Zero or greater |
| Duration | Integer | Conditional | Required for hourly/daily services |
| Return Date/Time | Date/time | Conditional | Required for return service |
| Additional Stops | Repeater | No | Each stop must be serviceable |
| Special Request | Textarea | No | Maximum 500 characters |

**Interactions:** service type dynamically changes relevant fields; location selection resolves coordinates; date/time triggers service and lead-time validation; Continue persists a draft and proceeds to CUS-006.

### CUS-006 — Booking: Vehicle Selection

**Components:** journey summary, compatible vehicle-category cards, capacity/features, price estimate, select action.

**Rules**
- Customer selects a vehicle category, not the actual registration number.
- Actual vehicle assignment is performed by Operations.
- Exclude categories that cannot meet passenger, luggage or service constraints.
- Recheck availability before booking confirmation.
- Display an alternative or contact path when no suitable category is available.

### CUS-007 — Booking: Customer Information

**Fields**
| Field | Type | Required | Validation |
|---|---|---:|---|
| Booking For | Radio | Yes | Myself / Someone Else |
| Booker Name | Text | Yes | Non-empty |
| Email | Email | Yes | Valid format |
| Phone | Phone | Yes | Valid country/number format |
| Passenger Name | Text | Conditional | Required when booking for someone else |
| Flight Number | Text | Conditional | Required only when configured for airport pickup |
| Meeting Point | Text | No | Length limit |
| Special Instruction | Textarea | No | Length limit |
| Terms Acceptance | Checkbox | Yes | Must be accepted |
| Privacy Notice Acknowledgement | Checkbox / record | Yes | Record notice version and timestamp |
| Marketing Consent | Checkbox | No | Separate, optional consent |

**Rules:** guest checkout is supported. Marketing consent must not be bundled with booking acceptance. Capture the applicable privacy notice version and consent/acknowledgement metadata.

### CUS-008 — Booking Review & Confirmation

**Components:** journey summary, vehicle category, customer information, itemised price, deposit due, balance, cancellation/booking terms.

**Rules**
- Quotation must be valid and not expired.
- Recalculate price server-side before confirmation.
- Recheck availability and serviceability.
- Save a price snapshot against the booking.
- Confirm action must be idempotent to prevent duplicate bookings.
- Any edits return to the relevant step and refresh quotation.

### CUS-009 — Payment

**Components:** booking reference, total, deposit, outstanding balance, enabled payment methods, payment status.

**Rules**
- Amount must be calculated and validated server-side.
- Payment method must be enabled for the booking.
- Never store raw card data in the application.
- Verify gateway callback/webhook signature.
- Handle pending, failed, expired and successful payments.
- Retries must not create duplicate charges or duplicate bookings.

### CUS-010 — Booking Success

**Components:** booking reference, booking summary, payment status, confirmation message, next steps, download confirmation.

**Rules:** display payment status from backend; do not show Paid until verified. Send confirmation through configured channels.

### CUS-011 — Booking Tracking

**Fields:** booking reference and registered email/phone.

**Rules**
- Verify contact information against the booking.
- Apply rate limiting and abuse protection.
- Do not reveal sensitive personal information.
- Reveal assigned driver/vehicle details only according to operational disclosure policy.
- Return only status and information authorised for the customer.

### CUS-012 to CUS-016 — Customer Account

- Login/register, secure password reset and OTP verification where configured.
- Dashboard shows upcoming and recent bookings.
- Booking history supports filters, sort and pagination.
- Booking detail shows current status, payment, assigned vehicle/driver when authorised, and available actions.
- Profile updates to email/phone require re-verification.
- Account deletion requests follow retention and legal requirements.

### CUS-017 — Corporate Inquiry

**Fields:** company name, tax ID (optional), contact person, business email, phone, service requirements, estimated trip volume, budget range (optional), additional details.

**Interactions:** validate and submit inquiry, generate inquiry reference, notify Sales/Admin, send acknowledgement.

### CUS-018 to CUS-020 — Support and Legal

- Contact/FAQ: phone, email, LINE OA, support form, service areas and FAQ categories.
- Terms: versioned terms, effective date, booking/payment/cancellation/waiting/overtime rules.
- Privacy: collection purposes, disclosures, retention, data-subject rights, cookies and contact channel.

## 8. Business Rules

| Rule ID | Rule |
|---|---|
| BR-CUS-001 | All services are chauffeur-driven; no self-drive booking. |
| BR-CUS-002 | Customer selects vehicle category; Operations assigns actual vehicle. |
| BR-CUS-003 | Booking date/time must satisfy configured lead time and service hours. |
| BR-CUS-004 | Pickup and destination must be within supported service areas. |
| BR-CUS-005 | Vehicle category must meet passenger/luggage and service requirements. |
| BR-CUS-006 | Actual availability must be rechecked before booking confirmation. |
| BR-CUS-007 | Price is calculated server-side and saved as a booking price snapshot. |
| BR-CUS-008 | Booking and payment status are separate state machines. |
| BR-CUS-009 | Payment success requires trusted gateway verification. |
| BR-CUS-010 | Confirmation requests and payment callbacks must be idempotent. |
| BR-CUS-011 | Cancellation/refund follows the policy version attached to the booking. |
| BR-CUS-012 | Guest tracking requires booking reference plus verified contact. |
| BR-CUS-013 | Marketing consent is optional and separate from service processing. |
| BR-CUS-014 | Customer can only access their own account bookings. |
| BR-CUS-015 | All material changes are recorded in audit history. |

## 9. Validation Standards

| Validation ID | Rule | Example |
|---|---|---|
| VAL-001 | Required | Required fields cannot be blank |
| VAL-002 | Email | Valid email syntax |
| VAL-003 | Phone | Valid international phone format |
| VAL-004 | Numeric | Positive passenger count |
| VAL-005 | Range | Duration within service limits |
| VAL-006 | Date/time | Minimum lead time and operating hours |
| VAL-007 | Date range | End must be after start |
| VAL-008 | Location | Place must be serviceable |
| VAL-009 | Capacity | Vehicle capacity must satisfy request |
| VAL-010 | Price | Server-calculated only |
| VAL-011 | Duplicate prevention | Idempotency key |
| VAL-012 | Authorisation | Customer can access own records only |

## 10. Non-Functional Requirements

| ID | Requirement | Target / Notes |
|---|---|---|
| NFR-001 | Responsive | Desktop, tablet and mobile |
| NFR-002 | Performance | Target common pages under 3 seconds under agreed test conditions |
| NFR-003 | Transport security | HTTPS |
| NFR-004 | Authentication | Secure session and password handling |
| NFR-005 | Authorisation | Role- and ownership-based access |
| NFR-006 | Privacy | PDPA review and data minimisation |
| NFR-007 | Availability | Proposed service target 99.5% monthly, subject to hosting/SLA |
| NFR-008 | Backup | Daily backup and tested restore procedure |
| NFR-009 | Localisation | Thai and English |
| NFR-010 | Timezone | Store timestamps consistently; display Asia/Bangkok |
| NFR-011 | Accessibility | Keyboard support, labels, focus and contrast |
| NFR-012 | Payment security | Use compliant gateway-hosted payment components |

## 11. Suggested Data Entities

| Entity | Purpose |
|---|---|
| customers | Customer identity and contact details |
| customer_addresses | Saved customer addresses |
| service_types | Service catalogue |
| service_areas | Supported zones and destinations |
| vehicle_categories | Public vehicle categories |
| vehicles | Owned fleet master records |
| bookings | Booking header and journey |
| booking_stops | Additional journey stops |
| booking_assignments | Actual vehicle/driver assignments |
| booking_price_snapshots | Confirmed price components |
| booking_status_history | Status transition history |
| quotations | Time-limited price quotations |
| payments | Payment attempts and results |
| refunds | Refund transactions |
| customer_consents | Notice/consent records and versions |
| corporate_inquiries | B2B leads |
| reviews | Post-trip customer feedback |
| notifications | Delivery and notification records |
| audit_logs | Important system changes |

## 12. API Boundary (Proposed)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/services` | List active services |
| GET | `/api/v1/vehicle-categories` | List vehicle categories |
| POST | `/api/v1/availability/search` | Search compatible availability |
| POST | `/api/v1/quotations` | Create quotation |
| POST | `/api/v1/bookings` | Create booking |
| GET | `/api/v1/bookings/{reference}` | Retrieve authorised booking |
| POST | `/api/v1/bookings/{reference}/confirm` | Confirm booking |
| POST | `/api/v1/payments/intents` | Create payment intent |
| GET | `/api/v1/payments/{id}` | Retrieve payment status |
| POST | `/api/v1/bookings/track` | Secure guest tracking |
| POST | `/api/v1/corporate-inquiries` | Submit corporate inquiry |
| POST | `/api/v1/reviews` | Submit post-trip review |

All endpoints are proposals. Authentication, authorisation, request schemas, error contracts, idempotency and rate limits must be specified before implementation.

## 13. UAT Scenarios

| Test ID | Scenario | Expected Result |
|---|---|---|
| UAT-CUS-001 | Open homepage | Main content and navigation display |
| UAT-CUS-002 | Search with valid trip details | Compatible categories are returned |
| UAT-CUS-003 | Passenger count exceeds category capacity | Incompatible category excluded |
| UAT-CUS-004 | Select past pickup date | Validation error |
| UAT-CUS-005 | Unsupported service area | Clear service-area message |
| UAT-CUS-006 | Invalid email | Field-level validation |
| UAT-CUS-007 | Submit valid booking | Unique booking reference created |
| UAT-CUS-008 | Gateway confirms payment | Payment status becomes Paid |
| UAT-CUS-009 | Gateway payment fails | Failed state and safe retry |
| UAT-CUS-010 | Duplicate confirm request | No duplicate booking |
| UAT-CUS-011 | Guest tracking with mismatched contact | No booking details disclosed |
| UAT-CUS-012 | Customer opens another customer's booking | Access denied |
| UAT-CUS-013 | Mobile viewport | Responsive layout and usable controls |
| UAT-CUS-014 | Marketing consent left unchecked | Booking can proceed |

## 14. Open Decisions Before Production

1. Minimum booking lead time by service.
2. Service operating hours and blackout dates.
3. Supported service areas and route/zone definitions.
4. Vehicle category capacities and exact fleet inventory.
5. Pricing rules, overtime, waiting time, tolls and parking policy.
6. Deposit percentage and payment deadline by service.
7. Cancellation/refund policy and policy versioning.
8. Airport flight monitoring and waiting-time rules.
9. Guest booking verification method.
10. Notification channels and templates.
11. Thai/English content ownership.
12. Legal review for chauffeur operation, vehicle/driver licensing, insurance and PDPA.

## 15. Prototype Notes

The accompanying `index.html` is a static front-end demonstration. It includes responsive layout, sample service and vehicle cards, quick-booking field validation, a session-only demo request summary and a booking-tracking modal placeholder.

It does **not** connect to a backend, live fleet availability, real quotation engine, customer database, Google Maps, payment gateway, LINE OA or email service. Replace sample contact details, capacities and all illustrative content before public launch.
