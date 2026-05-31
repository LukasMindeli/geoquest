# AdSense Setup

This project is prepared for AdSense, but ads stay disabled until a real
publisher ID and slot IDs are added.

## Files

- `assets/js/ads-config.js` - AdSense client and slot configuration
- `assets/js/core/ads.js` - safe loader that keeps ads hidden until config is valid
- `ads.txt.example` - template for the future root `ads.txt`

## Slot Map

- `menu` - main menu
- `result` - solo result panel
- `speedResult` - speed result panel
- `profile` - profile panel
- `daily` - daily challenge panel
- `leaderboard` - leaderboard panel

## Enable AdSense

1. Create or connect a real Google AdSense account.
2. Get the publisher ID in the format `ca-pub-XXXXXXXXXXXXXXXX`.
3. Create ad units in AdSense for the slots above.
4. Add the official AdSense verification snippet in the `<head>` of `index.html`.
5. Update `assets/js/ads-config.js` with the real publisher ID and slot IDs.
6. Create `ads.txt` in the project root from `ads.txt.example`.
7. Replace the placeholder publisher ID in `ads.txt`.
8. Deploy the updated project.

## Head Snippet

Use the official AdSense markup in `index.html` once the real publisher ID is
available:

```html
<meta name="google-adsense-account" content="ca-pub-1234567890123456">
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

## Example Config

```js
window.WOW_ADSENSE = {
  client: "ca-pub-1234567890123456",
  slots: {
    menu: "1234567890",
    result: "1234567891",
    speedResult: "1234567892",
    profile: "1234567893",
    daily: "1234567894",
    leaderboard: "1234567895"
  }
};
```

## Notes

- Do not commit a fake publisher ID.
- The slot loader is for placement only; site approval still needs the official
  AdSense head snippet above.
- Ads remain hidden if the config is empty or invalid.
- After deployment, verify that no ad overlaps game controls or the globe UI.
