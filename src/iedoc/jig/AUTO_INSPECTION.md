# Auto-create inspection forms

POST /iedoc/jig/auto-inspection

```json
{ "date": "01/03/2026" }
```

The date is required and must be an actual calendar date in dd/mm/yyyy format.
Selects ACTIVE master rows whose NEXT_INSPEC_DATE matches that date (ignores time).
The date selects the current master schedule, not historical schedules already
advanced by approval. This endpoint does not install a scheduler.

Uses WEBFORM FormCreateService.create with NFRMNO 31, VORGNO 051401, CYEAR 26,
and master PIC_EMPNO as both REQBY and INPUTBY, with DRAFT: '1'. The existing
saveDraft routine resets workflow steps to the preparer's draft state and sets
FORM.CST to '1'. WEBFORM assigns the actual creation
date and year/run number; the requested due date is included in its remark.

Each jig runs in one WEBFORM transaction using the existing transaction context:
FORM/FLOW are created by the existing service. Explicit IEDOC SQL copies master,
checkpoint and optional defect NG into JIG_FORM, JIG_FORM_DETAIL, JIG_FORM_NG with
the five generated form keys. MEASURED_VALUE is copied from JIG_CHECKPOINT as the
previous stored measurement; RESULT remains null pending inspection. No attachments
are created. The master and NEXT_INSPEC_DATE are not changed. WEBFORM's database user
needs SELECT/INSERT access to these IEDOC tables and the ability to lock master rows.

The response reports created/skipped/failed counts and an item per JIG_NO. Pending
or finished-but-unapplied forms cause a skip. Row locks and a second due-date check
prevent overlapping runs from creating another pending form. Rejected forms can
be replaced. There is no new job-history table. Applied forms advance the master
schedule and are no longer selected for the original date.

Old NG data is copied if present and step 07 is assigned to PIC_EMPNO. When no old
NG exists, this automatic path leaves the original workflow intact, since results
are not yet known. This is different from the existing create-with-results path.
Inspection approval updates the existing master even when its revision is 0.

No changes to shared WEBFORM files or entities are required. Oracle execution and
database privileges must be verified in the deployment environment.
