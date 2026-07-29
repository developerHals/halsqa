# Importing events into the Quality Calendar via CSV

The **Quality Calendar** supports bulk uploading events from a CSV file. This guide explains how to prepare the file row-by-row.

## File format

The importer expects a plain text CSV file:

- The first line must be a header row with the exact column names.
- Each following line is one event.
- Columns are separated by commas.
- Use double quotes around a value if it contains a comma, quote, or line break.
- Inside quotes, escape a double quote by writing it twice (`""`).

### Required header

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
```

### Columns

| Column | Required? | Accepted values | Notes |
|---|---|---|---|
| `event_type` | Yes | `banner` or `single` | `banner` creates a multi-day banner; `single` creates a one-day or standalone event. |
| `title` | Yes | any text | Used as the event title. Banner titles are used to link child `single` events. |
| `description` | No | any text | Optional details shown in the calendar modal. |
| `start_date` | Yes | `YYYY-MM-DD` | Start date in ISO format, e.g. `2026-09-01`. |
| `end_date` | Yes | `YYYY-MM-DD` | End date in ISO format. For a one-day event use the same value as `start_date`. |
| `include_weekends` | No | `0` or `1` | `1` means the banner is shown on Saturday/Sunday; `0` (default) means it skips weekend days visually. |
| `parent_title` | No | exact title of a banner | For `single` events only. Links the single event to a banner with this title. |
| `color_hex` | No | hex color, e.g. `#00C4DF` | Default is `#00C4DF` (HALSQ brand cyan). |

## Two-pass import

The import runs in two passes:

1. **Banners first** — every row whose `event_type` is `banner` is imported.
2. **Singles second** — every row whose `event_type` is `single` is imported.

Because of this, a `single` event can only be linked to a banner if that banner’s `title` appears somewhere in the same CSV file. Place banner rows before their related single rows for clarity, though the importer will still find them anywhere in the file.

If a `single` row has a `parent_title` that does not match any banner in the CSV, the single event will be imported as a standalone event.

## Step-by-step workflow

1. Open a spreadsheet (Excel, Google Sheets, Numbers) or a text editor.
2. Create a header row with the exact column names shown above.
3. Add one row per event.
4. Save the file as **CSV** (`.csv`).
5. In the Quality Calendar page, open the **Import CSV** modal.
6. Copy and paste the CSV contents into the text box and confirm the import.

## Examples

### Example 1: a single one-day event

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
single,Assessment deadline,All portfolios due,2026-09-15,2026-09-15,0,#00C4DF
```

### Example 2: a multi-day banner without weekends

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
banner,Induction week,Welcome and onboarding,2026-09-21,2026-09-25,0,#00C4DF
```

This banner will display Monday to Friday. It will not visually cover Saturday and Sunday when the calendar is in 7-day view.

### Example 3: a banner that spans the weekend

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
banner,Cross-campus review,Quality review week,2026-09-21,2026-09-27,1,#F59E0B
```

Because `include_weekends` is `1`, the banner will cover every day from Monday through Sunday.

### Example 4: banner with child single events

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
banner,Induction week,Welcome and onboarding,2026-09-21,2026-09-25,0,#00C4DF
single,Day 1 - Welcome,Introduction and registration,2026-09-21,2026-09-21,0,Induction week,#22C55E
single,Day 3 - Workshop,Core skills workshop,2026-09-23,2026-09-23,0,Induction week,#22C55E
single,Day 5 - Review,End-of-week review,2026-09-25,2026-09-25,0,Induction week,#22C55E
```

The `parent_title` for each `single` row matches the `title` of the banner. Those single events will appear as children of the `Induction week` banner.

### Example 5: values that contain commas

```csv
event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex
single,Staff meeting,"Review submissions, plan moderation",2026-10-02,2026-10-02,0,,#00C4DF
```

The description contains a comma, so it is wrapped in double quotes.

## Important rules

- Dates must be in `YYYY-MM-DD` format. The year must be four digits and months and days must be two digits where necessary, e.g. `2026-01-05`.
- `event_type` values are case-insensitive, but use lowercase (`banner` or `single`) to keep the file simple.
- `include_weekends` is `0` for false and `1` for true. Any value other than `1` is treated as `0`.
- A blank `parent_title` is allowed and means the single event has no parent banner.
- A `single` event can share the same `start_date` and `end_date` to represent a one-day marker under a banner.
- If a title contains a quote, escape it inside quotes: `Teachers" meeting` becomes `"Teachers"" meeting"`.

## Exporting as a starting template

The Quality Calendar page has an **Export CSV** button. It produces a file that follows the exact same format. You can download it, add or edit rows, and re-import it.

When you export, `parent_title` is filled in automatically for any single event that is currently linked to a banner.
