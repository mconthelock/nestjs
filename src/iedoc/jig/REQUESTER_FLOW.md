# Requester flow configuration

Manual createForm accepts CREATE only. Use auto-inspection for INSPECTION.
New CREATE forms configure their NG workflow within the creation transaction.

For requester approval, the frontend checks the step, saves the form successfully
with PATCH, then calls:

POST /iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/requester-flow

```json
{ "PICCODE": "14077" }
```

After this request succeeds, call the usual WEBFORM approval action. This endpoint
does not approve the form itself. Both CREATE and INSPECTION are supported. It
accepts prepared/running forms and does not determine the requester step itself.

NG is calculated from saved JIG_FORM_NG presence or an NG checkpoint result.
When numerical limits exist, the measured value determines that result. Clear
obsolete NG data and correct checkpoint values before calling if NG is resolved.

- NG requires PICCODE. Existing step 07 gets VAPVNO/VREPNO updated. Missing step
  07 is inserted with next 04, CSTART 0, CSTEPST 2, CTYPE 3, CAPVSTNO 0, CEXTDATA
  02, CAPVTYPE 1, CAPPLYALL 0, and other supplied optional fields null. VURL comes
  from this WEBFORM's VFORMPAGE. Step 06 is connected to 07 in either case.
- No NG deletes step 07 and connects step 06 to 04. Send {} if no PICCODE is needed.
- All queries use all five form keys including NRUNNO. The form row is locked
  and FLOW changes run in one transaction.

Response: { "updated": true, "hasNg": true, "nextStep": "07" }.
No frontend files or shared WEBFORM files were changed.
