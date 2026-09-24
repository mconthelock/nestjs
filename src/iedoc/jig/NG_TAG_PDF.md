# NG Tag PDF

GET /iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/ng-tag.pdf

Returns application/pdf with inline disposition and no-store caching. Open in a
browser tab to view, download or print at actual size on A5 portrait (148 x 210 mm).
Use the existing frontend authentication when requesting this endpoint.

```js
window.open(`${apiUrl}/iedoc/jig/forms/${nfrmno}/${encodeURIComponent(vorgno)}/${cyear}/${cyear2}/${nrunno}/ng-tag.pdf`, '_blank', 'noopener');
```

If your API requires a bearer token, fetch with that token, check response.ok,
read the response as a Blob and open its object URL instead of window.open(URL).

Data sources: JIG_FORM (PROCESS_CODE is the actual process column), JIG_FORM_NG,
WEBFORM.FORM.DREQDATE, and WEBFORM.FLOW joined to AMEC.AMECUSERALL. All form queries
use all five keys including NRUNNO. Missing form/NG returns 404.

Stamps: -- inspector / 06 approval / 07 foreman. Only CAPVSTNO 1 with DAPVDATE is
stamped; otherwise the circle says PENDING. Uses actual approver VREALAPV, falling
back to VAPVNO. Displays SSEC / fixed AMEC / JIG_FORM.LOCATION respectively,
approval date dd/mm/yyyy in Asia/Bangkok, and the first word of SNAME. If multiple
approved rows exist for one step, the most recently dated row is selected.

ACTION shows ADJUST/MODIFY/REPLACE checkboxes for those exact values; otherwise
prints the stored action text. Includes NG LOCATION as well as PLAN_DATE.

Renderer uses the project's Playwright Chromium and embeds existing local
THSarabun fonts. Ensure Chromium is installed for the service account and
public/fonts/THSarabun.ttf and THSarabun Bold.ttf are deployed. All data text is
HTML-escaped and content has no remote resource URLs. Long text is fitted to the
allocated area; an overflow error is raised rather than silently truncating it.
No JIG data, workflow or attachment record is changed by generating this PDF.
