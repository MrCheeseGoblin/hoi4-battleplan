# Design direction

## Character

The interface should feel like a calm strategic planning room: serious, compact, practical, and original. It must not imitate the Hearts of Iron IV interface.

## Visual system

- Deep navy-charcoal background.
- Slightly lighter planning panels and ruled surfaces.
- Muted olive as the primary action and status colour.
- Warm paper and brass accents for emphasis.
- Cool grey text with strong contrast.
- System fonts for fast, reliable loading.
- Fine borders, restrained shadows, and subtle grid textures.

## Layout

- A bounded content width with generous edge padding.
- Compact cards and stat panels that still breathe on small screens.
- Clear page eyebrow, heading, summary, and metadata hierarchy.
- Navigation that wraps cleanly rather than hiding essential routes.
- Responsive grids that collapse to one column without losing meaning.

## Interaction

- Visible keyboard focus.
- Minimum practical touch targets.
- Semantic links and buttons.
- Motion is optional, brief, and disabled for reduced-motion preferences.
- Empty and error states explain the next useful action.

## Branding

The original placeholder mark is a simple four-cell planning grid with one highlighted objective. It is rendered in CSS/SVG created for this project and does not use official artwork.

## Accessibility target

Aim for WCAG 2.2 AA:

- Logical heading order.
- Landmark elements.
- Text contrast of at least 4.5:1 for normal text.
- Keyboard-operable navigation.
- Clear focus indication.
- No information conveyed by colour alone.
