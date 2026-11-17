# Booking calendar and brief mail: setup

The contact modal's **Book a call** tab and the delivery of briefs both run on
Microsoft 365 through one app registration. Until the environment variables
below are set on Vercel, the tab stays hidden and the brief form tells
visitors to write to hello@adamass.se instead.

## How it is kept safe

- **The key never reaches a browser.** The app's secret lives only in Vercel's
  environment variables. All Microsoft calls run on the server
  (`lib/microsoft/graph.ts`).
- **The app can touch three mailboxes and nothing else.** Rights are granted in
  Exchange (RBAC for Applications), not tenant-wide in Entra:
  - calendars of the two founders only (read busy times, write the meeting);
  - sending mail from hello@ only.

  A leaked key could not read anyone else's mail or calendar.
- **Visitors see free times, never your meetings.** The server turns busy
  blocks into bare start and end times and drops subjects, places and
  attendees before anything leaves it. The browser only ever receives a list
  of open start times.
- **No double bookings.** A time is offered only when the calendars are free.
  The server checks the calendars again right before it writes the meeting.
  A repeated request for the same booking is refused by Exchange
  (`transactionId`).
- **Bots and abuse:**
  - Vercel BotID checks every booking, time lookup and brief.
  - Requests must come from adamass.se itself.
  - Bodies are size-capped.
  - Each connection is rate-limited.
  - Every field is validated and length-capped on the server.
  - Invitations and mails are plain text, so nothing a visitor types can
    become markup.
- **Nothing personal in logs or URLs.** Logs carry error codes only. The
  confirmation page reads the booking from the browser tab's session, not the
  address bar.

## 1. Check hello@adamass.se is a mailbox

Microsoft 365 admin center → **Teams & groups → Shared mailboxes** (or
**Users**). hello@ must be a real mailbox (a free shared mailbox is fine), not
only an alias on someone's account. If it is only an alias, either create a
shared mailbox called hello, or use a founder's address for `MAIL_FROM` below.

## 2. Register the app (Entra admin center)

1. Go to https://entra.microsoft.com → **Applications → App registrations →
   New registration**.
2. Fill in the form:
   - Name: `adamass.se booking`.
   - Account types: *Accounts in this organizational directory only*.
   - Redirect URI: leave it empty.

   Then click **Register**.
3. On the overview, copy the **Application (client) ID** and the **Directory
   (tenant) ID**.
4. **Certificates & secrets → New client secret**:
   - Description: `vercel`.
   - Expiry: 12 months.

   Copy the **Value** now; it is shown once.
5. Do **not** add API permissions and do **not** grant admin consent. The
   rights come from step 3, scoped to three mailboxes. A tenant-wide grant in
   Entra would override that scope.
6. **Enterprise applications** → open `adamass.se booking` → copy its **Object
   ID**. This is the enterprise app's ID, not the registration's.

## 3. Limit it to three mailboxes (Exchange Online PowerShell)

On a Mac, install PowerShell once:

```bash
brew install powershell/tap/powershell
```

```bash
pwsh
```

Then, in PowerShell, replace `<client id>` and `<enterprise object id>`:

```powershell
Install-Module ExchangeOnlineManagement -Scope CurrentUser
Connect-ExchangeOnline

New-ServicePrincipal -AppId <client id> -ObjectId <enterprise object id> -DisplayName "adamass.se booking"

New-ManagementScope -Name "adamass booking calendars" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'vlatko.kotevski@adamass.se' -or PrimarySmtpAddress -eq 'aleksandar.kotevski@adamass.se'"
New-ManagementScope -Name "adamass booking mail" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'hello@adamass.se'"

New-ManagementRoleAssignment -App <client id> -Role "Application Calendars.ReadWrite" -CustomResourceScope "adamass booking calendars"
New-ManagementRoleAssignment -App <client id> -Role "Application Mail.Send" -CustomResourceScope "adamass booking mail"

# Calendars: InScope True for a founder. Mail: InScope True for hello@. Anyone else: False.
Test-ServicePrincipalAuthorization -Identity <client id> -Resource vlatko.kotevski@adamass.se
Test-ServicePrincipalAuthorization -Identity <client id> -Resource hello@adamass.se
```

Exchange can take 30 minutes to 2 hours to apply the assignments everywhere.

## 4. Environment variables on Vercel

Vercel → the project → **Settings → Environment Variables** → Production. Mark
the secret as **Sensitive**.

| Name | Value |
| --- | --- |
| `MS_TENANT_ID` | Directory (tenant) ID |
| `MS_CLIENT_ID` | Application (client) ID |
| `MS_CLIENT_SECRET` | the secret's Value |
| `BOOKING_HOSTS` | `vlatko.kotevski@adamass.se,aleksandar.kotevski@adamass.se` |
| `BOOKING_MODE` | `all` (both join every call) or `any` (whoever is free takes it) |
| `MAIL_FROM` | `hello@adamass.se` |
| `BRIEF_TO` | where briefs go, comma-separated (defaults to `MAIL_FROM`) |

Then **Redeploy**. The Book a call tab appears with that deployment.

## 5. Try it

Book a time on the live site with your own address:

1. Check the meeting is in both calendars.
2. Check the invitation arrived.
3. Check the host note reached your inbox.

Whether Microsoft adds a Teams link to meetings an app creates is not
documented. The code asks for one and books without it if refused. Look in the
invitation to see which happened.

## Hours and rules

Set in `lib/booking/slots.ts` (`RULES`):

- Monday to Friday, 09:00 to 17:00 Stockholm time.
- 30-minute calls.
- At least 24 hours' notice.
- Up to three weeks ahead.

Anything already in your calendars blocks a time, including tentative and away.

## Renewing the secret

The secret expires after 12 months. Before then:

1. Create a new one (step 2.4).
2. Replace `MS_CLIENT_SECRET` on Vercel.
3. Redeploy.
4. Delete the old secret.
