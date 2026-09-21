# JIG form insert and master application

## Create a form

`POST /iedoc/jig` accepts `JIG_NO` and `FORM_TYPE: "CREATE"`.
`POST /iedoc/jig/:jigNo/forms` accepts the same form body without `JIG_NO`,
and supports `CREATE` or `INSPECTION`.

The WEBFORM.FORM row must already exist, with CST 0 or 1. All five keys
(`NFRMNO`, `VORGNO`, `CYEAR`, `CYEAR2`, `NRUNNO`) identify the form and its children.

```json
{
  "NFRMNO": 1,
  "VORGNO": "000001",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 1,
  "FORM_TYPE": "CREATE",
  "JIG_NO": "J26-001",
  "JIG_NAME": "Example jig",
  "REV": "0",
  "START_USE_DATE": "2026-02-01",
  "INSPEC_PERIOD": 6,
  "CREATE_BY": "14077",
  "DETAILS": [
    {
      "CHECK_SEQ": 1,
      "CHECK_POINT": "Diameter",
      "INSPECTION_TOOL": "Caliper",
      "MIN": 1,
      "MAX": 2,
      "UNIT": "mm",
      "MEASURED_VALUE": 3
    }
  ],
  "FILES": [
    {
      "FILE_SEQ": 1,
      "FILE_NAME": "inspection.pdf",
      "FILE_PATH": "jig/J26-001/inspection.pdf",
      "FILE_TYPE": "application/pdf",
      "FILE_SIZE": 1234
    }
  ],
  "NG": {
    "DEFECT_DETAIL": "Diameter exceeds maximum",
    "ACTION": "Repair jig",
    "CORRECTIVE": "Adjust diameter",
    "PLAN_DATE": "2026-02-10",
    "LOCATION": "Workshop"
  }
}
```

One transaction inserts JIG_FORM, JIG_FORM_DETAIL, and the supplied optional
JIG_FORM_FILE and JIG_FORM_NG data. Any failed write rolls back the transaction.
Create does not apply data to master. FILES contains stored-file metadata, not
binary uploads. NG is one corrective-action object per form under the current
schema; checkpoint-specific OK/NG results belong to DETAILS. Numerical results
are calculated from MIN/MAX and MEASURED_VALUE.

When NG is supplied on create or save, DEFECT_DETAIL (max 500), ACTION (max 100),
CORRECTIVE (max 100), and PLAN_DATE are required. LOCATION is optional (max 200).
NG has no ACCESS_METHOD or audit columns. Omit NG to leave it unchanged on save;
send NG: null to delete it. GET form returns the same new NG fields.

## Apply the stored form

Prepared service function: `JigService.applyFormToMaster(key, { UPDATE_BY })`.
It does not test whether the current form is finished; the caller handles that
condition. It is not a new HTTP endpoint. The existing
`POST /iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/finish` remains available
and still requires WEBFORM CST 2 before calling the same application logic.

- REV `*` or `0` inserts JIG_MASTER and JIG_CHECKPOINT. Numeric JSON REV 0 is
  normalized to string `0`. An existing JIG_NO is a conflict, not an overwrite.
- Other nonempty revisions update an existing active master. Missing/blank REV
  or a missing master for the update case is rejected.
- Main values come from stored JIG_FORM, and checkpoint definitions from stored
  JIG_FORM_DETAIL. Existing CHECK_SEQ rows are updated, new rows inserted, and
  retired template rows deleted. Historical form data remains unchanged.
- Existing checkpoint CREATE_BY/CREATE_DATE are preserved on update.
- REF_CYEAR2 and REF_NRUNNO record the applied form. Repeated or older requests
  return `applied: false`, without advancing the due date again.
- New master: START_USE_DATE + INSPEC_PERIOD. Update: existing NEXT_INSPEC_DATE
  + the form's INSPEC_PERIOD. Both use day 1 of the resulting month, independent
  of the approval date.
- All checkpoint results must be complete; NG requires corrective-action data.
  Existing chronological form-reference checks still apply. The master and
  checkpoint writes run in one transaction with row locks.

The NG entity matches the supplied table definition. Module registration,
dashboard and frontend files are unchanged. No database migration or deployment
is performed.
