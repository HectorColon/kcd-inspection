export class pdSignature extends HTMLDivElement {
  #points;
  #appendTo;
  #hideOnExit;
  #lineWidth;
  #lineColor;
  #buttonsColor;
  #buttonsBgColor;
  #header;
  #footer;
  #Style;
  #css;
  static get observedAttributes() {
    return ['appendToWhenSave', 'hideOnExit', 'lineColor', 'lineWidth', 'buttonsColor', 'buttonsBgColor', 'header', 'footer'];
  } 
  constructor() {
    super();
    this.sRoot = this.attachShadow({
      mode: 'closed'
    });
	if(this.#isEmpty(this.getAttribute("appendToWhenSave"))) {
		throw new Error('Attribute appendToWhenSave must not be empty!');
	} else {
		this.#appendTo = this.getAttribute("appendToWhenSave").replace(/(<([^>]+)>)/gi, '');
	}
    this.#hideOnExit = !this.#isEmpty(this.getAttribute("hideOnExit")) ? this.getAttribute("hideOnExit").replace(/(<([^>]+)>)/gi, '') : '';
    this.#lineWidth = this.getAttribute("lineWidth");
	if(this.#isEmpty(this.#lineWidth)) {
		this.#lineWidth = 2;
	}	
	if(this.#isEmpty(this.getAttribute("lineColor"))) {
		this.#lineColor = '#000000';
	} else {
		if(this.#isValidColor(this.getAttribute("lineColor"))) {
			this.#lineColor = this.getAttribute("lineColor");
		} else {
			this.#lineColor = '#000000';
		}
	}
	if(this.#isEmpty(this.getAttribute("buttonsColor"))) {
		this.#buttonsColor = '#ffffff';
	} else {
		if(this.#isValidColor(this.getAttribute("buttonsColor"))) {
			this.#buttonsColor = this.getAttribute("buttonsColor");
		} else {
			this.#buttonsColor = '#ffffff';
		}
	}
	if(this.#isEmpty(this.getAttribute("buttonsBgColor"))) {
		this.#buttonsBgColor = '#000000';
	} else {
		if(this.#isValidColor(this.getAttribute("buttonsBgColor"))) {
			this.#buttonsBgColor = this.getAttribute("buttonsBgColor");
		} else {
			this.#buttonsBgColor = '#000000';
		}
	}  
    this.#header = this.getAttribute("header").replace(/(<([^>]+)>)/gi, '');  
    this.#footer = this.getAttribute("footer").replace(/(<([^>]+)>)/gi, '');	
	this.#points = [];
    this.#init();
  }
  #isEmpty(value) {
    switch (true) {
      case (value == null || value == 'undefined' || value == false || value == ''):
        return true;
      case (Array.isArray(value)):
        return value.length == 0;
      case (typeof value == 'object'):
        return (Object.keys(value).length === 0 && value.constructor === Object);
      case (typeof value == 'string'):
        return value.length == 0;
      case (typeof value == 'number' && !isNaN(value)):
        return value === 0;
      default:
        return false;
    }
  }
  #prepareCSS() {
	this.outerWidth = this.parentElement.offsetWidth;
	this.outerHeight = this.parentElement.offsetHeight - 48;
	this.#css = '.signature-buttons{background-color:'+this.#buttonsBgColor+';color:'+this.#buttonsColor+';position:relative;height:5vh;width:'+this.outerWidth/16+'rem;display:flex;flex-direction:row;align-items:center;align-content:center;justify-content:stretch}.signature-buttons span{cursor:pointer;padding:0 1vw;display:flex;flex-direction:row;align-items:center;align-content:center;justify-content:center;background-color:'+this.#buttonsBgColor+';width:'+this.outerWidth/32+'rem;color:'+this.#buttonsColor+';font-size:2vh;height:5vh}.signature-buttons span:not(:first-child){border-left:.0625rem solid #fff}.signature-buttons span.active,.signature-buttons span:focus,.signature-buttons span:hover{color:'+this.#buttonsColor+';mix-blend-mode: difference;}#signature-'+(this.#isEmpty(this.id)?[...this.parentElement.children].indexOf(this):this.id)+'{position:relative;width:'+this.outerWidth/16+'rem;height:'+this.outerHeight/16+'rem;background-color: #ffffff;align-self:center;display:flex;align-items:center;align-content:center;justify-content:center;z-index:1;padding: 0;margin: 0;}';
    this.#Style = document.createElement("style");
    this.#Style.append(this.#css);
    this.sRoot.appendChild(this.#Style);
  }

  connectedCallback() {
    //this.contentbg = this.getAttribute("contentbg");
	//console.log('pd-signature component connected.');
  }

  disconnectedCallback() {
    //console.log('Disconnected.');
  }

  adoptedCallback() {
    //console.log('Adopted.');
  }
  #removeUI() {
	this.sRoot.innerHTML = '';
  }
  #isMobile() {
	  return navigator.maxTouchPoints >= 1;
  }
  #oldStyleSmoothWriting(callback) {
	  window.setTimeout(callback, 1000/60);
  }
  #smoothWriting(callback) {
	  let self = this;
	  return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimaitonFrame ||
		self.#oldStyleSmoothWriting(callback);
  }
  #renderCanvas(canvas, ctx, X, Y, e) {
	let self = this;
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = self.#lineWidth;
	ctx.strokeStyle = self.#lineColor;
	let xc = (X + e.clientX - canvas.offsetLeft) / 2;
	let yc = (Y + e.clientY + canvas.offsetTop) / 2;
	ctx.quadraticCurveTo(X, Y, xc, yc);
	ctx.stroke();
  }
  #getTouchPos(canvasDom, touchEvent) {
	return {
		x: touchEvent.touches[0].clientX - canvasDom.offsetLeft,
		y: touchEvent.touches[0].clientY - canvasDom.offsetTop
	};
  }
  #isValidColor(color) {
    if (color.charAt(0) === "#") {
        color = color.substring(1)
        return [3, 4, 6, 8].includes(color.length) && !isNaN(parseInt(color, 16));
    } else {
        return /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$/i.test(color);
    }
}
  #prepareUI() {
	let self = this;
	self.#removeUI();
	self.#prepareCSS();
	let buttonsContainer = document.createElement("div");
	let saveSignature = document.createElement("span");
	let hideOnExit = document.createElement("span");
	let clearPad = document.createElement("span");
	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext('2d');
	let textHeader = ctx.measureText(self.#header);
	let textFooter = ctx.measureText(self.#footer);
	let X, Y, down;
	buttonsContainer.classList.add('signature-buttons');
	saveSignature.id = 'save-signature';
	clearPad.id = 'clear-pad';
	saveSignature.innerHTML = 'Save Signature';
	clearPad.innerHTML = 'Clear Pad';
	hideOnExit.innerHTML = 'Exit';
    canvas.id = 'signature-'+(self.#isEmpty(self.id)?[...self.parentElement.children].indexOf(self):self.id);
	canvas.width = self.outerWidth;
	canvas.height = self.outerHeight;
	canvas.addEventListener('touchstart', (e) => {
		let mousePos = self.#getTouchPos(canvas, e);
		let touch = e.touches[0];
		let mouseEvent = new MouseEvent("mousedown", {
		clientX: touch.clientX,
		clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, {passive: true});
	canvas.addEventListener('touchend', (e) => {
		let mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, {passive: true});
	canvas.addEventListener('touchmove', (e) => {
		let touch = e.touches[0];
		let mouseEvent = new MouseEvent('mousemove', {
		clientX: touch.clientX,
		clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, {passive: true});
	canvas.addEventListener('mousedown', (e) => {
		e.preventDefault();
		self.#points = [];
		down = true;  
		X = e.clientX - canvas.offsetLeft;
		Y = e.clientY + canvas.offsetTop;
		self.#points.push([X,Y]);
    }, 0);
    canvas.addEventListener('mouseup', (e) => {
		e.preventDefault();
		down = false;
		if(self.#points.length > 1) {
			ctx.moveTo(self.#points[0][0], self.#points[0][1]);
			let i = 0;		
			while (i < self.#points.length - 1)
			{
			  let xc = (self.#points[i][0] + self.#points[i + 1][0]) / 2;
			  let yc = (self.#points[i][1] + self.#points[i + 1][1]) / 2;
			  ctx.quadraticCurveTo(self.#points[i][0], self.#points[i][1], xc, yc);
			  i++;
			}
			ctx.moveTo(self.#points[i-1][0], self.#points[i-1][1]);
			ctx.lineTo(self.#points[i][0], self.#points[i][1]);
			ctx.stroke();
		}
		if(!self.#isEmpty(self.#header) || !self.#isEmpty(self.#footer)) {
			ctx.globalAlpha = 0.95;
			ctx.beginPath();
			ctx.fillStyle = self.#lineColor;
			ctx.font = '12px arial';
			if(!self.#isEmpty(self.#header)) {
				ctx.fillText(self.#header, (self.outerWidth - textHeader.width)/2, 50);
			}
			if(!self.#isEmpty(self.#footer)) {
				ctx.fillText(self.#footer, (self.outerWidth - textFooter.width)/2, self.outerHeight - 50);
			}
			ctx.fill();
		}		
    }, 0);
    canvas.addEventListener('mousemove', (e) => {
		e.preventDefault();
		e.target.style.cursor = 'crosshair';
		ctx.moveTo(X, Y);
		if(down) {
			self.#smoothWriting(self.#renderCanvas(canvas, ctx, X, Y, e));
			X = e.clientX - canvas.offsetLeft;
			Y = e.clientY + canvas.offsetTop;
			self.#points.push([X,Y]);
		}
    }, 0);
	clearPad.addEventListener('click', () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if(!self.#isEmpty(self.#appendTo) && !self.#isEmpty(document.querySelector(`${self.#appendTo}`).firstChild)) {
			document.querySelector(`${self.#appendTo}`).firstChild.remove();
		}
	});	
	saveSignature.addEventListener('click', (e) => {
		e.preventDefault();
		let img = new Image();
		img.src = canvas.toDataURL();
		img.style.width = parseInt(canvas.width / 6);
		img.style.height = parseInt(canvas.height / 6);
		if(!self.#isEmpty(self.#appendTo)) {	
			document.querySelector(self.#appendTo).append(img);
		}
		if(self.#isEmpty(self.#appendTo)) {
			self.sRoot.append(img);
		}
	});	
	hideOnExit.addEventListener('click', (e) => {
		e.preventDefault();
		if(!self.#isEmpty(this.#hideOnExit)) {
			let parentElm = document.querySelector(this.#hideOnExit);
			parentElm.outerWidth = 0;
			parentElm.outerHeight = 0;
			parentElm.style.display = 'none';
		} else {
			self.outerWidth = 0;
			self.outerHeight = 0;
			self.style.display = 'none';
		}
	});
	buttonsContainer.append(saveSignature);
	buttonsContainer.append(clearPad);
	buttonsContainer.append(hideOnExit);
	self.sRoot.append(canvas);
	self.sRoot.append(buttonsContainer);
  }
  #init() {
	let self = this;
	self.#prepareUI();
	window.addEventListener('resize', () => {
		self.#prepareUI();
	});
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if(this.#isEmpty(this.getAttribute("appendToWhenSave"))) {
		throw new Error('Attribute appendToWhenSave must not be empty!');
	} else {
		this.#appendTo = this.getAttribute("appendToWhenSave").replace(/(<([^>]+)>)/gi, '');
	}
	if (name == "hideOnExit") {
		this.#hideOnExit = !this.#isEmpty(this.getAttribute("hideOnExit")) ? this.getAttribute("hideOnExit").replace(/(<([^>]+)>)/gi, '') : '';
    }
	if (name == "lineWidth") {
      this.#lineWidth = this.getAttribute("lineWidth");
    }
	if(this.#isEmpty(this.#lineWidth)) {
		this.#lineWidth = 2;
	}
	if(this.#isEmpty(this.getAttribute("lineColor"))) {
		this.#lineColor = '#000000';
	} else {
		if(this.#isValidColor(this.getAttribute("lineColor"))) {
			this.#lineColor = this.getAttribute("lineColor");
		} else {
			this.#lineColor = '#000000';
		}
	}
	if(this.#isEmpty(this.getAttribute("buttonsColor"))) {
		this.#buttonsColor = '#ffffff';
	} else {
		if(this.#isValidColor(this.getAttribute("buttonsColor"))) {
			this.#buttonsColor = this.getAttribute("buttonsColor");
		} else {
			this.#buttonsColor = '#ffffff';
		}
	}
	if(this.#isEmpty(this.getAttribute("buttonsBgColor"))) {
		this.#buttonsBgColor = '#000000';
	} else {
		if(this.#isValidColor(this.getAttribute("buttonsBgColor"))) {
			this.#buttonsBgColor = this.getAttribute("buttonsBgColor");
		} else {
			this.#buttonsBgColor = '#000000';
		}
	}
	if (name == "header") {
      this.#header = this.getAttribute("header").replace(/(<([^>]+)>)/gi, '');
    }
	if (name == "footer") {
      this.#footer = this.getAttribute("footer").replace(/(<([^>]+)>)/gi, '');
    }
	this.#init();
  }
}
if (!window.customElements.get('pd-signature')) {
  window.pdSignature = pdSignature;
  window.customElements.define('pd-signature', pdSignature, { extends: 'div' });
}
