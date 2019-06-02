# Constructable Spectrum
##### Using Consructable Stylesheets for the Shadow DOM


**Important: This is not an official Adobe or Spectrum project, just a POC using Adobe's Spectrum Design System as it's basis**

Constructable Spectrum is a proof of concept for using a design system inside a Shadow DOM based Web Component.
The main selling point of the Shadow DOM is that it provides a protective Shadow Boundary to keep out unwanted style and JS calls.

This protective boundary also means that styles we actually want to use in our Web Component are also kept out. 
Approaches to design systems today require replicating an entire design system in each and every Web Component instance.

A new concept called Constructable Stylesheets aims to solve this problem by allowing the Shadow DOM to "adopt" stylesheets loaded
via Javascript. These stylesheets aren't copies, just referenced from an original that can be referenced by any number of Web Components
on a page.

#### The Challenge

With other frameworks and ecosystems, design systems including Spectrum need to be majorly reworked to be used.
My goal in Constructable Spectrum is to test that Spectrum can be consumed and used within Web Components as-is. This has been achieved, with some minor
nuances.

#### Global Caching and Spectrum Logic

To manage the loading and adoption of stylesheets, I created a tiny JS module to help called Style Shelter:
https://github.com/bengfarrell/style-shelter.

Ideally, being able to reference loaded stylesheets anywhere in your project means needing a global way to cache loaded 
stylesheets and serving loaded ones to other components that need the same ones.

Also, as Spectrum can be consumed as a custom set of UI components (only loading what is needed), some pieces should be adopted
by the <code>document</code> like CSS Vars, while the rest needs to be adopted by the <code>shadowRoot</code>. The <code>webcomponents/constructable-sepctrum.js</code> 
module manages the specific Spectrum logic to create lists of which CSS files need to be loaded for a given theme and set of UI components used, and
passes that to the Style Shelter module to handle loading and adopting.

With these modules, all CSS is handled by the individual component, while the index.html file doesn't 
know anything about what CSS needs to be loaded.


#### The Web Component Based Demo

After testing with a few components and achieving good results, I knew that it really meant nothing
until proving that every component works in some sort of demo. This demo is provided on this repo's Github Page https://bengfarrell.github.io/spectrum-css. There are 3 components in total
as part of the demo application: a sidenav containing a list of all the components, a preview area that renders the component example, and lastly the main application component
containing everything.

To provide data, I copied some output from the Gulp tasks managing the backstop generation. A full component list was provided in the "backstopscenario.json", and this is used to
power the side navigation featuring every component and component flavor. Meanwhile, the HTML snippets that are brought together to produce the real
Spectrum documentation, are copied to the demo app without being assembled, so they can be loaded at runtime, populating the preview area.

Each time new demo HTML is loaded, or the theme is changed, a new stylesheet list is calculated and adopted.

#### Spectrum Class Usage

Both the "spectrum" and "spectrum-medium" classes can be used either on the body or the application
component tag on the index.html page. Both of these selectors are so general and global, that the styles within <em>can</em> pierce the Shadow DOM.
One of the major complications with this POC happened to be icons. They are no longer populated in the head tag, so "spectrum-medium" is not required anywhere
in particular - just so long as it is present. The JS module logic that helps load Spectrum components also force the document to adopt
Spectrum Base so that these classes are meaningful here.

```html
<body>
    <spectrum-wc-app
            class="spectrum spectrum--medium"
            componentslocation="../"
            manifest="htmldocs/backstopScenarios.json">
    </spectrum-wc-app>
    <script src="./adoptedStyleSheets.js"></script>
</body>

```
 
#### Spectrum Theme Usage 

Because of the ability to change themes, it's not incredibly obvious in the demo source code that the theme class is present on a element that wraps the contents
of each component. The theme (spectrum--light or similar) class is added with JS.

It's worth pointing out that this containing element is required because the Spectrum theme selectors only effect descendant elements. It's possible, however to
do a search and replace in the theme file and replace ".spectrum--<theme>" with ":host", and then the containing element isn't required because the component is now 
acting like the container. This theme selector replace seems to be the only change required to make everything work.

#### Spectrum Icons

Icons were the biggest hiccup in this process. Currently, Spectrum's loadIcons.js places all icons in the head tag, with the ability to be referenced by their ID attribute.
This just isn't workable with the Shadow DOM, because components can't refer to elements outside their local DOM (at least <code>use xlink:href="#spectrum-css-icon-ChevronRightMedium"</code> did not work).

So, the Gulp task for icon generation was modified to create a JS module containing template literals of all icon SVG, accessed by getters corresponding to their original ID attribute.

```javascript
get AlertMedium() { return `<svg xmlns="http://www.w...
```

This was only half the battle, however. Part of the challenge was to not need to change the Spectrum markup either. I wanted to leave the icons markup as originally intended
and documented. So in the icons.js module, there is also a method to query select each icon instance in the entire local Shadow DOM, and populate using <code>innerHTML</code> on the outer SVG tag.
