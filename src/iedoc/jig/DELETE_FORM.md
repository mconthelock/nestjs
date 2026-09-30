# JIG deletion forms

Create WEBFORM.FORM and FLOW first using the existing webform create API, then pass its actual five keys to this API. The API does not allocate a webform number or approve/reject a workflow.

## Request deletion

POST /iedoc/jig/delete-forms

```json
{
  "NFRMNO": 32,
  "VORGNO": "051401",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 4,
  "JIG_NO": "J26-001",
  "REASON": "Obsolete",
  "DETAIL": "No longer used"
}
```

Keys above are illustrative; use the actual delete-form definition and generated keys.
Only ACTIVE JIGs and WEBFORM CST 0/1 are accepted. In one IEDOC transaction:
- Lock JIG_MASTER and WEBFORM.FORM.
- Read INPUTBY persisted as WEBFORM.FORM.VINPUTER using all five form keys and obtain the unique nonblank HEADNO from WEBFORM.SEQUENCEORG.
- Insert JIGDEL_FORM; update VAPVNO and VREPNO on every FLOW row matching all five keys and CEXTDATA='02'.
- Update JIG_MASTER.JIG_STATUS to PENDING_DELETE.
Missing/ambiguous HEADNO, missing target flow, duplicate form, or database failure aborts the transaction. No physical JIG data is deleted.

## Read / complete

GET /iedoc/jig/delete-forms/{NFRMNO}/{VORGNO}/{CYEAR}/{CYEAR2}/{NRUNNO}

After the webform approval action has committed:
- POST the same URL plus /finish (empty body): requires stored WEBFORM.FORM.CST='2', sets DELETED.
- POST the same URL plus /reject (empty body): requires stored WEBFORM.FORM.CST='3', sets ACTIVE.

The frontend must call the matching endpoint after successful final approval/rejection, and retry if synchronization fails. This is not an automatic hook in shared webform code. Outcome endpoints derive JIG_NO from JIGDEL_FORM, never from caller-supplied status. Duplicate calls at the target state return updated=false; a callback conflicting with another active/finished deletion is rejected.

The existing dashboard/auto-inspection selects ACTIVE, so PENDING_DELETE and DELETED are excluded. Cross-schema access to WEBFORM.FORM, WEBFORM.FLOW and WEBFORM.SEQUENCEORG is required for the IEDOC connection. Existing database constraints and foreign key remain database-managed, consistent with JIG_FORM.

## Shared attachments and requester edits

Delete forms store attachment metadata in JIG_FORM_FILE, scoped by all five WEBFORM keys. No JIG_FORM header is inserted for a delete request. Physical files use IE-DELJIGYY-NNNNNN under the configured PHP upload root.

POST /delete-forms accepts optional FILES (maximum 5 JigFileDto records) and inserts them in the same transaction as JIGDEL_FORM, flow reassignment and PENDING_DELETE. GET /delete-forms/{five keys} returns FILES ordered by FILE_SEQ.

PATCH /delete-forms/{five keys} accepts REASON, DETAIL, FILES and required UPDATE_BY. It requires a running/prepared form, PENDING_DELETE master and the active requester step (--). Keep existing FILE_SEQ values; assign new files the next unused number. Send all remaining records. Removing persisted files must use the delete endpoint first.

DELETE /delete-forms/{five keys}/files/{FILE_SEQ} removes only that form's JIG_FORM_FILE record. The PHP deletefile action checks requester permissions, chooses this route using FORMMST.VANAME, and deletes the physical file only after API success. Preview/download use the same scoped folder resolver.

The frontend uploads files before POST/PATCH. It calls shared doaction for Approve/Return/Reject, then reads FORM.CST and invokes finish only for 2 or reject only for 3. A failed status callback can be retried without repeating doaction. Database constraints remain externally managed (synchronize is disabled); file rows must support both JIG and delete-form keys.
