# JIG form snapshots — September 2026

## Database mapping

- `JIG_MASTER.ITEMNO`: 4 characters; `PARTS` replaced by `JIG_DESC` (100 characters).
- `JIG_FORM` stores the complete jig snapshot from the supplied DDL. It no longer depends on an existing master row. The existing database FK to `WEBFORM.FORM` remains in effect.
- `JIG_FORM_DETAIL` stores checkpoint definitions and results without `UPDATE_BY` or `UPDATE_DATE`.
- No extra database columns or tables are required by these changes. No migration has been executed.
- `FORM_TYPE` accepts only `CREATE` and `INSPECTION`, as specified by the database constraint.

## Creating and editing

IE PIC dropdown: `GET /iedoc/jig/ie-pics` returns an array of `{ SEMPNO, SNAME, SPOSNAME }`, ordered by name then employee number. It selects employees from `AMEC.AMECUSERALL` with `SDEPCODE = '051401'`, `CSTATUS = '1'`, and `SPOSCODE NOT IN ('30', '20', '21')`. Use `SEMPNO` as the option value / `PIC_EMPNO`, and `SNAME` with `SPOSNAME` as the label.

Create the WEBFORM and approval flow first, then attach the jig data. The WEBFORM must have status `0` or `1`.

`POST /iedoc/jig` now creates a CREATE form snapshot, not a draft master row. Example:

```json
{
  "NFRMNO": 1,
  "VORGNO": "000001",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 123,
  "FORM_TYPE": "CREATE",
  "JIG_NO": "J26-001",
  "JIG_NAME": "Drilling jig",
  "START_USE_DATE": "2026-02-19",
  "INSPEC_PERIOD": 6,
  "ITEMNO": "0001",
  "JIG_DESC": "Traction machine",
  "CHECKPOINTS": [
    { "CHECK_SEQ": 1, "CHECK_POINT": "Diameter", "MIN": 1, "MAX": 2, "UNIT": "mm" }
  ]
}
```

Use actual WEBFORM keys. `POST /iedoc/jig/:jigNo/forms` accepts the same data without `JIG_NO`. For INSPECTION, it copies the current master fields and checkpoint template unless replacements are supplied. CREATE without a master requires `JIG_NAME`, `START_USE_DATE`, `INSPEC_PERIOD`, and nonempty `CHECKPOINTS`.

`PATCH /iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO` edits snapshot fields and/or results:

```json
{
  "JIG_DESC": "Updated description for this form",
  "DETAILS": [{ "CHECK_SEQ": 1, "MEASURED_VALUE": 1.5 }]
}
```

The master remains unchanged. `PATCH /iedoc/jig/:jigNo` is an alternate snapshot edit route requiring `FORM_KEY` with all five keys. It no longer permits direct schedule/status/master edits. Approved and rejected forms cannot be edited.

Do not send removed fields (`PARTS`, `SCHEDULE_DATE`, `CHECK_DATE`, `INSPECTOR_EMPNO`, header `CREATE_BY`, or `OVERALL_RESULT`). `UPDATE_BY` on save remains an input for NG audit only; it is not persisted in the form header or detail. File and NG tables keep their existing audit columns.

## Applying approval

After WEBFORM reaches status `2`, call the existing `POST /iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/finish` endpoint. This change does not add a workflow callback.

- All checkpoint results must be complete; numerical checks require measurements. NG requires corrective-action details.
- CREATE inserts/activates master from the approved snapshot. First due month = `START_USE_DATE + INSPEC_PERIOD`, always day 1. Example: 19 February 2026 + 6 months = 1 August 2026.
- INSPECTION applies the approved snapshot and advances the existing master due month by that snapshot's period. Example: due 1 February 2026, approved in March, period 6 = next due 1 August 2026.
- Master and checkpoint template changes commit in the same transaction.
- `REF_CYEAR2 / REF_NRUNNO` now identify the **last applied form**, including INSPECTION. Calling finish again for that form or an older applied form returns `applied: false`.
- Only one unresolved form per jig is allowed. An approved form must be applied before the next form is opened. New reference pairs must increase by year/run number, and pairs cannot be reused for the same jig under different WEBFORM keys. These rules make the two-column master reference unambiguous.

## History and dashboard

`GET /iedoc/jig/:jigNo/forms` returns historical headers, including forms without a master. `GET /iedoc/jig/forms/...` returns the stored header, details, NG and files. `OVERALL_RESULT` is computed from detail results, not stored. Listing date/inputer come from WEBFORM (`FORM_DATE`, `INPUTER`).

Dashboard includes pending CREATE registrations before master exists. Completed inspection months are reconstructed backwards from master due month using each applied form's snapshot period; the dashboard's `SCHEDULE_DATE` is a calculated response field, not a database column. Rejected forms have no inferred historical due month. Complete header/checkpoint history remains available regardless.

Before using existing migrated records, reconcile their master reference to the actual last applied form, and preserve complete approved form history and snapshot periods. Previously the reference could point only to registration/revision; that old meaning is insufficient to identify applied inspection rounds. Manual changes to master due dates or deleting approved history invalidate reconstruction. The API now prevents direct master date edits; no historical data has been rewritten automatically.
