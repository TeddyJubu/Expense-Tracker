## Summary

- Added a top-right overflow menu to the Overview (Home) header.
- Moved Profile out of the bottom tab bar and into a standalone `/profile` screen opened from the new menu.

## Files changed

- `.gitignore`: added common generated paths (`build/`, `.cache/`, `*.log`).
- `app/(tabs)/_layout.tsx`: removed the Profile tab.
- `app/(tabs)/index.tsx`: added `OverflowMenu` with a `Profile` action.
- `app/profile.tsx`: moved Profile screen out of tabs and added a back button.
- `components/ui/OverflowMenu.tsx`: new reusable anchored menu component.

## Verification

- `npm run lint` (passes; existing warnings remain in unrelated files).

