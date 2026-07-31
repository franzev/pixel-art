# Collection Records

This directory contains text records for render collections, grouped by asset
category.

```text
collections/<category>/<collection>/
├── GENERATION-PROMPTS.md
├── STATUS.md
├── POSITIVE-REFERENCE-NOTES.md
├── REJECTION-NOTES.md
└── <collection>-manifest.json
```

Not every collection needs every file. Keep a prompt record only while the
collection has retained work or active drafts.

Do not store renders, downscaled references, review sheets, or temporary images
here:

- Active renders belong under `public/art/`.
- Intentional references belong under `samples/`.
- Review sheets belong under `art-catalog/review-sheets/`.
- Unclassified legacy images belong under `archive/legacy-art/`.
