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

