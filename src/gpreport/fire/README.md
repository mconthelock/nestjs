# Fire master API

Base route: /fire (prepend any API prefix configured by the application).

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /fire | Search and paginate |
| GET | /fire/:fireCode | Get one item |
| POST | /fire | Insert |
| PATCH | /fire/:fireCode | Update supplied fields |
| DELETE | /fire/:fireCode | Permanently delete |

GET /fire?search=ABC&AREA=Factory&STATUS=1&page=1&limit=20

Search is case insensitive across FIRE_CODE, LOCATION, FTYPE, CAPACITY and AREA.
Individual filters use the uppercase column names and combine with AND;
STATUS uses exact matching, including "0". Search treats %, _ and ! literally.
Default page=1, limit=20; maximum limit=100. Ordered by FIRE_CODE ascending.

Response: { data: [...], total: 42, page: 1, limit: 20, totalPages: 3 }.

POST body:
```json
{
  "FIRE_CODE": "F001",
  "LOCATION": "Building A",
  "FTYPE": "CO2",
  "CAPACITY": "10 lbs",
  "AREA": "Factory",
  "STATUS": "1"
}
```

PATCH body: { "LOCATION": "Building B", "STATUS": "0" }.
FIRE_CODE cannot be changed. Omitted fields stay unchanged; null clears a field.
Oracle also stores empty strings as NULL.
STATUS accepts any string of up to one character, matching the supplied schema.

Errors: 400 invalid body/query or empty update, 404 missing item,
409 duplicate FIRE_CODE. Delete response:
{ message: "FIRE_ITEM_DELETED", FIRE_CODE: "F001" }.


## Safety Fire screens

The existing CRUD routes above remain available. The Safety screens use these
additional routes to preserve their original behavior:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /fire/items | All masters, active and inactive, ordered by FIRE_CODE; response `{items: [...]}` |
| POST | /fire/save | Create or edit using the original screen fields and optional `original_code` |
| POST | /fire/deactivate | Set STATUS to `0`; never permanently delete from the screen |
| POST | /fire/inspection/check | Multipart `month` (YYYY-MM) and `excel` (.xlsx or .xls) |

Save accepts multipart form data or JSON. Text is trimmed; FIRE_CODE is required
and immutable on edit. Oracle UTF-8 byte limits are enforced (20 for FIRE_CODE,
100 for LOCATION, FTYPE, CAPACITY and AREA); STATUS must be `0` or `1`.
An inactive code still counts as a duplicate. Save/deactivate responses contain
a Thai `message` matching the Safety screen.

Inspection accepts files up to 10 MB, at most 20 worksheets and 50,000 rows per
worksheet. It reads every worksheet from row 2, dates from G and codes from J
through BE only. Excel serial dates (including numeric text) and m/d/yyyy dates
are supported. The last parenthesized code is used, Unicode whitespace is
removed, duplicates are counted once and comparison is case sensitive against
active masters only. The result preserves the original report keys:
`month`, `filename`, `master_count`, `matched_rows`, `found_count`, `matched_count`,
`missing`, `unexpected`, `invalid_cells`, `invalid_dates`, `complete`.

No database schema changes are required. Deploy the API changes before the
Safety bundles. The browser uses APP_API and no longer posts CRUD/inspection
to the PHP controllers. Legacy PHP reader/model and source scripts have been removed from Safety
after verifying that the refactored screens no longer reference them.
