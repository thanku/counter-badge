![ThankU logo](assets/thanku-logo.png)

**Say ThankU and Do Good** • [www.thanku.social](https://www.thanku.social) • Plant trees, clean the ocean, and protect animals

---

# ThankU Counter Badge (Web Component)

Show the number of ThankUs you've collected and sent on your website.

![ThankU Counter Badge Screenshot](assets/screenshot.gif)

**See a DEMO here: https://thanku.github.io/counter-badge/**

We make use of the latest browser features ([Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [module scripts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), etc.) which are well supported in current versions of [Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/), [Apple Safari](https://www.apple.com/safari/) and [Microsoft Edge](https://www.microsoft.com/en-us/edge). If you need to target older browser versions or Microsoft Internet Explorer, you need to provide appropriate polyfills.

## Installation

### Self hosted

Add the following to an HTML document:

```html
<script type="module" src="path/to/counter-badge.js"></script>
```

### CDN

Add the following to an HTML document:

```html
<script type="module" src="https://unpkg.com/@thanku/counter-badge"></script>
```

### [NPM](https://www.npmjs.com/package/@thanku/counter-badge)

Run `npm i @thanku/counter-badge`.

## Usage

Create a `<thanku-counter-badge>` element with default content for users of browsers that don't support Web Components and add your ThankU wallet name to attribute `slug`.

```html
<thanku-counter-badge slug="martin">
  <a href="https://thx.to/:martin">Visit my ThankU wallet</a>
</thanku-counter-badge>
```

To get the full ThankU look and feel, also include the following font inside `<head>`:

```html
<link href="https://www.thanku.social/fonts/exo.css" rel="stylesheet" />
```

### Attributes

- `slug` - Your ThankU wallet name (required)
- `lang` - The language used for the text inside of the widget (optional, available: `en`|`de`, defaults to `en`)
- `duration` - The number of milliseconds each slide will be displayed (optional, defaults to `1000`)

All attributes can be updated programatically, and the UI will update to reflect the changes.

```javascript
const widget = document.querySelector("thanku-counter-badge");
widget.slug = "lukasz";
widget.lang = "de";
```

### Styling

The style of the `<thanku-counter-badge>` element can be changed by setting the following custom properties / CSS variables:

- `--size` - The size of the badge (defaults to `100px`)

The CSS variables can be set e.g. inline via the `style` attribute like this:

```html
<thanku-counter-badge slug="martin" style="--size: 25vw">
</thanku-counter-badge>
```

## License

[MIT License](LICENSE)
