# pd-signature

A signature pad custom web component that can be used in web applications or websites.
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/pd-signature)

[Demo page (by unpkg.com)](https://unpkg.com/pd-signature@1.0.1/pd-signature.html)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

`node.js`

### Installing

`$ npm install pd-signature`

## Running the tests

`npm test`

### Tests output explanation

#### pd-signature

_**sRoot**_

_✓ Checks that component is attached to DOM._

_✓ Checks that it should fail if appendToSave is missing,_

_✓ Checks that it should fail if appendToSave=""._

_**sRoot**_

_✓ Checks that component is attached to DOM and has empty innerHTML and has all it's attributes empty._

_✓ Checks that component is attached to DOM and has a valid appendToWhenSave attribute._

_✓ Checks that component is attached to DOM and has a valid buttonsColor attribute._

_✓ Checks that component is attached to DOM and has a valid buttonsBgColor attribute._

_✓ Checks that component is attached to DOM and has a valid lineWidth attribute._

_✓ Checks that component is attached to DOM and has a valid lineColor attribute._

_✓ Checks that component is attached to DOM and has a valid header attribute._

_✓ Checks that component is attached to DOM and has a valid footer attribute._

##### Array

_**indexOf()**_

_✓ should return -1 when the value is not present. This is a demo test to check that the response from the testing framework is ok._


## Deployment

Add the custom element tag to your HTML page. 

The element's parameters are:

 - **appendToWhenSave** (string). Set the DOM element that the produced Image will be appended. 
 - **buttonsColor** (string - default `#ffffff`). Buttons color.
 - **buttonsBgColor** (string - default `#ffffff`). Buttons background color.
 - **hideOnExit** (string). Set the DOM element that will be hidden upon click of `Exit` button.
 - **lineColor** (string - default `#000000`).Line color that will be used for drawing at the signature pad.
 - **lineWidth** (string - default `10`). Line width that will be used for drawing at the signature pad.
 - **header** (string). Set signature pad header.
 - **footer** (string). Set signature pad footer.
**Basic Usage**

***Example CSS***

    html, body {
		font-family: 'Open Sans';
		height: 100%;
		overflow: hidden;
		-webkit-perspective: 37.5rem;
		-moz-perspective: 37.5rem;
		perspective: 37.5rem;
		background-color: #cecece;
		display: flex;
		flex-flow: column;
		align-items: stretch;
		align-content: space-between;
		justify-content: stretch;
		}
		:host {
		display: block;
		}
		[is="pd-signature:not(:defined)"] {
		display: none;
		}
		[is="pd-signature"] {
		display: flex;
		flex-flow: column;
		align-items: center;
		align-content: center;
		justify-content: center;
		width: 100vw;
		}
		#output {
		width: 18.675%;
		height: 10.25%;
		display: block;
		position: fixed;
		left 0;
		top: 0;
		z-index: 2;
		}
		#output img{
		width: 100%;
		height: auto;
		z-index: 2;
	}

***Example HTML***

	<div is="pd-signature" appendToWhenSave="#output" buttonsColor="#faaeaa" buttonsBgColor="#850203" lineWidth="3" lineColor="#00ff00" header="PD-SIGNATURE" footer="A simple signature pad web component, for mobile and desktop devices!"></div>
	<div id="output"></div>

You can change the element's attributes/appearance by using Javascript, for example:

	customElements.whenDefined('pd-signature').then(() => {
		document.querySelector("pd-signature").setAttribute("header","my custom header");
		document.querySelector("pd-signature").setAttribute("footer","my custom footer");
	});

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request 😁

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details